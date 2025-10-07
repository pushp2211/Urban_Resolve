import { Complaint } from "../models/complaint.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { COMPLAINT_STATUS } from "../enum/ComplaintStatus.js";
import { User } from "../models/user.model.js";


export const getCommonComplaintDashboard = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id);

    if(!user || !user.address?.district){
        throw new apiError(404, "User profile or address not found, Please complete your profile");
    }

    const {district, pinCode, locality, city, dateRange, status, page = 1, limit = 10, submittedBy} = req.query;

    const filter = {
        
    }
    if(district){
        filter['address.district'] = district;
    }

    if(pinCode){
        filter['address.pinCode'] = pinCode
    }

    if(locality){
        filter['address.locality'] = locality
    }
    if(city){
        filter['address.city'] = city
    }
    
    if(status){
        filter.status = status
    }

    if(dateRange=='this_month'){
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1 );
        filter.createdAt = {
            $gte:startOfMonth
        }
    }
    if(submittedBy){
        filter.submittedBy = user._id;
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: {createdAt:-1},
        populate:[
            {path: 'submittedBy', select: 'fullName email profilePicture'},
            {path:'assignedTo', select: 'fullName email profilePicture'}
        ]
    }

    const complaints = await Complaint.find(filter)
    .populate(options.populate)
    .sort(options.sort)
    .skip((options.page-1)*options.limit)
    .limit(options.limit)
    
    // console.log(complaints);
    const totalComplaints = await Complaint.countDocuments(filter);

    const responsePayload = {
        complaints,
        totalPages: Math.ceil(totalComplaints/options.limit),
        currentPage:options.page,
        totalCount:totalComplaints
    }

    return res
    .status(200)
    .json(new apiResponse(200, responsePayload, "User specific dashboard fetched successfully."));
})