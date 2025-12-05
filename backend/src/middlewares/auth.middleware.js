import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // 1. Get accessToken from Authorization header (e.g., "Bearer <token>")
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  // 2. Get refreshToken from cookies
  const { refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    throw new apiError(401, "Unauthorized request: No tokens provided");
  }

  // First, try to verify the accessToken
  try {
    if (!accessToken) {
        // If no access token, jump directly to refresh token logic
        throw new Error("Access token missing");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new apiError(401, "Invalid Access Token: User not found");
    }

    req.user = user;
    return next(); // User is verified, proceed to the next middleware/controller

  } catch (error) {
    // If accessToken is expired or invalid, we'll try to use the refreshToken
    // We only proceed if a refreshToken exists
    if (!refreshToken) {
        throw new apiError(401, "Session expired. Please log in again.");
    }
  }

  // If the access token verification failed, try to refresh it using the refresh token
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
        throw new apiError(401, "Invalid Refresh Token: User not found");
    }

    // Security check: Ensure the refresh token from the cookie matches the one in the database
    if (user.refreshToken !== refreshToken) {
      throw new apiError(401, "Refresh token is expired or has been used");
    }
    
    // If everything is okay, generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken(); // It's good practice to rotate refresh tokens as well

    const cookieOptions = {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
    };

    // We can't send the new access token in the response body from a middleware
    // So, we'll attach it to a custom response header. The frontend can check for this header.
    res.setHeader('X-Access-Token', newAccessToken);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    // Attach the user to the request and continue
    req.user = user;
    next();
    
  } catch (refreshError) {
    // If the refresh token is also invalid or expired
    throw new apiError(401, refreshError.message || "Session expired. Please log in again.");
  }
});