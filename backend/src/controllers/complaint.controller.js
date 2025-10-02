import { Complaint } from "../models/complaint.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";

/**
 * @description Controller for a logged-in user to create a new complaint.
 * @route POST /api/v1/user/complaints/create
 * @access Private (Requires user to be logged in)
 */
const createUserComplaint = asyncHandler(async (req, res) => {
  const { title, description, type, latitude, longitude, urgency } = req.body;
  const submittedBy = req.user._id;

  const requiredFields = { title, description, type, latitude, longitude };
  if (Object.values(requiredFields).some((field) => !field || field.trim() === "")) {
    throw new apiError(400, "Title, description, type, and location are required fields.");
  }

  const photoLocalPath = req.files?.photo?.[0]?.path;
  if (!photoLocalPath) {
    throw new apiError(400, "A photo of the complaint is required.");
  }

  const photo = await uploadOnCloudinary(photoLocalPath);
  if (!photo || !photo.url) {
    throw new apiError(500, "Error: Failed to upload photo. Please try again.");
  }

  const complaint = await Complaint.create({
    title,
    description,
    type,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
    photoUrl: photo.url,
    submittedBy,
    urgency,
  });

  return res
    .status(201)
    .json(new apiResponse(201, complaint, "Complaint registered successfully."));
});


/**
 * @description Controller for a user to view all of their own complaints and their status.
 * @route GET /api/v1/user/complaints/dashboard
 * @access Private (Requires user to be logged in)
 */
const getUserComplaintsDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userComplaints = await Complaint.find({ submittedBy: userId }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        userComplaints,
        "User's complaints retrieved successfully."
      )
    );
});


/**
 * @description Controller for a user to delete one of their own complaints.
 * @route DELETE /api/v1/user/complaints/:complaintId
 * @access Private (Requires user to be logged in)
 */
const deleteUserComplaint = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;

    if (!mongoose.isValidObjectId(complaintId)) {
        throw new apiError(400, "Invalid complaint ID format.");
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
        throw new apiError(404, "Complaint not found.");
    }

    if (complaint.submittedBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Forbidden: You are not authorized to delete this complaint.");
    }
    
    if (complaint.status !== COMPLAINT_STATUS.PENDING) {
        throw new apiError(400, `Cannot delete complaint as its status is "${complaint.status}".`);
    }

    await Complaint.findByIdAndDelete(complaintId);

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Complaint deleted successfully."));
});


export {
  createUserComplaint,
  getUserComplaintsDashboard,
  deleteUserComplaint,
};
