import { Router } from "express";
import { generateLocalityReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Defines the GET route to generate a report, protected by authentication.
// Usage Example: GET /api/v1/reports/locality?locality=Downtown
router.route("/locality").get(verifyJWT, generateLocalityReport);

export default router;