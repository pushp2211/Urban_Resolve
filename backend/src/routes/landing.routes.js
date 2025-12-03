import { Router } from "express";

import { getLandingPageComplaintStats, getLandingPageUserStats } from "../controllers/landingPageInfo.controller.js";
import rateLimiter from "../utils/rateLimitter.js";

const router = Router();

router.get('/user-stats', rateLimiter, getLandingPageUserStats);

router.get('/complaint-stats', rateLimiter, getLandingPageComplaintStats);

export default router;