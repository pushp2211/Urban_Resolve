import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { getOptimizedUrl, uploadOnCloudinary } from '../utils/cloudinary.js';
import { ROLES, ROLES_ENUM } from '../enum/roles.js';
import { Complaint } from '../models/complaint.model.js';
import { COMPLAINT_STATUS, COMPLAINT_STATUS_ENUM } from '../enum/ComplaintStatus.js';
import crypto from "crypto";
import { sendEmail } from '../utils/sendEmail.js';
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
    if (password.length < 8) {
        throw new apiError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({
        email,
    });
    if (existingUser && existingUser.isEmailVerified===true) {
        throw new apiError(409, 'User already exists, please login');
    }
    if(existingUser && !existingUser.isEmailVerified===true){
        await User.deleteOne({ email: existingUser.email });
    }

    const profilePictureLocalPath = req.files?.profilePicture[0].path;
    if (!profilePictureLocalPath) {
        throw new apiError(400, 'Profile picture is required for authenticity');
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

    if (!profilePicture) {
        throw new apiError(500, 'Error uploading profile picture');
    }
    const optimisedProfilePictureUrl = getOptimizedUrl(profilePicture.url)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    // console.log(optimisedProfilePictureUrl);
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email.toLowerCase()}`;
    const emailResponse = await sendEmail(
    email.toLowerCase(),
    "Verify your email address",
    `<p>Hi ${fullName},</p>
     <p>Click below to verify your email:</p>
     <p><a href="${verifyLink}" target="_blank">${verifyLink}</a></p>
     <p>This link expires in 1 hour.</p>`
    );
    // console.log("Below is email response");
    // console.log(emailResponse);
    // console.log(emailResponse.code);
    if(emailResponse.code>=400){
        throw new apiError(400, "Invalid email address")
    }
    const user = await User.create({
        fullName,
        email : email.toLowerCase(),
        password,
        profilePicture: optimisedProfilePictureUrl,
        address: {
            locality: locality,
            pinCode: pinCode,
            district: district,
            city: city,
            state: state,
        },
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
    });
    

    
    const createdUser = await User.findById(user._id)?.select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new apiError(500, 'Encountered an error while registering the user');
    }
    return res
        .status(201)
        .json(new apiResponse(201, createdUser, 'User registered Successfully, verify your email to login'));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email) {
        throw new apiError(400, 'username and email both are required');
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({
        email: newEmail,
    });
    if (!user) {
        throw new apiError(
            404,
            'User not found, Please register and try login again'
        );
    }
    if(!user.isEmailVerified){
        throw new apiError(403, "Please verify your email before logging in.");
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
        sameSite: 'none',
    };
    console.log(loggedInUser);

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                },
                'User logged in successfully'
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
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
        httpOnly: true,
        secure: true,
        sameSite: "none", // Match the 'Lax' setting used elsewhere
    };

    return res
        .status(200)
        .clearCookie('refreshToken', options)
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
    } else if (userRole === ROLES.USER || userRole === ROLES.ADMIN) {
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

  const initialStats = Object.fromEntries(COMPLAINT_STATUS_ENUM.map(status => [status, 0])); //to take all states intially
  //to ensure that even if the status result is 0, it is in our Complaint stats result

  // Convert the aggregation result array into a more convenient object
  // e.g., from [{ _id: 'PENDING', count: 5 }] to { PENDING: 5 }
  const complaintStats = complaintStatusCounts.reduce((acc, status) => {
    acc[status._id] = status.count; //status curreent value ko denote krta hai aur acc result array hai
    return acc;
  }, initialStats);

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

// const updatePassword = asyncHandler(async(req, res)=>{
//     const
// })

const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "Not authorized");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const {
    currentPassword,
    newPassword,
    fullName,
    email,
    locality,
    district,
    city,
    pinCode,
    state,
  } = req.body;

  if (!currentPassword) {
    throw new apiError(400, "Enter your current password to modify profile");
  }

  const isValidPassword = await user.isPasswordCorrect(currentPassword);
  if (!isValidPassword) {
    throw new apiError(403, "Incorrect current password");
  }

  if (email) user.email = email.toLowerCase();
  if (fullName) user.fullName = fullName;

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

  if (newPassword) {
    if (newPassword.length < 8) {
      throw new apiError(422, "New password must be at least 8 characters long");
    }

    if (newPassword === currentPassword) {
      throw new apiError(400, "New password cannot be same as current password");
    }

    user.password = newPassword;
  }

  const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;

  if (profilePictureLocalPath) {
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    const optimizedUrl = getOptimizedUrl(profilePicture.url);

    if (!profilePicture) {
      throw new apiError(500, "Error uploading profile picture");
    }

    user.profilePicture = optimizedUrl;
  }

  const updatedUser = await user.save();

  const responseUser = await User.findById(updatedUser._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new apiResponse(200, responseUser, "Profile updated successfully")
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, state, district, pinCode, email, page = 1, limit = 10 } = req.query;

  const filter = {};

  // Apply role filter
  if (role) {
    filter.role = role;
  }

  // Apply email filter with case-insensitive regex
  if (email) {
    filter.email = { $regex: new RegExp(email, 'i') };
  }

  // Apply address filters with case-insensitive regex
  if (state) {
    filter['address.state'] = { $regex: new RegExp(`^${state}$`, 'i') };
  }
  if (district) {
    filter['address.district'] = { $regex: new RegExp(`^${district}$`, 'i') };
  }
  if (pinCode) {
    filter['address.pinCode'] = pinCode;
  }

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select('-password -refreshToken -emailVerificationToken -emailVerificationExpiry')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalCount = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        users,
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: parseInt(limit),
      },
      'Users fetched successfully'
    )
  );
});

export { registerUser, loginUser, logoutUser, userProfile, editProfile, getAllUsers };
