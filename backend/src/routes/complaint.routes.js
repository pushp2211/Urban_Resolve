import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUserComplaint, deleteUserComplaint, getUserComplaintsDashboard } from "../controllers/user.complaint.controller.js";

const router = Router();
router.route("/uploadComplaint").post(
    verifyJWT,
    upload.fields(
        [
            {
                name:"photo",
                maxCount:1
            },
        ]
    ),
    createUserComplaint
)

router.route("/userComplaintDashboard").get(
    verifyJWT,
    getUserComplaintsDashboard
)

router.route("/deleteUserComplaint/:complaintId").delete(
    verifyJWT,
    deleteUserComplaint
)

export default router;