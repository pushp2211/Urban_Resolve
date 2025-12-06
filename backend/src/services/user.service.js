import { Complaint } from '../models/complaint.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { COMPLAINT_URGENCY } from '../enum/ComplaintUrgency.js';
import { COMPLAINT_STATUS } from '../enum/ComplaintStatus.js';
import mongoose from 'mongoose';
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
    urgency
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
  if(urgency){
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
