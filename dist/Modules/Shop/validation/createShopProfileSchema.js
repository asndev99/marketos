"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopProfileSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../../Auth/validation/common");
const common_2 = require("./common");
exports.createShopProfileSchema = zod_1.z
    .object({
    ownerName: common_1.baseStringSchema,
    shopName: common_1.baseStringSchema,
    shopNumber: common_1.baseStringSchema,
    mobileNumber: common_2.mobileNumberSchema,
    shopAddress: common_1.baseStringSchema,
    landMark: common_1.baseStringSchema,
    longitude: zod_1.z.coerce.number(),
    latitude: zod_1.z.coerce.number(),
    NIC: common_2.nicSchema,
    ntn: common_1.baseStringSchema.nullable().optional()
})
    .strict();
