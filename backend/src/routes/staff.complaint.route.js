import express, { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { verifyRole } from '../middlewares/role.middleware.js';
import { getAssignedComplaints, updateComplaintStatus } from '../controllers/staff.complaint.controller.js';

const router=Router();

router.route('/').get(
    verifyJWT,
    verifyRole('Staff'),
    getAssignedComplaints
);

router.route('/:id/status').put(
    verifyJWT,
    verifyRole('Staff', 'Admin'),
    updateComplaintStatus
);

export default router;