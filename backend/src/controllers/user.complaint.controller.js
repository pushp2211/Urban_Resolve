import { Complaint } from "../models/complaint.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";
import { getOptimizedUrl } from "../utils/cloudinary.js";

const createUserComplaint = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    locality,
    district,
    city,
    pinCode,
    state,
    urgency,
  } = req.body;
  const submittedBy = req.user._id;

  const requiredFields = {
    title,
    description,
    type,
    locality,
    district,
    city,
    pinCode,
    state,
    urgency
  };
  if (
    Object.values(requiredFields).some((field) => !field || field.trim() === '')
  ) {
    throw new apiError(
      400,
      'Title, description, type, and address details are required fields.'
    );
  }

  const photoLocalPath = req.files?.photo?.[0]?.path;
  if (!photoLocalPath) {
    throw new apiError(400, 'A photo of the complaint is required.');
  }

  const photo = await uploadOnCloudinary(photoLocalPath);
  if (!photo || !photo.url) {
    throw new apiError(500, 'Error: Failed to upload photo. Please try again.');
  }
  const optimisedPhotoUrl = getOptimizedUrl(photo.url)
  const complaint = await Complaint.create({
    title,
    description,
    type,
    address: {
      locality: locality,
      pinCode: pinCode,
      district: district,
      city: city,
      state: state,
    },
    photoUrl: optimisedPhotoUrl,
    submittedBy,
    urgency,
  });

  return res
    .status(201)
    .json(
      new apiResponse(201, complaint, 'Complaint registered successfully.')
    );
});


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


const deleteUserComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;

  if (!mongoose.isValidObjectId(complaintId)) {
    throw new apiError(400, 'Invalid complaint ID format.');
  }

  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new apiError(404, 'Complaint not found.');
  }

  if (complaint.submittedBy.toString() !== req.user._id.toString()) {
    throw new apiError(
      403,
      'Forbidden: You are not authorized to delete this complaint.'
    );
  }

  if (complaint.status !== COMPLAINT_STATUS.PENDING) {
    throw new apiError(
      400,
      `Cannot delete complaint as its status is "${complaint.status}".`
    );
  }

  await Complaint.findByIdAndDelete(complaintId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, 'Complaint deleted successfully.'));
});

export { createUserComplaint, getUserComplaintsDashboard, deleteUserComplaint };