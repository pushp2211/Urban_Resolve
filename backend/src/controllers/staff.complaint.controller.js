import {Complaint} from "../models/complaint.model.js";
import { COMPLAINT_STATUS ,COMPLAINT_STATUS_ENUM} from "../enum/ComplaintStatus.js";
export const getAssignedComplaints=async(req,res)=>{
    try{
        const staffId=req.user.id;
        const complaints=await Complaint.find({assignedTo:staffId})
            .sort({createdAt:-1});
        if(!complaints.length){
            return res.status(404).json({message:"NO Complaints are assigned to you"});
        }
        res.status(200).json(complaints);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
export const updateComplaintStatus=async(req,res)=>{
    const newStatus=req.body.status;
    const complaintId=req.params.id;
    const staffId=req.user.id;

    if(!newStatus||!COMPLAINT_STATUS_ENUM.includes(newStatus)){
        return res.status(400).json({ 
            message: `Invalid or missing status. Must be one of: ${COMPLAINT_STATUS_ENUM.join(', ')}` 
        });
    }
    try{
        const complaint=Complaint.find({_id:complaintId});
        if(!complaint){
            return res.status(404).json({
                message:"Complaint Not Found"
            });
        }
        if(complaint.assignedTo.toString() !== staffId){
            return res.status(403).json({
                message:"You are not authorised to change status of this Complaint"
            });
        }

        // 4. State Transition Logic using the status object
        const currentStatus = complaint.status;
        let isTransitionAllowed = false;

        switch (currentStatus) {
            case COMPLAINT_STATUS.PENDING:
                if (
                    newStatus === COMPLAINT_STATUS.IN_PROGRESS ||
                    newStatus === COMPLAINT_STATUS.REJECTED
                ) isTransitionAllowed = true;
                break;

            case COMPLAINT_STATUS.IN_PROGRESS:
                if (newStatus === COMPLAINT_STATUS.RESOLVED) isTransitionAllowed = true;
                break;
                
            // By default, no status changes are allowed from RESOLVED or REJECTED by staff
        }

        if (!isTransitionAllowed) {
            return res.status(400).json({ message: `Invalid status transition from '${currentStatus}' to '${newStatus}'.` });
        }
        
        complaint.status = newStatus;
        await complaint.save();

        res.status(200).json(complaint);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};