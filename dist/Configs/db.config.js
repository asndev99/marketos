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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const Error_1 = require("../Utils/Error");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!env_config_1.MONGO_URI) {
            throw new Error_1.BadRequestError("MONGO_URI NOT FOUND");
        }
        const conn = yield mongoose_1.default.connect(env_config_1.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
    }
    catch (error) {
        console.log("Error in connecting mongodb");
        throw error;
    }
});
exports.connectDB = connectDB;
