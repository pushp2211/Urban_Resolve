import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../enum/roles.js";
import { assignComplaint, getStaffList, updateStatus, updateUserRole ,getUser} from "../controllers/admin.complaint.controller.js";

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

router.route("/staffList/:id").get(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getStaffList
)

router.route("/search").get(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getUser
);
export default router;