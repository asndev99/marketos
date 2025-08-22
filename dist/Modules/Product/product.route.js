"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = __importDefault(require("./product.controller"));
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const multer_middleware_1 = require("../../Middlewares/formData/multer.middleware");
const productRouter = require('express').Router();
productRouter.post('/', auth_middleware_1.verifyUser, (0, multer_middleware_1.createUploadMiddleware)([{ name: 'productImage', maxCount: 4, required: true }]), (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), product_controller_1.default.createProduct);
productRouter.get('/', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), product_controller_1.default.fetchAllProduct);
productRouter.get('/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), product_controller_1.default.fetchProductDetails);
productRouter.patch('/:id', auth_middleware_1.verifyUser, (0, multer_middleware_1.createUploadMiddleware)([{ name: 'productImage', maxCount: 4, required: false }]), (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), product_controller_1.default.updateProductDetails);
productRouter.delete('/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.COMPANY), product_controller_1.default.deleteProduct);
exports.default = productRouter;
