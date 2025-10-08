import {verifyJWT} from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { getCommonComplaintDashboard } from '../services/user.service.js';
import { ToggleUpvote,getUpvote } from '../controllers/complaint.controller.js';

import { getUserStats, getComplaintStats } from '../services/admin.service.js';

const router=Router();

router.route('/').get(
    verifyJWT,
    getCommonComplaintDashboard
)
router.put("/complaints/:complaintId/toggleUpvote", verifyJWT, ToggleUpvote);
router.get("/complaints/:complaintId/upvote", verifyJWT, getUpvote);

router.get("/user/stats", verifyJWT, getUserStats);
router.get("/complaint/stats", verifyJWT, getComplaintStats);


export default router;
