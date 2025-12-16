import { Router } from "express";
import { registerUser, loginUser, logoutUser, getAllUsers } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userProfile,editProfile } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name:"profilePicture",
                maxCount:1
            },
        ]
    ),
    registerUser
)
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT,userProfile);
router.route("/list").get(verifyJWT, getAllUsers);
router.route("/editProfile").put(
    verifyJWT,
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1
        }
    ]),
    editProfile
)
export default router;