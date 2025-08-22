"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadMiddleware = createUploadMiddleware;
const multer_1 = __importDefault(require("multer"));
const Error_1 = require("../../Utils/Error");
const storage = multer_1.default.memoryStorage();
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`${file.fieldname} must be an image.`));
    }
};
const upload = (0, multer_1.default)({
    fileFilter,
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
function createUploadMiddleware(fields) {
    const middleware = upload.fields(fields);
    return function (req, res, next) {
        middleware(req, res, function (err) {
            if (err) {
                return next(new Error_1.ValidationError(err.message));
            }
            const files = req.files;
            for (const field of fields) {
                if (field.required &&
                    (!files || !files[field.name] || files[field.name].length === 0)) {
                    return next(new Error_1.ValidationError(`${field.name} is required`));
                }
            }
            next();
        });
    };
}
