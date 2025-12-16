// models/Complaint.js
export const COMPLAINT_STATUS={
    PENDING:"Pending",
    IN_PROGRESS:"In Progress",
    RESOLVED:"Resolved",
    REJECTED:"Rejected",
    PENDING_REVIEW: "Pending Review",
}
export const COMPLAINT_STATUS_ENUM=Object.values(COMPLAINT_STATUS);