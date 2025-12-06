import { Complaint } from "../models/complaint.model.js";
import { generateComplaintReportPDF } from "../services/pdf.service.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";
import { COMPLAINT_TYPE } from "../enum/ComplaintType.js";

export const generateLocalityReport = asyncHandler(async (req, res) => {
    const { pinCode, state } = req.query;
    // console.log(req.query);
    if(!pinCode && !state){
        throw new apiError(400, "atleast one of the state or pin code is required to fetch the complaint report")
    }
    const filter = {};
    const finalState = String(state).toLowerCase();
    if(pinCode){
        filter["address.pinCode"] = pinCode;
    }
    if(state){
        filter["address.state"] = finalState;
    }

    
    const complaints = await Complaint.find(filter)
        .populate("submittedBy", "fullName email")
        .sort({ createdAt: -1 });

    if (complaints.length === 0) {
        throw new apiError(404, `No complaints found at entered pincode and state`);
    }

   
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

  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${pinCode?pinCode:""}_${state? state: ""}_${new Date().toISOString().slice(0,10)}.pdf`);

    
    generateComplaintReportPDF(complaints, statusCounts, typeCounts, pinCode, state, res);
});