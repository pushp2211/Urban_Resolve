//verify krega ki. user hai ya nhi hai

import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer', '');
    const refreshToken = req.cookies?.refreshToken;

    if (!token) {
      if (!refreshToken) {
        throw new apiError(401, 'unauthorized access');
      }
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedRefreshToken?._id);
      if (!user) {
        throw new apiError(401, 'Invalid refresh token');
      }
      if (refreshToken !== user.refreshToken) {
        throw new apiError(401, 'Refresh token is expired or used');
      }
      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();
      const options = { httpOnly: true, secure: true };
      res
        .cookie('accessToken', newAccessToken, options)
        .cookie('refreshToken', newRefreshToken, options);

      req.user = user;
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      throw new apiError(401, 'invalid åccess token');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        // If the access token is expired, we use the refresh token
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new apiError(401, 'Session expired. Please log in again.');
        }

        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedRefreshToken?._id);

        if (!user) {
          throw new apiError(401, 'Invalid Refresh Token');
        }

        // You should also verify if the refresh token in the cookie matches the one stored in your database
        if (refreshToken !== user.refreshToken) {
          throw new apiError(401, 'Refresh token is expired or used');
        }

        // If refresh token is valid, generate new tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        const options = { httpOnly: true, secure: true };
        res
          .cookie('accessToken', newAccessToken, options)
          .cookie('refreshToken', newRefreshToken, options);

        // Attach user to request and proceed
        req.user = user;
        next();
      } catch (refreshError) {
        // If refresh token is also invalid or expired
        throw new apiError(
          401,
          refreshError?.message || 'Invalid refresh token. Please log in again.'
        );
      }
    } else {
      throw new apiError(401, error?.message || 'Invalid access token');
    }
  }
});
