
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) throw new apiError(400, "Invalid link");

  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "User not found");

  if (user.isEmailVerified)
    throw new apiError(400, "Email already verified");

  if (
    user.emailVerificationToken !== token ||
    user.emailVerificationExpiry < Date.now()
  ) {
    throw new apiError(400, "Link is invalid or expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  res.status(200).json(new apiResponse(200, "Email verified succesfully you can now login"));
});
