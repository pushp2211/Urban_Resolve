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
import { ROLES, ROLES_ENUM } from "../enum/roles.js";

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

export const getStaffList = asyncHandler(async(req, res)=>{
    const {id:complaintId} = req.params;

    if(!mongoose.isValidObjectId(complaintId)){
        throw new apiError(400, "Invalid complaint Id");
    }

    const complaint = await Complaint.findById(complaintId);

    if(!complaint){
        throw new apiError(404, "Complaint not found");
    }


    if(!complaint.address?.district){
        throw new apiError(400, "Invalid complaint district");
    }

    const district = complaint.address.district.toString();

    const eligibleStaff = await User.find(
        {
            role:ROLES.STAFF,
            'address.district':district
        }
    ).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .json(new apiResponse(200, eligibleStaff, "Eligible staff list fetched successfully"));
    
})