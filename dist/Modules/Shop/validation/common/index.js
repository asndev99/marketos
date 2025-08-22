"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicSchema = exports.mobileNumberSchema = void 0;
const zod_1 = require("zod");
exports.mobileNumberSchema = zod_1.z.string().regex(/^03[0-9]{2}-[0-9]{7}$/, {
    message: 'Invalid mobile number format. Use 03XX-XXXXXXX',
});
exports.nicSchema = zod_1.z.string().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/, {
    message: 'Invalid NIC format. Use XXXXX-XXXXXXX-X',
});
