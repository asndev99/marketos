"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_controller_1 = __importDefault(require("./order.controller"));
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const orderRouter = require('express').Router();
orderRouter.post('/summary', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.fetchOrderSummary);
orderRouter.post('/place-order', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.placeAnOrder);
orderRouter.get('/all-order', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.myOrders);
orderRouter.get('/single-order/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.mySingleOrder);
orderRouter.get('/pie-analytics', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.pieChartAnalytics);
orderRouter.patch('/update-status/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.updateOrderStatus);
orderRouter.patch('/update-payment/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), order_controller_1.default.updateOrderPaymentStatus);
exports.default = orderRouter;
