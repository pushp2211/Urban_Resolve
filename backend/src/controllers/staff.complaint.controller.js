import {Complaint} from "../models/complaint.model.js";
import { COMPLAINT_STATUS ,COMPLAINT_STATUS_ENUM} from "../enum/ComplaintStatus.js";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAssignedComplaints = asyncHandler(async (req, res) => {
    const staffId = req.user._id;

    const { status, urgency, page = 1, limit = 10 } = req.query;


    const filter = { assignedTo: staffId };

    if (status) {
        if (!COMPLAINT_STATUS_ENUM.includes(status)) {
            throw new apiError(
                400,
                `Invalid status value. Allowed values: ${COMPLAINT_STATUS_ENUM.join(", ")}`
            );
        }
        filter.status = status;
    }


    if (urgency) {
        if (!COMPLAINT_URGENCY_ENUM.includes(urgency)) {
            throw new apiError(
                400,
                `Invalid urgency value. Allowed values: ${COMPLAINT_URGENCY_ENUM.join(", ")}`
            );
        }
        filter.urgency = urgency;
    }


    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },

        populate: [{ path: 'submittedBy', select: 'fullName email' }]
    };

    
    const complaints = await Complaint.find(filter)
        .sort(options.sort)
        .populate(options.populate)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

    const totalComplaints = await Complaint.countDocuments(filter);

    

    const responsePayload = {
            complaints,
            totalPages: Math.ceil(totalComplaints / options.limit),
            currentPage: options.page,
            totalCount: totalComplaints
        };

        return res
            .status(200)
            .json(new apiResponse(200, responsePayload, "Assigned complaints fetched successfully"));
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
                
        }

        if (!isTransitionAllowed) {
            throw new apiError(400,`Invalid status transition from '${currentStatus}' to '${newStatus}'.`);
        }
        
        complaint.status = newStatus;
        await complaint.save();

        res.status(200).json(new apiResponse(200,complaint,"Status Updated Succesfully"));
});