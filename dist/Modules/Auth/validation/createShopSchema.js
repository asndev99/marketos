"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.createShopSchema = zod_1.z
    .object({
    username: common_1.baseStringSchema,
    password: common_1.passwordSchema,
})
    .strict();
