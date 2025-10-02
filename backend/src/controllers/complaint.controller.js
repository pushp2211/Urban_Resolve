import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Complaint } from "../models/complaint.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { verifyRole } from "../middlewares/role.middleware.js";
import { COMPLAINT_STATUS,COMPLAINT_STATUS_ENUM } from "../enum/ComplaintStatus";


//update compaint status
export const updateStatus = asyncHandler(async(req, res)=>{
    const {id: complaintId} = req.params //we are expecting id from the url here
    const {status} = req.body;

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

    const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId,
        {
            $set:{status: status}
        },
        {
            new:true //this option returns the document after update
        }
    );
    if(!updatedComplaint){
        throw new apiError(404, "complaint not found");
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
    if(staffMember.role !== 'STAFF'){
        throw new apiError(400, "This user cannot be assigned complaints as they are not staff");
    }

    //database operation
    const complaint = await Complaint.findById(complaintId);

    if(!complaint){
        throw new apiError(404, "Complaint not found");
    }

    complaint.assignedTo = staffId;
    if(complaint.status == COMPLAINT_STATUS.PENDING){
        complaint.status = COMPLAINT_STATUS.IN_PROGRESS;
    }
    const updatedComplaint = await complaint.save();

    return res
    .status(200)
    .json(new apiResponse(200, updatedComplaint, "Complaint assigned successfully"));
});