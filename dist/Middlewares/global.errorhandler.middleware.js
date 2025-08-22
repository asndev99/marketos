"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const Response_1 = require("../Utils/Response");
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Something Went Wrong';
    return (0, Response_1.errorResponse)(res, statusCode, message);
};
exports.globalErrorHandler = globalErrorHandler;
