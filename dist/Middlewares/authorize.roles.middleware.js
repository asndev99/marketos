"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const Error_1 = require("../Utils/Error");
/**
 * Middleware to authorize based on one or more roles.
 * @param roles - allowed roles
 */
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new Error_1.UnauthorizedError('You are not allowed to access this route');
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
