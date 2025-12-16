import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Complaint } from "../models/complaint.model.js";
import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";
import { verifyRole } from "../middlewares/role.middleware.js";
import { COMPLAINT_STATUS,COMPLAINT_STATUS_ENUM } from "../enum/ComplaintStatus.js";
import { COMPLAINT_URGENCY, COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";
import { ROLES, ROLES_ENUM } from "../enum/roles.js";
import { type } from "os";

//update compaint status

export const updateStatus = asyncHandler(async(req, res)=>{
    const {id: complaintId} = req.params //we are expecting id from the url here
    const {status} = req.body;
    const {user} = req;

    //validation
    const isValid = mongoose.isValidObjectId(complaintId);
    if(!isValid){
        throw new apiError(400, "Invalid complaint id");
    }

    const allowedStatuses = COMPLAINT_STATUS_ENUM;
    if(!status || !allowedStatuses.includes(status)){
        throw new apiError(400, `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`)
    }

    //database operations--> modification

    let updatedComplaint;
    if(user.role === ROLES.ADMIN){
        //can update any complaint directly
        updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, 
            {$set: {status: status}},
            {new:true}
        )
    }
    else if(user.role === ROLES.STAFF){
        const complaint = await Complaint.findById(complaintId);
        if(!complaint){
            throw new apiError(404, "Complaint not found");
        }

        if(!complaint.assignedTo || complaint.assignedTo.toString()!== user._id.toString()){
            throw new apiError(403, "Forbidden: you are not authorised to update this complaint status");
        }

        complaint.status = status;
        updatedComplaint = await complaint.save();
    }
    else{
        throw new apiError(403, "Forbidden: you don't have permission to perform this action");
    }

    if(!updatedComplaint){
        throw new apiError(404, "complaint not found or update failed");
    }

    return res
    .status(200)
    .json(new apiResponse(200, updatedComplaint, "Complaint status updated successfully"));

});

//admin complaint review endpoint
export const reviewResolutionRequest = asyncHandler(async(req, res)=>{
    const {id: complaintId} = req.params;
    const {approved, rejectionReason} = req.body;
    const adminId = req.user._id;

    if(typeof approved !== "boolean"){
        throw new apiError(400, "Approved fiels must be true or false");
    }

    if(!approved && !rejectionReason){
        throw new apiError(400, "Rejection reason is required when rejecting a resolution request");
    }

    const complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new apiError(404, "Complaint not found");
    }

    if(complaint.status !== COMPLAINT_STATUS.PENDING_REVIEW){
        throw new apiError(400, "This complaint status is not pending review")
    }
    if(!complaint.resolutionRequest || !complaint.resolutionRequest.photos ||
        complaint.resolutionRequest.photos.length < 2
    ){
        throw new apiError(400, "Invalid resolution request - missing  photos");
    }

    complaint.resolutionReview = {
        reviewedBy: adminId,
        reviewedAt: new Date(),
        approved: approved,
        rejectionReason: approved ? null : rejectionReason
    }

    let notificationMssg = "";
    if(approved) {
        complaint.status = COMPLAINT_STATUS.RESOLVED;
        complaint.resolvedAt = new Date();
        notificationMssg = "Your complaint resolution request has been approved"
    }   
    else {
        complaint.status = COMPLAINT_STATUS.IN_PROGRESS,
        complaint.resolutionRequest = null;
        notificationMssg = "Your complaint resolution request has been rejected"
    }

    await complaint.save();


    return res.status(200).
    json(
        new apiResponse(200, complaint,
            approved ? "complaint marked as resolved" : "Resolution request rejected"
        )
    );
});
//assign complaint
export const assignComplaint = asyncHandler(async(req, res)=>{
    const {id: complaintId} = req.params;
    const {staffId} = req.body;

    //validating
    if(!mongoose.isValidObjectId(complaintId)){
        throw new apiError(400, "Invalid complaint id");
    }
    if(!mongoose.isValidObjectId(staffId)){
        throw new apiError(400, "Invalid Staff id");
    }
    //verify is the user being assigned is actually a staff member
    const staffMember  = await User.findById(staffId);
    
    if(!staffMember){
        throw new apiError(400, "Staff member not found");
    }
    if(staffMember.role !== ROLES.STAFF){
        throw new apiError(400, "This user cannot be assigned complaints as they are not staff");
    }

    //database operation
    const complaint = await Complaint.findById(complaintId);


    if(!complaint){
        throw new apiError(404, "Complaint not found");
    }


    const staffDistrict = staffMember.address?.district;
    const complaintDistrict = complaint.address?.district;
    if(staffDistrict !== complaintDistrict){
        throw new apiError(400, `can not assign this complaint to ${staffMember.fullName} as he is not from the same district as complaint`)
    }

    complaint.assignedTo = staffId;
    complaint.assignedAt = new Date();
    //update complaint status also
    if(complaint.status == COMPLAINT_STATUS.PENDING){
        complaint.status = COMPLAINT_STATUS.IN_PROGRESS;
    }
    const updatedComplaint = await complaint.save();
    // console.log(updatedComplaint);
    return res
    .status(200)
    .json(new apiResponse(200, updatedComplaint, "Complaint assigned successfully"));
});

export const updateUserRole = asyncHandler(async(req, res)=>{
    const {id: userId} = req.params;
    const {role: newRole} = req.body;
    const admin = req.user;

    if(!mongoose.isValidObjectId(userId)){
        throw new apiError(400, "Invalid user Id");
    }

    if(!mongoose.isValidObjectId(admin._id)){
        throw new apiError(400, "invalid admin id");
    }

    if(!newRole || !ROLES_ENUM.includes(newRole)){
        throw new apiError(400, `Invalid role, must be one of ${ROLES_ENUM.join(", ")}`);
    }

    //if admin is the same user id that is being updated
    if(admin._id.toString() === userId){
        throw new apiError(400, "Admin can not change their own role")
    }

    //database operation
    const user = await User.findById(userId);

    if(!user){
        throw new apiError(404, "User not found");
    }

    user.role = newRole;

    await user.save({validateBeforeSave: false});

    const updatedUser = await User.findById(userId).select(
        "-password -refreshToken" 
    )


    return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "User role updated successfully"));
})

export const getUserList = asyncHandler(async(req, res)=>{
    const { role, state, pinCode, district, email, page = 1, limit = 10 } = req.query;

    // Build dynamic filter
    const userFilter = {};

    // Apply role filter (optional)
    if (role) {
        userFilter.role = role;
    }

    // Apply email filter with case-insensitive regex
    if (email) {
        userFilter.email = { $regex: new RegExp(email, 'i') };
    }

    // Apply address filters with case-insensitive regex
    if (state) {
        userFilter['address.state'] = { $regex: new RegExp(`^${state}$`, 'i') };
    }
    if (district) {
        userFilter['address.district'] = { $regex: new RegExp(`^${district}$`, 'i') };
    }
    if (pinCode) {
        userFilter['address.pinCode'] = pinCode;
    }

    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Use aggregation pipeline for optimized filtering and pagination
    const [usersResult, totalCountResult] = await Promise.all([
        User.aggregate([
            { $match: userFilter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    emailVerificationToken: 0,
                    emailVerificationExpiry: 0
                }
            }
        ]),
        User.countDocuments(userFilter)
    ]);

    const users = usersResult;
    const totalCount = totalCountResult;
    const totalPages = Math.ceil(totalCount / limitNum);

    return res
        .status(200)
        .json(new apiResponse(
            200, 
            {
                users,
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                limit: parseInt(limit),
            },
            "Users fetched successfully"
        ));
    
});

export const getUser = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;

  if (!adminId) {
    throw new apiError(401, "Unauthorized access");
  }

  const userEmail = req.query.email;
  if (!userEmail) {
    throw new apiError(400, "Email query parameter is required");
  }

  // Find user by email
  const user = await User.findOne({ email: userEmail }).select("-password -refreshToken");

  if (!user) {
    throw new apiError(404, "No user found with this email");
  }

  // If user is staff, get complaint statistics
  let complaintStats = null;
  if (user.role === ROLES.STAFF) {
    const statsAggregation = await Complaint.aggregate([
      {
        $match: { assignedTo: user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform stats into a readable format
    complaintStats = {
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
      switch (stat._id) {
        case COMPLAINT_STATUS.PENDING:
          complaintStats.pending = stat.count;
          break;
        case COMPLAINT_STATUS.IN_PROGRESS:
          complaintStats.inProgress = stat.count;
          break;
        case COMPLAINT_STATUS.RESOLVED:
          complaintStats.resolved = stat.count;
          break;
        case COMPLAINT_STATUS.REJECTED:
          complaintStats.rejected = stat.count;
          break;
        case COMPLAINT_STATUS.PENDING_REVIEW:
          complaintStats.pendingReview = stat.count;
          break;
      }
    });

    // Calculate average resolution time
    const resolvedComplaints = await Complaint.find({
      assignedTo: user._id,
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
  }

  const responseData = {
    ...user.toObject(),
    ...(complaintStats && { complaintStats })
  };

  return res
    .status(200)
    .json(new apiResponse(200, responseData, "User fetched successfully"));
});

// Get all complaints with pending review status (for admin)
export const getPendingReviewComplaints = asyncHandler(async (req, res) => {
    const adminId = req.user._id;

    // Verify admin role
    if (req.user.role !== ROLES.ADMIN) {
        throw new apiError(403, "Forbidden: Only admins can access pending review complaints");
    }

    const { state, city, pinCode, urgency, sortBy = 'createdAt', page = 1, limit = 10 } = req.query;

    // Base filter - only PENDING_REVIEW status
    const filter = { status: COMPLAINT_STATUS.PENDING_REVIEW };

    // Address filters
    if (state) {
        filter['address.state'] = state.toLowerCase();
    }
    if (city) {
        filter['address.city'] = city.toLowerCase();
    }
    if (pinCode) {
        filter['address.pinCode'] = pinCode;
    }

    // Urgency filter
    if (urgency) {
        if (!COMPLAINT_URGENCY_ENUM.includes(urgency)) {
            throw new apiError(
                400,
                `Invalid urgency value. Allowed values: ${COMPLAINT_URGENCY_ENUM.join(", ")}`
            );
        }
        filter.urgency = urgency;
    }

    // Sort options (by urgency or date)
    let sortOptions = {};
    if (sortBy === 'urgency') {
        // Sort by urgency: High -> Medium -> Low
        const urgencyOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        sortOptions = { urgency: 1, createdAt: -1 };
    } else {
        sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Fetch complaints with pagination
    const complaints = await Complaint.find(filter)
        .sort(sortOptions)
        .populate('submittedBy', 'fullName email avatar')
        .populate('assignedTo', 'fullName email')
        .populate('resolutionRequest.submittedBy', 'fullName email')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    const totalComplaints = await Complaint.countDocuments(filter);

    const responsePayload = {
        complaints,
        totalPages: Math.ceil(totalComplaints / limitNum),
        currentPage: pageNum,
        totalCount: totalComplaints
    };

    return res
        .status(200)
        .json(new apiResponse(200, responsePayload, "Pending review complaints fetched successfully"));
});