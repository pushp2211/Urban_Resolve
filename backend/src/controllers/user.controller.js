import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ROLES, ROLES_ENUM } from '../enum/roles.js';
import { Complaint } from '../models/complaint.model.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log('error in generating access token and refresh token');
        throw new apiError(
            500,
            'something went wrong while generating access token and refresh token'
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        password,
        locality,
        district,
        city,
        pinCode,
        state,
    } = req.body;

    if (
        !fullName ||
        !email ||
        !password ||
        !locality ||
        !district ||
        !city ||
        !pinCode ||
        !state
    ) {
        throw new apiError(
            400,
            'fullname, email and password and address fields are necessary'
        );
    }

    const existingUser = await User.findOne({
        email,
    });
    if (existingUser) {
        throw new apiError(409, 'User already exists, please login');
    }

    const profilePictureLocalPath = req.files?.profilePicture[0].path;
    if (!profilePictureLocalPath) {
        throw new apiError(400, 'Profile picture is required for authenticity');
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

    if (!profilePicture) {
        throw new apiError(500, 'Error uploading profile picture');
    }

    const user = await User.create({
        fullName,
        email,
        password,
        profilePicture: profilePicture.url,
        address: {
            locality: locality,
            pinCode: pinCode,
            district: district,
            city: city,
            state: state,
        },
    });

    const createdUser = await User.findById(user._id)?.select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new apiError(500, 'Encountered an error while registering the user');
    }
    return res
        .status(201)
        .json(new apiResponse(201, createdUser, 'User registered Successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email) {
        throw new apiError(400, 'username and email both are required');
    }

    const user = await User.findOne({
        email,
    });
    if (!user) {
        throw new apiError(
            404,
            'User not found, Please register and try login again'
        );
    }

    //password checking
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(404, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );
    //sendin cookie
    //cookie is modifiable from server only
    const options = {
        httpOnly: true,
        secure: true,
    };
    console.log(loggedInUser);

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successfully'
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, //this removes the field from document
            },
        },
        {
            new: true,
        }
    );
    const options = {
        //ye krne se ab cookies bs server se modifiable hain
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json(new apiResponse(200, {}, 'user logged out'));
});

const userProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, 'Not authorized, no user ID provided');
    }

    // Find the user in the database by their ID
    const user = await User.findById(userId).select('-password'); // Exclude password from result

    if (!user) {
        throw new apiError(404, 'User Not Found');
    }

    const userRole = user.role;
    let matchQuery = {};

    // Determine the match criteria based on the user's role
    if (userRole === ROLES.STAFF) {
        matchQuery = { assignedTo: userId };
    } else if (userRole === ROLES.USER) {
        matchQuery = { submittedBy: userId };
    } else {
        // Handle cases where user might not have a role that sees complaints
        matchQuery = { _id: null }; // An impossible query to return no results
    }

    // Use an aggregation pipeline to efficiently count complaints by status
    const complaintStatusCounts = await Complaint.aggregate([
        {
            $match: matchQuery,
        },
        {
            $group: {
                _id: '$status', // Group documents by their status
                count: { $sum: 1 }, // Count the documents in each group
            },
        },
    ]);

    // Convert the aggregation result array into a more convenient object
    // e.g., from [{ _id: 'PENDING', count: 5 }] to { PENDING: 5 }
    const complaintStats = complaintStatusCounts.reduce((acc, status) => {
        acc[status._id] = status.count; //status curreent value ko denote krta hai aur acc result array hai
        return acc;
    }, {});

    const data = {
        role: userRole,
        complaintStats,
        user,
    };

    // Return a standardized success response
    return res
        .status(200)
        .json(new apiResponse(200, data, 'User profile fetched successfully.'));
});

const editProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, "Not authorized, no user ID found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }

    const {
        email,
        password,
        locality,
        district,
        city,
        pinCode,
        state,
    } = req.body;

    if (email) user.email = email.toLowerCase();

    // Update password if provided

    if (password) {
        if (password.length < 8) {
            throw new apiError(400, "Password must be at least 8 characters long");
        }
        user.password = await bcrypt.hash(password, 10);
    }

    if (locality || district || city || pinCode || state) {
        user.address = {
            ...user.address.toObject(),
            ...(locality && { locality }),
            ...(district && { district }),
            ...(city && { city }),
            ...(pinCode && { pinCode }),
            ...(state && { state }),
        };
    }
    // Handle profile picture upload if a new file is provided
    const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
    if (profilePictureLocalPath) {
        const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
        if (!profilePicture) {
            throw new apiError(500, "Error uploading profile picture");
        }
        user.profilePicture = profilePicture.url;
    }

    const updatedUser = await user.save();

    const responseUser = await User.findById(updatedUser._id).select(
        "-password -refreshToken"
    );

    return res.status(200).json(
        new apiResponse(200, responseUser, "User profile updated successfully")
    );
});
export { registerUser, loginUser, logoutUser, userProfile, editProfile };
