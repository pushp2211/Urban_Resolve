import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Complaint } from "../models/complaint.model.js";


export const ToggleUpvote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const complaintId = req.params.complaintId;

    if (!userId) {
        throw new apiError(401, "Unauthorized Access");
    }

    if (!complaintId) {
        throw new apiError(400, "Complaint ID is required");
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new apiError(404, "Complaint not found");
    }

    const alreadyUpvoted = complaint.upvotes.users.some(
        (u) => u.toString() === userId.toString()
    );

    if (!alreadyUpvoted) {
        complaint.upvotes.users.push(userId);
    } else {
        complaint.upvotes.users.pull(userId);
    }

    await complaint.save();


    return res.status(200).json(
        new apiResponse(200, {
            total: complaint.upvotes.users.length,
            isUpvoted: !alreadyUpvoted
        }, "Upvote toggled successfully")
    );
});

export const getUpvote=asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const complaintId = req.params.complaintId;

    if (!userId) {
        throw new apiError(401, "Unauthorized Access");
    }

    if (!complaintId) {
        throw new apiError(400, "Complaint ID is required");
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new apiError(404, "Complaint not found");
    }

    const alreadyUpvoted = complaint.upvotes.users.some(
        (u) => u.toString() === userId.toString()
    );
    return res.status(200).json(
        new apiResponse(200, {
            totalUpvotes: complaint.upvotes.users.length,
            isUpvoted:alreadyUpvoted
        }, "Total Upvote Fetched successfully")
    );
})
