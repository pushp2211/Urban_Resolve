import {Complaint} from "../models/complaint.model.js";
import { COMPLAINT_STATUS ,COMPLAINT_STATUS_ENUM} from "../enum/ComplaintStatus.js";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAssignedComplaints = asyncHandler(async (req, res) => {
    const staffId = req.user._id;
    // 1. Destructure page and limit from query with default values
    const { status, urgency, page = 1, limit = 10 } = req.query;

    // Base query to find complaints assigned to the logged-in staff
    const filter = { assignedTo: staffId };
    // Dynamically add status to the query if provided

    if (status) {
        if (!COMPLAINT_STATUS_ENUM.includes(status)) {
            throw new apiError(
                400,
                `Invalid status value. Allowed values: ${COMPLAINT_STATUS_ENUM.join(", ")}`
            );
        }
        filter.status = status;
    }

    // Dynamically add urgency to the query if provided
    if (urgency) {
        if (!COMPLAINT_URGENCY_ENUM.includes(urgency)) {
            throw new apiError(
                400,
                `Invalid urgency value. Allowed values: ${COMPLAINT_URGENCY_ENUM.join(", ")}`
            );
        }
        filter.urgency = urgency;
    }

    // 2. Define options for the query
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        // Populating the user who submitted the complaint
        populate: [{ path: 'submittedBy', select: 'fullName email' }]
    };

    
     // 3. Fetch the paginated list of complaints
    const complaints = await Complaint.find(filter)
        .sort(options.sort)
        .populate(options.populate)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

    // 4. Get the total count of documents matching the filter
    const totalComplaints = await Complaint.countDocuments(filter);

    
   // if (!complaints.length) {
    //     throw new apiError(404, "No complaints are assigned to you");
    // }

    const responsePayload = {
            complaints,
            totalPages: Math.ceil(totalComplaints / options.limit),
            currentPage: options.page,
            totalCount: totalComplaints
        };

        // 6. Return the structured response
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