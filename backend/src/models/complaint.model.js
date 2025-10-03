
import mongoose from "mongoose";
import { COMPLAINT_STATUS,COMPLAINT_STATUS_ENUM } from "../enum/ComplaintStatus.js";
import { COMPLAINT_TYPE,COMPLAINT_TYPE_ENUM } from "../enum/ComplaintType.js";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: COMPLAINT_TYPE_ENUM,
        required: true
    },
    location: { //we will use this later, for now we are using the address only
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    address: {
      locality: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      pinCode: { type: String, required: true, trim: true, match: [/^\d{6}$/, 'Please fill a valid 6-digit pin code']},
      state: { type: String, required: true, trim: true },
    },
    photoUrl: {
        type: String // URL of the complaint photo
    },
    status: {
        type: String,
        enum: COMPLAINT_STATUS_ENUM,
        default: COMPLAINT_STATUS.PENDING
    },
    urgency: {
        type: String,
        enum: COMPLAINT_URGENCY_ENUM,
        default: COMPLAINT_URGENCY.MEDIUM
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deadline: {
        type: Date
    }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

export const Complaint = mongoose.model("Complaint", complaintSchema);