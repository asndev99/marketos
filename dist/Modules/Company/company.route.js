"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateSchema_1 = require("../../Middlewares/validateSchema");
const company_controller_1 = __importDefault(require("./company.controller"));
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const loginAdminSchema_1 = require("../Admin/validation/loginAdminSchema");
const companyRouter = require("express").Router();
companyRouter.post("/login", (0, validateSchema_1.validateSchema)(loginAdminSchema_1.loginAdminSchema), company_controller_1.default.loginCompany);
companyRouter.post("/create-profile", auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), 
// Need to add multer middleware
company_controller_1.default.createProfile);
exports.default = companyRouter;
