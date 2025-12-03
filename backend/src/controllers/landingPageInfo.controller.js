import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../enum/roles.js';
import { Complaint } from '../models/complaint.model.js';
import { COMPLAINT_STATUS } from '../enum/ComplaintStatus.js';

import cache from '../utils/cacheManager.js';

export const getLandingPageUserStats = asyncHandler(async (req, res) => {

  const cached = cache.get("landing-user-stats");//getting from cache
  if(cached){
    return res.status(200)
    .json( new apiResponse(200, cached, "landing page user stats fetched successfully from cache"));
  }

  const userStatsAggregation = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $match: { role: ROLES.USER } }, { $count: 'count' }],
        totalStaffs: [
          {
            $match: { role: ROLES.STAFF },
          },
          {
            $count: 'count',
          },
        ],
        totalAdmins: [
          {
            $match: { role: ROLES.ADMIN },
          },
          {
            $count: 'count',
          },
        ],
      },
    },
  ]);
  if(!userStatsAggregation){
    throw new apiError(500, "Could not fetch landing page data for user stats")
  };

  const stats = userStatsAggregation[0];

  const totalUsers = stats.totalUsers[0]?.count || 0;
  const totalAdmins = stats.totalAdmins[0]?.count || 0;
  const totalStaffs = stats.totalStaffs[0]?.count || 0;

  const response = {
    total: totalUsers + totalStaffs + totalAdmins,
    users: totalUsers,
    staffs:totalStaffs,
    admins:totalAdmins,
  }
  
  cache.set("landing-user-stats", response, 30); //setting in cache


  return res.status(200)
  .json(new apiResponse(200, response, " Landing page user stats fetched successfully"))
});

export const getLandingPageComplaintStats = asyncHandler(async(req, res)=>{

  const cached = cache.get("landing-complaint-stats");
  if(cached){
    return res.status(200)
    .json(new apiResponse(200, cached, "Landing page complaint stats fetched successfully from cached"));
  }

    const complaintStatsAggregation = await Complaint.aggregate([
        {
            $facet:{
                complaintsResolved: [{$match: {status:COMPLAINT_STATUS.RESOLVED}}, {$count: "count"}],
                complaintsRejected: [{$match: {status: COMPLAINT_STATUS.REJECTED}}, {$count:"count"}],
                complaintsInProgress: [{$match: {status: COMPLAINT_STATUS.IN_PROGRESS}}, {$count: "count"}],
                complaintsPending: [{$match: {status: COMPLAINT_STATUS.PENDING}}, {$count: "count"}]
            }
        }
    ])

    if(!complaintStatsAggregation[0]){
        throw new apiError(501, "Error fetching global landing page Complaint status data")
    }
    const stats = complaintStatsAggregation[0];

    const pending = stats.complaintsPending[0]?.count || 0;
    const rejected = stats.complaintsRejected[0]?.count || 0;
    const inProgress = stats.complaintsInProgress[0]?.count || 0;
    const resolved = stats.complaintsResolved[0]?.count || 0;

    const response  = {
        total: pending + rejected + inProgress + resolved,
        pending: pending,
        rejected:rejected,
        inProgress: inProgress,
        resolved: resolved
    }

    cache.set("landing-complaint-stats", response, 30);

    return res.status(200)
    .json(
        new apiResponse(200, response, "Landing page complaint detail stats fetched successfully")
    )
})