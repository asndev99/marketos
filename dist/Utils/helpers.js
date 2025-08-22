"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayName = exports.generateTrackingNumber = exports.generateOrderID = exports.paginate = exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uuid_1 = require("uuid");
cloudinary_1.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});
const uploadBufferToCloudinary = (buffer, filename, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: filename === null || filename === void 0 ? void 0 : filename.split('.')[0], // optional
            resource_type: 'image',
        }, (error, result) => {
            if (error || !result) {
                return reject(new Error((error === null || error === void 0 ? void 0 : error.message) || 'Upload to Cloudinary failed'));
            }
            resolve({
                url: result.secure_url,
                uploadedAt: new Date(result.created_at),
            });
        });
        stream_1.Readable.from(buffer).pipe(stream);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
/**
 * Generates pagination parameters for MongoDB queries using offset-based pagination.
 *
 * @param {number} [page=1] - The current page number (1-based).
 * @param {number} [pageSize=10] - The number of documents to return per page.
 * @returns {{ skip: number, limit: number }} An object containing `skip` and `limit` values.
 *
 * @example
 * const { skip, limit } = paginate(2, 5);
 * // skip = 5, limit = 5 (for page 2)
 */
const paginate = (page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
    return {
        skip,
        limit: pageSize,
    };
};
exports.paginate = paginate;
const generateOrderID = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = (0, uuid_1.v4)().replace(/-/g, '').substring(0, 10).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
};
exports.generateOrderID = generateOrderID;
const generateTrackingNumber = () => {
    return `TRK-${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10).toUpperCase()}`;
};
exports.generateTrackingNumber = generateTrackingNumber;
const getDayName = (fdate) => {
    const date = new Date(fdate);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(date);
};
exports.getDayName = getDayName;
