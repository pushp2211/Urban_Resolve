import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    }
    catch(error){
        console.log("error in generating access token and refresh token");
        throw new apiError(500, "something went wrong while generating access token and refresh token");
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        throw new apiError(400, "fullname, email and password all three fields are necessary")
    }

    const existingUser = await User.findOne({
        email
    });
    if(existingUser){
        throw new apiError(409, "User already exists, please login");
    }

    const profilePictureLocalPath = req.files?.profilePicture[0].path;
    if(!profilePictureLocalPath){
        throw new apiError(400, "Profile picture is required for authenticity");
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

    if(!profilePicture){
        throw new apiError(500, "Error uploading profile picture");
    }

    const user= await User.create({
        fullName,
        email,
        password,
        profilePicture : profilePicture.url,
    })

    const createdUser = await User.findById(user._id)?.select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Encountered an error while registering the user");
    }
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )
});

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    if(!password || !email){
        throw new apiError(400, "username and email both are required");
    }

    const user = await User.findOne({
        email
    })
    if(!user){
        throw new apiError(404, "User not found, Please register and try login again");
    }

    //password checking
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new apiError(404, "Invalid credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //sendin cookie
    //cookie is modifiable from server only
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log(loggedInUser);

    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken,
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken:1 //this removes the field from document
            },
        },
        {
            new:true
        }
    )
    const options = {
        //ye krne se ab cookies bs server se modifiable hain
        httpOnly: true, 
        secure: true 
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json( new apiResponse(200, {}, "user logged out"))
})


export {
    registerUser,
    loginUser,
    logoutUser
}