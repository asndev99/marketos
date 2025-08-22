"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const company_controller_1 = __importDefault(require("./company.controller"));
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const multer_middleware_1 = require("../../Middlewares/formData/multer.middleware");
const companyRouter = require('express').Router();
companyRouter.post('/create-profile', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), (0, multer_middleware_1.createUploadMiddleware)([
    { name: 'logo', maxCount: 1, required: true },
]), company_controller_1.default.createProfile);
companyRouter.patch('/update-profile', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), (0, multer_middleware_1.createUploadMiddleware)([
    { name: 'logo', maxCount: 1, required: false },
]), company_controller_1.default.updateProfile);
companyRouter.get('/', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.getProfile);
companyRouter.get('/order', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.getOrders);
companyRouter.get('/order/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.getOrder);
companyRouter.patch('/update-order/', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.updateOrder);
companyRouter.patch('/update-payment/', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.updateOrderPayment);
companyRouter.get('/order-analytics', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.orderAnalytics);
companyRouter.get('/income-analytics', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.incomeAnalytics);
companyRouter.get('/order-percent', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), company_controller_1.default.orderPercentageAnalytics);
exports.default = companyRouter;
