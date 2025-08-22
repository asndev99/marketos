"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseStringSchema = void 0;
const zod_1 = require("zod");
exports.baseStringSchema = zod_1.z.string().trim().min(1, 'Field cannot be empty');
