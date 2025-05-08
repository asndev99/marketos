"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_repository_1 = require("../Modules/User/repository/user.repository");
const env_config_1 = require("../Configs/env.config");
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const Error_1 = require("../Utils/Error");
const userRepository = new user_repository_1.MongoUserRepository();
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new Error_1.UnauthorizedError("Session Expired,please login to continue");
        }
        const verifiedUser = jsonwebtoken_2.default.verify(authorization, env_config_1.JWT_SECRET);
        const user = yield userRepository.findById(verifiedUser.id);
        if (!user) {
            throw new Error_1.UnauthorizedError("Session Expired,please login to continue");
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return next(new Error_1.UnauthorizedError("Session Expired, Please login to continue"));
        }
        next(error);
    }
});
exports.verifyUser = verifyUser;
