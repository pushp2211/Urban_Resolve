import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../enum/roles.js";
import { assignComplaint, updateStatus, updateUserRole } from "../controllers/admin.complaint.controller.js";

const router = Router();

router.route("/updateRole/:id").patch(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    updateUserRole
)

router.route("/assignComplaint/:id").put(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    assignComplaint
)

router.route("/updateStatus/:id").put(
    verifyJWT,
    verifyRole(ROLES.ADMIN, ROLES.STAFF),
    updateStatus
)
export default router;