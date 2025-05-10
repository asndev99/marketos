"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParams = void 0;
const zod_1 = require("zod");
const validateSchema_1 = require("./validateSchema");
const Error_1 = require("../Utils/Error");
const validateQueryParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = (0, validateSchema_1.formatError)(error);
                next(new Error_1.ValidationError(errors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateQueryParams = validateQueryParams;
