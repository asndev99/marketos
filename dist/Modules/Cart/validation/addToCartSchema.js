"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCartSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.addToCartSchema = zod_1.z
    .object({
    shopId: common_1.baseStringSchema,
    productId: common_1.baseStringSchema,
})
    .strict();
