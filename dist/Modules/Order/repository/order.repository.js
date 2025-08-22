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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoOrderRepository = void 0;
const order_model_1 = require("../order.model");
const mongoose_1 = require("mongoose");
class MongoOrderRepository {
    createOrder(data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.UserOrderModel.create([data], { session }).then((docs) => docs[0]);
        });
    }
    createOrderProduct(data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.OrderProductModel.insertMany(data, { session });
        });
    }
    createPaymentTransaction(data, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.PaymentTransactionModel.insertMany(data, { session });
        });
    }
    allOrders(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_model_1.UserOrderModel.find(Object.assign({}, payload))
                .populate({
                path: 'orderProducts',
                populate: {
                    path: 'paymentTransaction',
                },
            })
                .lean()
                .exec();
        });
    }
    singleOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOrder = yield order_model_1.UserOrderModel.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.userId),
                    },
                },
                {
                    $lookup: {
                        from: 'orderproducts',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderProducts',
                    },
                },
                {
                    $unwind: '$orderProducts',
                },
                {
                    $lookup: {
                        from: 'paymenttransactions',
                        localField: 'orderProducts._id',
                        foreignField: 'orderProductId',
                        as: 'orderProducts.paymentTransaction',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.paymentTransaction',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderProducts.productId',
                        foreignField: '_id',
                        as: 'orderProducts.product',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.product',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'productimages',
                        localField: 'orderProducts.product._id',
                        foreignField: 'productId',
                        as: 'orderProducts.product.images',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        orderTime: { $first: '$orderTime' },
                        orderTimeEpoch: { $first: '$orderTimeEpoch' },
                        totalPrice: { $first: '$totalPrice' },
                        trackingNumber: { $first: '$trackingNumber' },
                        orderID: { $first: '$orderID' },
                        userId: { $first: '$userId' },
                        createdAt: { $first: '$createdAt' },
                        updatedAt: { $first: '$updatedAt' },
                        orderProducts: { $push: '$orderProducts' },
                    },
                },
            ]);
            return userOrder[0];
        });
    }
    allOrdersForCompany(orderStatus, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOrders = yield order_model_1.UserOrderModel.aggregate([
                {
                    $lookup: {
                        from: 'orderproducts',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderProducts',
                    },
                },
                {
                    $unwind: '$orderProducts',
                },
                {
                    $match: {
                        'orderProducts.companyId': new mongoose_1.Types.ObjectId(companyId),
                        'orderProducts.orderStatus': orderStatus === "RECEIVED" ? { $in: ["DELIVERED", "RECEIVED"] } : orderStatus
                    },
                },
                {
                    $lookup: {
                        from: 'paymenttransactions',
                        localField: 'orderProducts._id',
                        foreignField: 'orderProductId',
                        as: 'orderProducts.paymentTransaction',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.paymentTransaction',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderProducts.productId',
                        foreignField: '_id',
                        as: 'orderProducts.product',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.product',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'productimages',
                        localField: 'orderProducts.product._id',
                        foreignField: 'productId',
                        as: 'orderProducts.product.images',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        orderTime: { $first: '$orderTime' },
                        orderTimeEpoch: { $first: '$orderTimeEpoch' },
                        totalPrice: { $first: '$totalPrice' },
                        trackingNumber: { $first: '$trackingNumber' },
                        orderID: { $first: '$orderID' },
                        userId: { $first: '$userId' },
                        createdAt: { $first: '$createdAt' },
                        updatedAt: { $first: '$updatedAt' },
                        orderProducts: { $push: '$orderProducts' },
                    },
                },
            ]);
            return userOrders;
        });
    }
    singleOrderForCompany(orderId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOrder = yield order_model_1.UserOrderModel.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.Types.ObjectId(orderId),
                    },
                },
                {
                    $lookup: {
                        from: 'orderproducts',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderProducts',
                    },
                },
                {
                    $unwind: '$orderProducts',
                },
                {
                    $match: {
                        'orderProducts.companyId': new mongoose_1.Types.ObjectId(companyId),
                    },
                },
                {
                    $lookup: {
                        from: 'paymenttransactions',
                        localField: 'orderProducts._id',
                        foreignField: 'orderProductId',
                        as: 'orderProducts.paymentTransaction',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.paymentTransaction',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderProducts.productId',
                        foreignField: '_id',
                        as: 'orderProducts.product',
                    },
                },
                {
                    $unwind: {
                        path: '$orderProducts.product',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'productimages',
                        localField: 'orderProducts.product._id',
                        foreignField: 'productId',
                        as: 'orderProducts.product.images',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        orderTime: { $first: '$orderTime' },
                        orderTimeEpoch: { $first: '$orderTimeEpoch' },
                        totalPrice: { $first: '$totalPrice' },
                        trackingNumber: { $first: '$trackingNumber' },
                        orderID: { $first: '$orderID' },
                        userId: { $first: '$userId' },
                        createdAt: { $first: '$createdAt' },
                        updatedAt: { $first: '$updatedAt' },
                        orderProducts: { $push: '$orderProducts' },
                    },
                },
            ]);
            return userOrder[0];
        });
    }
    orderUpdateForCompany(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const operations = payload.map((item) => ({
                updateOne: {
                    filter: { _id: item === null || item === void 0 ? void 0 : item.id },
                    update: {
                        $set: {
                            orderStatus: item === null || item === void 0 ? void 0 : item.status,
                            deliveredQuantity: item === null || item === void 0 ? void 0 : item.quantity,
                            finalPrice: item === null || item === void 0 ? void 0 : item.price,
                            isOrderPlaced: true,
                        },
                    },
                },
            }));
            const operationsPayment = payload.map((item) => ({
                updateOne: {
                    filter: { orderProductId: item === null || item === void 0 ? void 0 : item.id },
                    update: {
                        $set: {
                            amount: item === null || item === void 0 ? void 0 : item.price,
                        },
                    },
                },
            }));
            yield order_model_1.OrderProductModel.bulkWrite(operations);
            yield order_model_1.PaymentTransactionModel.bulkWrite(operationsPayment);
            return true;
        });
    }
    paymentUpdateForCompanyOrder(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const operationsPayment = payload.map((item) => ({
                updateOne: {
                    filter: { _id: item === null || item === void 0 ? void 0 : item.id },
                    update: {
                        $set: {
                            paymentStatus: item === null || item === void 0 ? void 0 : item.status,
                        },
                    },
                },
            }));
            yield order_model_1.PaymentTransactionModel.bulkWrite(operationsPayment);
            return true;
        });
    }
    companyAnalyticsOrders(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return order_model_1.OrderProductModel.find({
                companyId: companyId,
                createdAt: { $gte: sevenDaysAgo },
            });
        });
    }
    orderIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield order_model_1.UserOrderModel.find({ userId }).select('_id').lean();
            const ids = orders.map((order) => order._id.toString());
            return ids;
        });
    }
    shopOrderAnalytics(orderIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 10);
            return order_model_1.OrderProductModel.find({
                orderId: {
                    $in: orderIds,
                },
                createdAt: { $gte: sevenDaysAgo },
            });
        });
    }
    updateOrderForShop(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_model_1.OrderProductModel.findById(orderId).select('orderStatus');
            if ((order === null || order === void 0 ? void 0 : order.orderStatus) !== 'PENDING' && status === 'USER_CANCELLED') {
                return {
                    message: "Order Is Already Accepted by company You Cant't cancel this!",
                    status: false,
                };
            }
            if ((order === null || order === void 0 ? void 0 : order.orderStatus) !== 'DELIVERED' && status === 'RECEIVED') {
                return {
                    message: "You Can't received this order untill it is delivered by company",
                    status: false,
                };
            }
            yield order_model_1.OrderProductModel.updateOne({ _id: orderId }, { orderStatus: status });
            return {
                message: `You ${status === 'USER_CANCELLED' ? 'Cancelled' : 'Reeived'} this product`,
                status: true,
            };
        });
    }
}
exports.MongoOrderRepository = MongoOrderRepository;
