
import mongoose from "mongoose";
import { COMPLAINT_STATUS,COMPLAINT_STATUS_ENUM } from "../enum/ComplaintStatus.js";
import { COMPLAINT_TYPE,COMPLAINT_TYPE_ENUM } from "../enum/ComplaintType.js";
import { COMPLAINT_URGENCY,COMPLAINT_URGENCY_ENUM } from "../enum/ComplaintUrgency.js";

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Title is Required"],
        trim: true
    },
    description: {
        type: String,
        required: [true,"Description is Required"]
    },
    type: {
        type: String,
        enum: COMPLAINT_TYPE_ENUM,
        required: [true,"Complaint Type is Reuired"]
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true,"Location is Required"]
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