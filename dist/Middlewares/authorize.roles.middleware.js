"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const Error_1 = require("../Utils/Error");
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            throw new Error_1.UnauthorizedError("You Are Not Allowed To Access This Route");
        }
        else {
            next();
        }
    };
};
exports.authorizeRole = authorizeRole;
