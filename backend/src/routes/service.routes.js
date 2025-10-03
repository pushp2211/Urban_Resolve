import {verifyJWT} from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { getCommonComplaintDashboard } from '../services/user.service.js';


const router=Router();

router.route('/').get(
    verifyJWT,
    getCommonComplaintDashboard
)

export default router;
