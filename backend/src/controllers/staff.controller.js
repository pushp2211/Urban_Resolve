import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Complaint } from "../models/complaint.model.js";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";
import { ROLES } from "../enum/roles.js";

// Get staff list by district with their stats and avg resolution time
export const getStaffByDistrict = asyncHandler(async (req, res) => {
  const { district, sortBy = 'name', page = 1, limit = 10, email } = req.query;

  if (!district) {
    throw new apiError(400, "District query parameter is required");
  }

  // Build filter for staff in the same district
  const staffFilter = {
    role: ROLES.STAFF,
    'address.district': { $regex: new RegExp(`^${district}$`, 'i') }
  };

  // Add email filter if provided
  if (email && email.trim()) {
    staffFilter.email = { $regex: new RegExp(email, 'i') };
  }

  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  // Get staff users
  const [staffMembers, totalCount] = await Promise.all([
    User.find(staffFilter)
      .select('-password -refreshToken -emailVerificationToken -emailVerificationExpiry')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(staffFilter)
  ]);

  // Fetch complaint stats and avg resolution time for each staff member
  const staffWithStats = await Promise.all(
    staffMembers.map(async (staff) => {
      // Get complaint stats
      const statsAggregation = await Complaint.aggregate([
        { $match: { assignedTo: staff._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const complaintStats = {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
        pendingReview: 0,
        avgResolutionTime: null
      };

      statsAggregation.forEach(stat => {
        complaintStats.total += stat.count;
        complaintStats[stat._id.toLowerCase().replace('_', '')] = stat.count;
      });

      // Calculate average resolution time
      const resolvedComplaints = await Complaint.find({
        assignedTo: staff._id,
        status: COMPLAINT_STATUS.RESOLVED,
        assignedAt: { $exists: true, $ne: null },
        resolvedAt: { $exists: true, $ne: null }
      }).select('assignedAt resolvedAt');

      if (resolvedComplaints.length > 0) {
        const totalTime = resolvedComplaints.reduce((sum, complaint) => {
          const timeDiff = new Date(complaint.resolvedAt) - new Date(complaint.assignedAt);
          return sum + timeDiff;
        }, 0);

        const avgMilliseconds = totalTime / resolvedComplaints.length;
        const avgDays = avgMilliseconds / (1000 * 60 * 60 * 24);
        complaintStats.avgResolutionTime = parseFloat(avgDays.toFixed(1));
      }

      return {
        ...staff,
        complaintStats
      };
    })
  );

  // Sort staff based on sortBy parameter
  if (sortBy === 'avgResolutionTime') {
    staffWithStats.sort((a, b) => {
      const aTime = a.complaintStats.avgResolutionTime ?? Infinity;
      const bTime = b.complaintStats.avgResolutionTime ?? Infinity;
      return aTime - bTime; // Ascending order (fastest first)
    });
  } else if (sortBy === 'workload') {
    staffWithStats.sort((a, b) => a.complaintStats.total - b.complaintStats.total);
  } else {
    // Default sort by name
    staffWithStats.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  const totalPages = Math.ceil(totalCount / limitNum);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        staff: staffWithStats,
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: limitNum
      },
      "Staff members fetched successfully"
    )
  );
});
