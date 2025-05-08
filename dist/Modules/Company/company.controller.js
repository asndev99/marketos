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
const Response_1 = require("../../Utils/Response");
const company_service_1 = __importDefault(require("./company.service"));
const loginCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.login(req, res);
        return (0, Response_1.successResponse)(res, 200, "Successfully Logged in ", data);
    }
    catch (error) {
        console.log("Error in logging in admin", error);
        next(error);
    }
});
const createProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.createCompanyDetails(req, res);
        return (0, Response_1.successResponse)(res, 200, "Successfully Created Company Profile ", data);
    }
    catch (error) {
        console.log("Error in creating product", error);
        next(error);
    }
});
exports.default = {
    loginCompany,
    createProfile,
};
