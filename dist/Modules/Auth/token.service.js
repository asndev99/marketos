"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../Configs/env.config");
const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "7d";
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign({ id: payload._id, role: payload.role }, env_config_1.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign({ id: payload._id, role: payload.role }, env_config_1.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};
const TokenService = {
    generateAccessToken,
    generateRefreshToken,
};
exports.default = TokenService;
