"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSchema = exports.baseStringSchema = void 0;
const zod_1 = require("zod");
exports.baseStringSchema = zod_1.z
    .string()
    .trim()
    .min(1, "Field cannot be empty");
exports.passwordSchema = zod_1.z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character");
