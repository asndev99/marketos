"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserNameSchema = exports.login = exports.passwordSchema = exports.baseStringSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../../../../Common/constants");
exports.baseStringSchema = zod_1.z.string().trim().min(1, 'Field cannot be empty');
exports.passwordSchema = zod_1.z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character');
exports.login = zod_1.z
    .object({
    username: exports.baseStringSchema,
    password: exports.baseStringSchema,
    role: zod_1.z.enum(constants_1.roles),
})
    .strict();
exports.validateUserNameSchema = zod_1.z
    .object({
    username: exports.baseStringSchema,
})
    .strict();
