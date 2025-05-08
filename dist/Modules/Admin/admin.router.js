"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateSchema_1 = require("../../Middlewares/validateSchema");
const createCompanySchema_1 = require("./validation/createCompanySchema");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const createAdminSchema_1 = require("./validation/createAdminSchema");
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const loginAdminSchema_1 = require("./validation/loginAdminSchema");
const adminRouter = require("express").Router();
adminRouter.post("/create-admin", (0, validateSchema_1.validateSchema)(createAdminSchema_1.createAdminSchema), admin_controller_1.default.createAdmin);
adminRouter.post("/login", (0, validateSchema_1.validateSchema)(loginAdminSchema_1.loginAdminSchema), admin_controller_1.default.loginAdmin);
adminRouter.post("/create-company", auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.ADMIN), (0, validateSchema_1.validateSchema)(createCompanySchema_1.createCompanySchema), admin_controller_1.default.createCompany);
exports.default = adminRouter;
