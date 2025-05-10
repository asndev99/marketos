"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const Error_1 = require("../Utils/Error");
const storage = multer_1.default.memoryStorage();
const fileLimit = 5 * 1024 * 1024; // 5 MB
const fields = [
    { name: "coverPhoto", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "productImage", maxCount: 4 },
];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
const allowedFileTypes = {
    coverPhoto: allowedMimeTypes,
    logo: allowedMimeTypes,
    productImage: allowedMimeTypes,
};
const handleMulterError = (err) => {
    if (err && err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return "Unable to upload image. Make sure that only allowed key name is used and only one file is uploaded at a time.";
        }
        if (err.code === "LIMIT_FILE_SIZE") {
            return "Unable to upload image. Max file size limit is 10MB.";
        }
    }
    else if (err instanceof Error) {
        return err.message;
    }
};
const fileFilter = (req, file, cb) => {
    //   const fieldTypes = allowedFileTypes[file.fieldname as AllowedFieldNames];
    if (!((file === null || file === void 0 ? void 0 : file.fieldname) in allowedFileTypes)) {
        return cb(new Error(`File field '${file.fieldname}' is not allowed.`));
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
    }
};
function handleMultipartData(type) {
    // const type = this.valueOf();
    return (req, res, next) => {
        const upload = (0, multer_1.default)({
            storage,
            fileFilter,
            limits: { fileSize: fileLimit },
        }).fields(fields);
        upload(req, res, (err) => {
            if (!req.files || Object.keys(req.files).length === 0) {
                console.log("No file selected.");
                req.files = undefined;
            }
            if (typeof type === "string" && !Object.keys(req.files || {}).includes(type)) {
                return next(new Error_1.BadRequestError(`${type} is required`));
            }
            const error = handleMulterError(err);
            if (error) {
                return next(new Error_1.BadRequestError(error));
            }
            next();
        });
    };
}
module.exports = handleMultipartData;
