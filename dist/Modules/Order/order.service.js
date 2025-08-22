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
const Error_1 = require("../../Utils/Error");
const mongoose_1 = require("mongoose");
const product_repository_1 = require("../Product/repository/product.repository");
const order_repository_1 = require("./repository/order.repository");
const helpers_1 = require("../../Utils/helpers");
const constants_1 = require("../../Common/constants");
const cart_repository_1 = require("../Cart/repository/cart.repository");
const productRepository = new product_repository_1.MongoProductRepository();
const orderRepository = new order_repository_1.MongoOrderRepository();
const cartRepository = new cart_repository_1.MongoCartRepository();
const orderSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderCharges = 0;
    const { orderDetails } = req === null || req === void 0 ? void 0 : req.body;
    let orderSummary = yield Promise.all(orderDetails.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const product = yield productRepository.findOneProduct({ _id: data === null || data === void 0 ? void 0 : data.productId });
        if (!product)
            throw new Error_1.NotFoundError('Product not found !');
        const itemTotal = (product === null || product === void 0 ? void 0 : product.discountedPrice) !== null
            ? (product === null || product === void 0 ? void 0 : product.discountedPrice) * (data === null || data === void 0 ? void 0 : data.quantity)
            : (product === null || product === void 0 ? void 0 : product.price) * (data === null || data === void 0 ? void 0 : data.quantity);
        orderCharges += itemTotal;
        return {
            productId: product === null || product === void 0 ? void 0 : product._id,
            companyId: product === null || product === void 0 ? void 0 : product.companyId,
            image: (_a = product === null || product === void 0 ? void 0 : product.images[0]) === null || _a === void 0 ? void 0 : _a.image,
            name: product === null || product === void 0 ? void 0 : product.name,
            description: product === null || product === void 0 ? void 0 : product.description,
            category: product === null || product === void 0 ? void 0 : product.category,
            price: product === null || product === void 0 ? void 0 : product.price,
            discount: product === null || product === void 0 ? void 0 : product.discountedPrice,
            itemCount: data === null || data === void 0 ? void 0 : data.quantity,
            itemTotal: itemTotal,
        };
    })));
    return {
        orderSummary,
        orderCharges: Number(orderCharges.toFixed(2)),
    };
});
const orderPlacement = (req, res, session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderDetails } = req === null || req === void 0 ? void 0 : req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    let totalBill = 0;
    orderDetails.map((product) => {
        totalBill += product === null || product === void 0 ? void 0 : product.totalPrice;
    });
    const generateID = (0, helpers_1.generateOrderID)();
    const trackingNumber = (0, helpers_1.generateTrackingNumber)();
    const date = new Date();
    const newOrder = yield orderRepository.createOrder({
        orderID: generateID,
        orderTime: date,
        orderTimeEpoch: date.getTime(),
        userId: userId,
        trackingNumber: trackingNumber,
        totalPrice: totalBill,
    }, session);
    const allProducts = yield Promise.all(orderDetails.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        yield cartRepository.RemoveProductFromCart({
            productId: (product === null || product === void 0 ? void 0 : product.productId).toString(),
            userId: userId.toString(),
        });
        return {
            orderId: newOrder === null || newOrder === void 0 ? void 0 : newOrder._id,
            productId: product === null || product === void 0 ? void 0 : product.productId,
            companyId: product === null || product === void 0 ? void 0 : product.companyId,
            quantity: product === null || product === void 0 ? void 0 : product.quantity,
            price: product === null || product === void 0 ? void 0 : product.totalPrice,
            deliveredQuantity: product === null || product === void 0 ? void 0 : product.quantity,
            finalPrice: product === null || product === void 0 ? void 0 : product.totalPrice,
            orderTimeUnitProductPrice: product === null || product === void 0 ? void 0 : product.orderTimePrice,
            PaymentMethod: product === null || product === void 0 ? void 0 : product.paymentMethod,
        };
    })));
    const data = yield orderRepository.createOrderProduct(allProducts, session);
    const paymentData = data.map((productData) => {
        return {
            orderProductId: productData === null || productData === void 0 ? void 0 : productData._id,
            companyId: productData === null || productData === void 0 ? void 0 : productData.companyId,
            amount: productData === null || productData === void 0 ? void 0 : productData.price,
            paymentStatus: constants_1.PaymentStatus.PENDING,
        };
    });
    yield orderRepository.createPaymentTransaction(paymentData, session);
    // await Promise.all(
    //     orderDetails.map( async (product: productValidation) => {
    //         await cartRepository.RemoveProductFromCart({productId: (product?.productId).toString(), userId: userId.toString() })
    //     })
    // )
    return true;
});
const allOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const myOrders = yield orderRepository.allOrders({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id });
    return myOrders.map((order) => {
        var _a;
        let totalItems = 0;
        let totalPrice = 0;
        (_a = order === null || order === void 0 ? void 0 : order.orderProducts) === null || _a === void 0 ? void 0 : _a.map((product) => {
            totalItems = totalItems + (product === null || product === void 0 ? void 0 : product.deliveredQuantity);
            totalPrice = totalPrice + (product === null || product === void 0 ? void 0 : product.finalPrice);
        });
        return {
            _id: order === null || order === void 0 ? void 0 : order._id,
            orderTime: order === null || order === void 0 ? void 0 : order.orderTime,
            orderTimeEpoch: order === null || order === void 0 ? void 0 : order.orderTimeEpoch,
            // totalPrice: order?.totalPrice,
            totalPrice: totalPrice,
            trackingNumber: order === null || order === void 0 ? void 0 : order.trackingNumber,
            orderID: order === null || order === void 0 ? void 0 : order.orderID,
            userId: order === null || order === void 0 ? void 0 : order.userId,
            noOfItems: totalItems,
        };
    });
});
const fetchSingleorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const myOrder = yield orderRepository.singleOrder({
        _id: (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id,
        userId: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id,
    });
    return myOrder !== null
        ? {
            _id: myOrder === null || myOrder === void 0 ? void 0 : myOrder._id,
            orderTime: myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderTime,
            orderTimeEpoch: myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderTimeEpoch,
            //   totalPrice: myOrder?.totalPrice,
            totalPrice: (_c = myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderProducts) === null || _c === void 0 ? void 0 : _c.reduce((acc, product) => acc + ((product === null || product === void 0 ? void 0 : product.finalPrice) || 0), 0),
            trackingNumber: myOrder === null || myOrder === void 0 ? void 0 : myOrder.trackingNumber,
            orderID: myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderID,
            userId: myOrder === null || myOrder === void 0 ? void 0 : myOrder.userId,
            noOfItems: (_d = myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderProducts) === null || _d === void 0 ? void 0 : _d.reduce((acc, product) => acc + ((product === null || product === void 0 ? void 0 : product.deliveredQuantity) || 0), 0),
            products: (_e = myOrder === null || myOrder === void 0 ? void 0 : myOrder.orderProducts) === null || _e === void 0 ? void 0 : _e.map((product) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    orderProductId: product === null || product === void 0 ? void 0 : product._id,
                    productId: product === null || product === void 0 ? void 0 : product.productId,
                    productName: (_a = product === null || product === void 0 ? void 0 : product.product) === null || _a === void 0 ? void 0 : _a.name,
                    productImage: (_c = (_b = product === null || product === void 0 ? void 0 : product.product) === null || _b === void 0 ? void 0 : _b.images[0]) === null || _c === void 0 ? void 0 : _c.image,
                    companyId: product === null || product === void 0 ? void 0 : product.companyId,
                    quantity: product === null || product === void 0 ? void 0 : product.quantity,
                    price: product === null || product === void 0 ? void 0 : product.price,
                    deliveredQuantity: product === null || product === void 0 ? void 0 : product.deliveredQuantity,
                    finalPrice: product === null || product === void 0 ? void 0 : product.finalPrice,
                    orderTimeUnitProductPrice: product === null || product === void 0 ? void 0 : product.orderTimeUnitProductPrice,
                    paymentMethod: product === null || product === void 0 ? void 0 : product.PaymentMethod,
                    orderStatus: product === null || product === void 0 ? void 0 : product.orderStatus,
                    isOrderPlaced: product === null || product === void 0 ? void 0 : product.isOrderPlaced,
                    paymentTransaction: {
                        paymentId: (_d = product === null || product === void 0 ? void 0 : product.paymentTransaction) === null || _d === void 0 ? void 0 : _d._id,
                        amount: (_e = product === null || product === void 0 ? void 0 : product.paymentTransaction) === null || _e === void 0 ? void 0 : _e.amount,
                        paymentStatus: (_f = product === null || product === void 0 ? void 0 : product.paymentTransaction) === null || _f === void 0 ? void 0 : _f.paymentStatus,
                    },
                });
            }),
        }
        : null;
});
const pieAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const allIds = yield orderRepository.orderIds(((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id).toString());
    const orders = yield orderRepository.shopOrderAnalytics(allIds);
    const _orders = orders.filter((order) => order.orderStatus !== 'DELIVERED');
    const receivedOrders = _orders.filter((order) => order.orderStatus === 'RECEIVED');
    const companyCancelled = _orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = _orders.filter((order) => order.orderStatus === 'PENDING');
    return {
        weeklyReceivedOrdersPercentage: Math.round((receivedOrders.length / _orders.length) * 100),
        weeklyCompanyCancelledPercentage: Math.round((companyCancelled.length / _orders.length) * 100),
        weeklyPendingPercentage: Math.round((pending.length / _orders.length) * 100),
    };
});
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const orderId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    const status = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.status;
    const data = yield orderRepository.updateOrderForShop(orderId, status);
    return data;
});
const updateOrderPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const orderId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    const status = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.status;
    yield orderRepository.paymentUpdateForCompanyOrder([
        {
            id: new mongoose_1.Types.ObjectId(orderId),
            status,
            price: 0,
            quantity: 0,
        },
    ]);
    return true;
});
exports.default = {
    orderSummary,
    orderPlacement,
    allOrders,
    fetchSingleorder,
    pieAnalytics,
    updateOrderStatus,
    updateOrderPaymentStatus
};
