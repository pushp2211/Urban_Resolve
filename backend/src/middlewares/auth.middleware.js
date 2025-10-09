//verify krega ki. user hai ya nhi hai

import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken 
//     const refreshToken = req.cookies?.refreshToken;

//     if (!token) {
//       if (!refreshToken) {
//         throw new apiError(401, 'unauthorized access');
//       }
//       const decodedRefreshToken = jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET
//       );
//       const user = await User.findById(decodedRefreshToken?._id);
//       if (!user) {
//         throw new apiError(401, 'Invalid refresh token');
//       }
//       if (refreshToken !== user.refreshToken) {
//         throw new apiError(401, 'Refresh token is expired or used');
//       }
//       const newAccessToken = user.generateAccessToken();
//       const newRefreshToken = user.generateRefreshToken();
//       const options = { httpOnly: true, secure: true };
//       res
//         .cookie('accessToken', newAccessToken, options)
//         .cookie('refreshToken', newRefreshToken, options);

//       req.user = user;
//       return next();
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       '-password -refreshToken'
//     );

//     if (!user) {
//       throw new apiError(401, 'invalid åccess token');
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       try {
//         // If the access token is expired, we use the refresh token
//         const refreshToken = req.cookies?.refreshToken;
//         if (!refreshToken) {
//           throw new apiError(401, 'Session expired. Please log in again.');
//         }

//         const decodedRefreshToken = jwt.verify(
//           refreshToken,
//           process.env.REFRESH_TOKEN_SECRET
//         );
//         const user = await User.findById(decodedRefreshToken?._id);

//         if (!user) {
//           throw new apiError(401, 'Invalid Refresh Token');
//         }

//         // You should also verify if the refresh token in the cookie matches the one stored in your database
//         if (refreshToken !== user.refreshToken) {
//           throw new apiError(401, 'Refresh token is expired or used');
//         }

//         // If refresh token is valid, generate new tokens
//         const newAccessToken = user.generateAccessToken();
//         const newRefreshToken = user.generateRefreshToken();

//         const options = { httpOnly: true, secure: true };
//         res
//           .cookie('accessToken', newAccessToken, options)
//           .cookie('refreshToken', newRefreshToken, options);

//         // Attach user to request and proceed
//         req.user = user;
//         next();
//       } catch (refreshError) {
//         // If refresh token is also invalid or expired
//         throw new apiError(
//           401,
//           refreshError?.message || 'Invalid refresh token. Please log in again.'
//         );
//       }
//     } else {
//       throw new apiError(401, error?.message || 'Invalid access token');
//     }
//   }
// });

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    throw new apiError(401, "Unauthorized access");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) throw new apiError(401, "User not found");
    req.user = user;
    return next();

  } catch (error) {
    if (error.name !== "TokenExpiredError") {
      // If it’s invalid for other reasons (tampered, malformed)
      throw new apiError(401, error.message || "Invalid access token");
    }
  }

  // Handle expired token *outside* the catch now
  try {
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedRefresh._id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new apiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    const cookieOptions = { httpOnly: true, secure: true, sameSite: "strict" };
    res
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions);

    req.user = user;
    next();
  } catch (refreshError) {
    throw new apiError(401, refreshError.message || "Session expired. Please log in again.");
  }
});