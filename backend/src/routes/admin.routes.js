import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../enum/roles.js";
import { assignComplaint, getUserList, updateStatus, updateUserRole ,getUser, reviewResolutionRequest, getPendingReviewComplaints} from "../controllers/admin.complaint.controller.js";
import { getStaffByDistrict } from "../controllers/staff.controller.js";

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

router.route("/staffList").get(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getUserList
)

router.route("/userList").get(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getUserList
)

router.route("/user").get(
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getUser
);

router.patch(
    "/complaints/:id/review-resolution",
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    reviewResolutionRequest
);

router.get(
    "/complaints/pending-review",
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getPendingReviewComplaints
);

router.get(
    "/staff-by-district",
    verifyJWT,
    verifyRole(ROLES.ADMIN),
    getStaffByDistrict
);

export default router;