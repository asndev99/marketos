"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = exports.formatError = void 0;
const zod_1 = require("zod");
const Error_1 = require("../Utils/Error");
const formatError = (error) => {
    var _a;
    let errors = {};
    (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((issue) => {
        var _a;
        errors[(_a = issue.path) === null || _a === void 0 ? void 0 : _a[0]] = issue.message;
    });
    return errors;
};
exports.formatError = formatError;
const validateSchema = (schema) => {
    return (req, res, next) => {
        let dataToValidate;
        if (req.is("multipart/form-data")) {
            dataToValidate = Object.fromEntries(Object.entries(req.body).map(([key, value]) => [key, value]));
        }
        else if (req.is("application/json")) {
            dataToValidate = req.body;
        }
        try {
            schema.parse(dataToValidate);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = (0, exports.formatError)(error);
                const validationErrorInstance = new Error_1.ValidationError(errors);
                next(validationErrorInstance);
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateSchema = validateSchema;
