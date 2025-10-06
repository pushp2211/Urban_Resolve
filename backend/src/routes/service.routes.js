import {verifyJWT} from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { getCommonComplaintDashboard } from '../services/user.service.js';
import { ToggleUpvote,getUpvote } from '../controllers/complaint.controller.js';

const router=Router();

router.route('/').get(
    verifyJWT,
    getCommonComplaintDashboard
)
router.put("/complaints/:complaintId/toggleUpvote", verifyJWT, ToggleUpvote);
router.get("/complaints/:complaintId/upvote", verifyJWT, getUpvote);

export default router;
