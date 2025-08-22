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
const createProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.createCompanyDetails(req, res);
        return (0, Response_1.successResponse)(res, 200, "Successfully Created Company Profile ", data);
    }
    catch (error) {
        console.log("Error in creating company", error);
        next(error);
    }
});
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.updateCompanyDetails(req, res);
        return (0, Response_1.successResponse)(res, 200, "Successfully Updated Company Profile ", data);
    }
    catch (error) {
        console.log("Error in Updating company", error);
        next(error);
    }
});
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.getCompanyDetails(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get Company Profile Successfully", data);
    }
    catch (error) {
        console.log("Error in creating company", error);
        next(error);
    }
});
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.allOrders(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get All company orders Successfully", data === null || data === void 0 ? void 0 : data.data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.singleOrder(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get order details Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.updateOrder(req, res);
        return (0, Response_1.successResponse)(res, 200, "Update order status Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const updateOrderPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.updateOrderPaymentStatus(req, res);
        return (0, Response_1.successResponse)(res, 200, "Update order payment status Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const orderAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.OrderAnalytics(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get order analytics Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const incomeAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.IncomeAnalytics(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get income analytics Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
const orderPercentageAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield company_service_1.default.pieChart(req, res);
        return (0, Response_1.successResponse)(res, 200, "Get order percentage analytics Successfully", data);
    }
    catch (error) {
        console.log("Error in fetching all orders", error);
        next(error);
    }
});
exports.default = {
    createProfile,
    getProfile,
    getOrders,
    getOrder,
    updateOrder,
    orderAnalytics,
    incomeAnalytics,
    orderPercentageAnalytics,
    updateProfile,
    updateOrderPayment
};
