import express, { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/role.middleware.js';
import { getAssignedComplaints, updateComplaintStatus } from '../controllers/staff.complaint.controller.js';
import { ROLES,ROLES_ENUM } from '../enum/roles.js';
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

export default router;