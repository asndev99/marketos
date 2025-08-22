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
const mongoose_1 = __importDefault(require("mongoose"));
const Response_1 = require("../../Utils/Response");
const order_service_1 = __importDefault(require("./order.service"));
const fetchOrderSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.orderSummary(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched Product Details ', data);
    }
    catch (error) {
        console.log('Error in fetching order summary', error);
        next(error);
    }
});
const placeAnOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const data = yield order_service_1.default.orderPlacement(req, res, session);
        yield session.commitTransaction();
        return (0, Response_1.successResponse)(res, 200, 'Successfully Placed Your Order ', data);
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.log('Error in placing an order', error);
        next(error);
    }
});
const myOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.allOrders(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched All Your Order ', data);
    }
    catch (error) {
        console.log('Error in fetching in orders', error);
        next(error);
    }
});
const mySingleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.fetchSingleorder(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched Your Order Details', data);
    }
    catch (error) {
        console.log('Error in fatching order details', error);
        next(error);
    }
});
const pieChartAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.pieAnalytics(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched Order Pie-Chart Analytics ', data);
    }
    catch (error) {
        console.log('Error in fetching in orders', error);
        next(error);
    }
});
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.updateOrderStatus(req, res);
        if (data.status)
            return (0, Response_1.successResponse)(res, 200, 'Successfully Update the order status ', data);
        else
            return (0, Response_1.errorResponse)(res, 400, data === null || data === void 0 ? void 0 : data.message);
    }
    catch (error) {
        console.log('Error in updating orders', error);
        next(error);
    }
});
const updateOrderPaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield order_service_1.default.updateOrderPaymentStatus(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Update the order payment status ', data);
    }
    catch (error) {
        console.log('Error in updating orders', error);
        next(error);
    }
});
exports.default = {
    fetchOrderSummary,
    placeAnOrder,
    myOrders,
    mySingleOrder,
    pieChartAnalytics,
    updateOrderStatus,
    updateOrderPaymentStatus
};
