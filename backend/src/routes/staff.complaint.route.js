import express, { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/role.middleware.js';
import { getAssignedComplaints, submitResolutionRequest, updateComplaintStatus } from '../controllers/staff.complaint.controller.js';
import { ROLES,ROLES_ENUM } from '../enum/roles.js';
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route('/').get(
    verifyJWT,
    verifyRole(ROLES.STAFF),
    getAssignedComplaints
);

router.route('/:id/status').put(
    verifyJWT,
    verifyRole(ROLES.STAFF,ROLES.ADMIN),
    updateComplaintStatus
);

router.post(
    "/:id/submit-resolution",
    verifyJWT,
    verifyRole(ROLES.STAFF),
    upload.array("photos", 5),
    submitResolutionRequest
)

export default router;