
import mongoose from "mongoose";
import { COMPLAINT_STATUS,COMPLAINT_STATUS_ENUM } from "../enum/ComplaintStatus";
import { COMPLAINT_TYPE,COMPLAINT_TYPE_ENUM } from "../enum/ComplaintType";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency";

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
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
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
