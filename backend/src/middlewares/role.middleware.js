
import { apiError } from "../utils/apiError.js";

export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user || !req.user.role) {
            throw new apiError(401, "Authentication required, user role not found.");
        }

        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {

            throw new apiError(403, "Forbidden: You do not have permission to perform this action.");
        }
        next();
    };
};