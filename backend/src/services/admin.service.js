import { Complaint } from '../models/complaint.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { ROLES } from '../enum/roles.js';
import { COMPLAINT_STATUS } from '../enum/ComplaintStatus.js';

const getUserStats = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const admin = await User.findById(adminId);
  if(!admin){
    throw new apiError(
        500, "invalid user"
    )
  }

  if (admin.role != ROLES.ADMIN) {
    throw new apiError(
      403,
      'unauthorised access, this is only accessible by admin'
    );
  }

  const { district, city, state } = req.query;
  const filter = {};
  if (district) {
    filter['address.district'] = district;
  }
  if (city) {
    filter['address.city'] = city;
  }
  if (state) {
    filter['address.state'] = state;
  }

  const userStatsAggregation = await User.aggregate([
    {
      $match: filter,
    },
    {
      $facet: {
        totalUsers: [{ $match: { role: ROLES.USER } }, { $count: 'count' }],
        totalStaffs: [{ $match: { role: ROLES.STAFF } }, { $count: 'count' }],
        totalAdmins: [{ $match: { role: ROLES.ADMIN } }, { $count: 'count' }],
      },
    },
  ]);

  if (!userStatsAggregation) {
    throw new apiError(500, 'Could not fetch user statistics.');
  }

  const stats = userStatsAggregation[0];
  const totalUsers = stats.totalUsers[0]?.count || 0;
  const totalStaffs = stats.totalStaffs[0]?.count || 0;
  const totalAdmins = stats.totalAdmins[0]?.count || 0;

  const response = {
    total: totalUsers + totalStaffs + totalAdmins,
    users: totalUsers,
    staffs:totalStaffs,
    admins:totalAdmins,
  }

  return res.status(200)
  .json(new apiResponse(200, response, "Global user stats fetched successfully"))
});


const getComplaintStats = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new apiError(
      403,
      'Forbidden: This action is restricted to administrators.'
    );
  }

  const { district, city, state } = req.query;
  const addressFilter = {};
  if (district) addressFilter['address.district'] = district;
  if (city) addressFilter['address.city'] = city;
  if (state) addressFilter['address.state'] = state;

  const complaintStatsAggregation = await Complaint.aggregate([
    {
      $match: addressFilter,
    },
    {
      $facet: {
        totalResolved: [
          { $match: { status: COMPLAINT_STATUS.RESOLVED } },
          { $count: 'count' },
        ],
        totalPending: [
          { $match: { status: COMPLAINT_STATUS.PENDING } },
          { $count: 'count' },
        ],
        totalRejected: [
          { $match: { status: COMPLAINT_STATUS.REJECTED } },
          { $count: 'count' },
        ],
        totalInProgress: [
          { $match: { status: COMPLAINT_STATUS.IN_PROGRESS } },
          { $count: 'count' },
        ],
        totalPendingReview: [
          { $match: { status: COMPLAINT_STATUS.PENDING_REVIEW } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  if (!complaintStatsAggregation.length) {
    throw new apiError(500, 'Could not fetch complaint statistics.');
  }

  const stats = complaintStatsAggregation[0];

  const totalResolved = stats.totalResolved[0]?.count || 0;
  const totalPending = stats.totalPending[0]?.count || 0;
  const totalRejected = stats.totalRejected[0]?.count || 0;
  const totalInProgress = stats.totalInProgress[0]?.count || 0;
  const totalPendingReview = stats.totalPendingReview[0]?.count || 0;

  const response = {
    total:
      totalResolved +
      totalPending +
      totalRejected +
      totalInProgress +
      totalPendingReview,
    resolved: totalResolved,
    pending: totalPending,
    rejected: totalRejected,
    inProgress: totalInProgress,
    pendingReview: totalPendingReview,
  };

  return res
    .status(200)
    .json(
      new apiResponse(200, response, 'Complaint statistics fetched successfully.')
    );
});

export { getUserStats, getComplaintStats };