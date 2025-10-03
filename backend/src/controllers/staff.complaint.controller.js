import {Complaint} from "../models/complaint.model.js";
import { COMPLAINT_STATUS ,COMPLAINT_STATUS_ENUM} from "../enum/ComplaintStatus.js";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAssignedComplaints = asyncHandler(async (req, res) => {
    const staffId = req.user._id;
    const { status, urgency } = req.query;

    // Base query to find complaints assigned to the logged-in staff
    const query = { assignedTo: staffId };

    // Dynamically add status to the query if provided and valid
    if (status) {
        if (!COMPLAINT_STATUS_ENUM.includes(status)) {
            throw new apiError(
                400,
                `Invalid status value. Allowed values: ${COMPLAINT_STATUS_ENUM.join(", ")}`
            );
        }
        query.status = status;
    }

    // Dynamically add urgency to the query if provided and valid
    if (urgency) {
        if (!COMPLAINT_URGENCY_ENUM.includes(urgency)) {
            throw new apiError(
                400,
                `Invalid urgency value. Allowed values: ${COMPLAINT_URGENCY_ENUM.join(", ")}`
            );
        }
        query.urgency = urgency;
    }

    // Fetch all complaints matching the query, sorted by newest first
    const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 });
    
   // if (!complaints.length) {
    //     throw new apiError(404, "No complaints are assigned to you");
    // }


    // As per best practices, return 200 OK with an empty array if no complaints are found
    return res
        .status(200)
        .json(new apiResponse(200, complaints, "Assigned complaints fetched successfully"));
});


export const updateComplaintStatus=asyncHandler(async(req,res)=>{
    const {status:newStatus}=req.body;
    const {id:complaintId}=req.params;
    const staffId=req.user._id;

    if(!newStatus||!COMPLAINT_STATUS_ENUM.includes(newStatus)){
        throw new apiError(400,`Invalid or missing status. Must be one of: ${COMPLAINT_STATUS_ENUM.join(', ')}` );
    }
        const complaint = await Complaint.findById(complaintId);

        if(!complaint){
            throw new apiError(404, "Complaint Not Found");
        }
        if(!complaint.assignedTo){
            throw new apiError(403, "This complaint has not been assigned to any staff member yet.");
        }
        if(complaint.assignedTo.toString() !== staffId.toString()){
            throw new apiError(403, "You are not authorised to change status of this Complaint");
        }

        // 4. State Transition Logic using the status object
        const currentStatus = complaint.status;
        let isTransitionAllowed = false;

        switch (currentStatus) {
            case COMPLAINT_STATUS.PENDING:
                if (
                    newStatus === COMPLAINT_STATUS.IN_PROGRESS ||
                    newStatus === COMPLAINT_STATUS.REJECTED ||
                    newStatus === COMPLAINT_STATUS.RESOLVED
                ) isTransitionAllowed = true;
                break;

            case COMPLAINT_STATUS.IN_PROGRESS:
                if (newStatus === COMPLAINT_STATUS.RESOLVED) isTransitionAllowed = true;
                break;
                
            // By default, no status changes are allowed from RESOLVED or REJECTED by staff
        }

        if (!isTransitionAllowed) {
            throw new apiError(400,`Invalid status transition from '${currentStatus}' to '${newStatus}'.`);
        }
        
        complaint.status = newStatus;
        await complaint.save();

        res.status(200).json(new apiResponse(200,complaint,"Status Updated Succesfully"));
    
});