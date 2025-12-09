import { Complaint } from '../models/complaint.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { COMPLAINT_URGENCY } from '../enum/ComplaintUrgency.js';
import { COMPLAINT_STATUS } from '../enum/ComplaintStatus.js';
import mongoose from 'mongoose';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
export const getCommonComplaintDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.address?.district) {
    throw new apiError(
      404,
      'User profile or address not found, Please complete your profile'
    );
  }

  const {
    district,
    pinCode,
    locality,
    city,
    dateRange,
    status,
    page = 1,
    limit = 10,
    submittedBy,
    assignedTo,
    sortBy,
    urgency,
  } = req.query;

  const filter = {};
  if (district) {
    filter['address.district'] = String(district).toLowerCase();
  }

  if (pinCode) {
    filter['address.pinCode'] = String(pinCode);
  }

  if (locality) {
    filter['address.locality'] = String(locality).toLowerCase();
  }
  if (city) {
    filter['address.city'] = String(city).toLowerCase();
  }
  if (status) {
    filter.status = status;
  }
  if (urgency) {
    filter.urgency = urgency;
  }

  if (dateRange == 'this_month') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    filter.createdAt = {
      $gte: startOfMonth,
    };
  }
  if (submittedBy) {
    filter.submittedBy = new mongoose.Types.ObjectId(submittedBy);
  }
  if (assignedTo) {
    filter.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  // console.log('RAW QUERY:', req.query);
  // console.log(filter);
  const pipeline = [
    { $match: filter },
    {
      $addFields: {
        urgencyValue: {
          $switch: {
            branches: [
              { case: { $eq: ['$urgency', COMPLAINT_URGENCY.LOW] }, then: 1 },
              {
                case: { $eq: ['$urgency', COMPLAINT_URGENCY.MEDIUM] },
                then: 2,
              },
              { case: { $eq: ['$urgency', COMPLAINT_URGENCY.HIGH] }, then: 3 },
            ],
            default: 1,
          },
        },
      },
    },
    {
      $sort:
        sortBy === 'urgency_asc'
          ? { urgencyValue: 1 }
          : sortBy === 'urgency_desc'
            ? { urgencyValue: -1 }
            : { createdAt: -1 },
    },
    //pagination
    { $skip: skip },
    //add submitted by and assigned to
    { $limit: parseInt(limit) },

    {
      $lookup: {
        from: 'users',
        localField: 'submittedBy',
        foreignField: '_id',
        as: 'submittedBy',
      },
    },
    {
      $unwind: { path: '$submittedBy', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
      },
    },
    {
      $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        title: 1,
        description: 1,
        type: 1,
        address: 1,
        photoUrl: 1,
        status: 1,
        urgency: 1,
        urgencyValue: 1,
        createdAt: 1,
        updatedAt: 1,

        submittedBy: {
          _id: 1,
          fullName: 1,
          email: 1,
          profilePicture: 1,
        },

        assignedTo: {
          _id: 1,
          fullName: 1,
          email: 1,
          profilePicture: 1,
        },
      },
    },
  ];

  const complaints = await Complaint.aggregate(pipeline);

  // const options = {
  //     page: parseInt(page, 10),
  //     limit: parseInt(limit, 10),
  //     sort: {createdAt:-1},
  //     populate:[
  //         {path: 'submittedBy', select: 'fullName email profilePicture'},
  //         {path:'assignedTo', select: 'fullName email profilePicture'}
  //     ]
  // }

  // const complaints = await Complaint.find(filter)
  // .populate(options.populate)
  // .sort(options.sort)
  // .skip((options.page-1)*options.limit)
  // .limit(options.limit)

  // console.log(complaints);
  const totalComplaints = await Complaint.countDocuments(filter);

  const responsePayload = {
    complaints,
    totalPages: Math.ceil(totalComplaints / parseInt(limit)),
    currentPage: parseInt(page),
    totalCount: totalComplaints,
  };

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        responsePayload,
        'User specific dashboard fetched successfully.'
      )
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(400, 'Email is required');
  }
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new apiError(404, 'User not found');
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  console.log(resetUrl);
  try {
    const message = `<h2>Hi ${user.fullName},</h2>
     <p>You requested to reset your password</p>
     <p>click on the link below to reset your password</p>
     <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
     <p>This link will expire in 15 minutes.</p>`;

    await sendEmail(email, 'Reset password', message);

    return res
      .status(200)
      .json(new apiResponse(200, null, 'Reset password email sent'));
  } catch (error) {
    user.resetPasswordExpiry=undefined;
    user.resetPasswordToken = undefined;
    await user.save({validateBeforeSave:false});

    throw new apiError(500, "Email could not be sent");
  }
});


export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const {password} = req.body;
  if(!password) throw new apiError(400, "Password is required");

  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex")

  const user = await User.findOne({
    resetPasswordToken:hashedToken,
    resetPasswordExpiry: {$gt: Date.now()},
  })

  if(!user){
    throw new apiError(400, "Invalid or expired password reset token");
  }

  user.password = password;
  
  user.refreshToken = undefined;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  return res.status(200)
  .json(new apiResponse(200, null, "Passoword has been reset successfully, you can now login"));
});
