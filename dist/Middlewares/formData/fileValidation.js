"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageFields = validateImageFields;
const Error_1 = require("../../Utils/Error");
function validateImageFields(requiredFields) {
    return function (req, res, next) {
        const files = req.files;
        for (const field of requiredFields) {
            if (!files || !files[field] || files[field].length === 0) {
                throw new Error_1.ValidationError(`${field} image is required.`);
            }
        }
        next();
    };
}
