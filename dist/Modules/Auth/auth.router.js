"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateSchema_1 = require("../../Middlewares/validateSchema");
const createAdminSchema_1 = require("./validation/createAdminSchema");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const createCompanySchema_1 = require("./validation/createCompanySchema");
const common_1 = require("./validation/common");
const createShopSchema_1 = require("./validation/createShopSchema");
const authRouter = (0, express_1.Router)();
//ADMIN SPECIFIC ROUTES
authRouter.post('/admin/create-admin', (0, validateSchema_1.validateSchema)(createAdminSchema_1.createAdminSchema), auth_controller_1.default.createAdmin);
authRouter.post('/admin/create-company', (0, validateSchema_1.validateSchema)(createCompanySchema_1.createCompanySchema), auth_controller_1.default.createCompany);
authRouter.post('/create-shop', (0, validateSchema_1.validateSchema)(createShopSchema_1.createShopSchema), auth_controller_1.default.createShop);
//GENERALIZED ROUTES
authRouter.post('/login', (0, validateSchema_1.validateSchema)(common_1.login), auth_controller_1.default.login);
authRouter.post('/validate-username', (0, validateSchema_1.validateSchema)(common_1.validateUserNameSchema), auth_controller_1.default.validateUsername);
exports.default = authRouter;
