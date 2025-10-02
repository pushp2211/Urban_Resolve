import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        // ensure the user object is attached by the auth middleware
        if (!req.user || !req.user.role) {
            throw new apiError(401, "Authentication required, user role not found.");
        }

        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            // If not, they are forbidden from accessing this resource
            throw new apiError(403, "Forbidden: You do not have permission to perform this action.");
        }
        next();
    };
};