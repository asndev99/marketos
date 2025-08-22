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
const auth_service_1 = __importDefault(require("./auth.service"));
const Response_1 = require("../../Utils/Response");
//ADMIN SPECIFIC ROUTES
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = auth_service_1.default.createAdmin(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Admin Created Successfully', data);
    }
    catch (error) {
        console.log('Error in creating admin', error);
        next(error);
    }
});
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = auth_service_1.default.createCompany(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Company Created Successfully', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
//IT SHOULD BE ROLE BASED DYNAMIC LOGIN.
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield auth_service_1.default.login(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Logged In Successfully', data);
    }
    catch (error) {
        console.log('Error in logging in', error);
        next(error);
    }
});
//NOT IN USER FOR NOW
const createShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield auth_service_1.default.createShop(req);
        return (0, Response_1.successResponse)(res, 200, 'Shop User Created Now Complete Details', data);
    }
    catch (error) {
        console.log('Error in creating shop', error);
        next(error);
    }
});
const validateUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield auth_service_1.default.validateUsername(req);
        return (0, Response_1.successResponse)(res, 200, 'Username is available', null);
    }
    catch (error) {
        console.log('Error in validating username', error);
        next(error);
    }
});
exports.default = {
    login,
    createAdmin,
    createCompany,
    createShop,
    validateUsername,
};
