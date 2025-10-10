import { Router } from "express";
import { generateLocalityReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/report").get(verifyJWT, generateLocalityReport);

export default router;