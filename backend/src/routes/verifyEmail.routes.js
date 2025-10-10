import { Router } from "express";

import { verifyEmail } from "../controllers/verify.controller.js";

const router = Router();

router.get("/verify-email", verifyEmail)

export default router