import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ROLES } from '../enum/roles.js';
import { ROLES_ENUM } from '../enum/roles.js';
// Defines the valid roles in your system.

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    // The role is now a simple string, as requested.
    role: {
      type: String,
      enum: ROLES_ENUM,
      default: ROLES.USER,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    address: {
      locality: { type: String, required: true, trim: true, lowercase: true },
      city: { type: String, required: true, trim: true, lowercase: true },
      district: { type: String, required: true, trim: true, lowercase: true },
      pinCode: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{6}$/, 'Please fill a valid 6-digit pin code'],
      },
      state: { type: String, required: true, trim: true, lowercase: true },
    },
    refreshToken: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
      index: { expireAfterSeconds: 3600 },
    },
  },

  {
    timestamps: true,
  }
);


userSchema.pre('save', async function (next) {
  
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updatePassword = async function (newPassword){
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  this.password = newPassword;
  await this.save();
  return this;

}


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role, 
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model('User', userSchema);
