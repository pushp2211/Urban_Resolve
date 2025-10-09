import { Complaint } from "../models/complaint.model.js";
import { generateComplaintReportPDF } from "../services/pdf.service.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";
import { COMPLAINT_TYPE } from "../enum/ComplaintType.js";

export const generateLocalityReport = asyncHandler(async (req, res) => {
    const { locality } = req.query;

    if (!locality) {
        throw new apiError(400, "Locality is a required query parameter.");
    }

    // Fetch and populate complaints matching the locality, sorted by creation date.
    const complaints = await Complaint.find({ "address.locality": locality })
        .populate("submittedBy", "fullName email")
        .sort({ createdAt: -1 });

    if (complaints.length === 0) {
        throw new apiError(404, `No complaints found for locality: ${locality}`);
    }

    // Aggregate data for pie charts by counting statuses and types.
    const statusCounts = {
        [COMPLAINT_STATUS.PENDING]: 0,
        [COMPLAINT_STATUS.IN_PROGRESS]: 0,
        [COMPLAINT_STATUS.RESOLVED]: 0,
        [COMPLAINT_STATUS.REJECTED]: 0
    };

    const typeCounts = {
        [COMPLAINT_TYPE.WATER]: 0,
        [COMPLAINT_TYPE.ROAD]: 0,
        [COMPLAINT_TYPE.ELECTRICITY]: 0,
        [COMPLAINT_TYPE.GARBAGE]: 0,
        [COMPLAINT_TYPE.OTHER]: 0
    };

    for (const complaint of complaints) {
        statusCounts[complaint.status]++;
        typeCounts[complaint.type]++;
    }

    // Set headers to prompt a PDF download.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${locality}_${new Date().toISOString().slice(0,10)}.pdf`);

    // Call the service to generate and stream the PDF.
    generateComplaintReportPDF(complaints, statusCounts, typeCounts, locality, res);
});