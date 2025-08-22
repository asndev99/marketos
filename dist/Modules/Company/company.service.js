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
const company_repository_1 = require("./repository/company.repository");
const user_repository_1 = require("../User/repository/user.repository");
const helpers_1 = require("../../Utils/helpers");
const order_repository_1 = require("../Order/repository/order.repository");
const shop_repository_1 = require("../Shop/repository/shop.repository");
const helpers_2 = require("../../Utils/helpers");
const companyRepository = new company_repository_1.MongoCompanyRepository();
const userRepository = new user_repository_1.MongoUserRepository();
const orderRepository = new order_repository_1.MongoOrderRepository();
const shopRepository = new shop_repository_1.ShopRepository();
const createCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { companyName } = req.body;
    const files = req.files;
    const logoFile = (_a = files['logo']) === null || _a === void 0 ? void 0 : _a[0];
    const userId = req.user._id;
    const isCompanyAlreadyExist = yield companyRepository.findOne({
        userId,
        companyName,
    });
    if (isCompanyAlreadyExist) {
        throw new Error_1.BadRequestError('Company already Created');
    }
    const { url: logo } = yield (0, helpers_1.uploadBufferToCloudinary)(logoFile.buffer, logoFile.originalname, 'companies');
    companyRepository.create(Object.assign(Object.assign({ userId }, req.body), { profileLogo: logo }));
    yield userRepository.findByIdAndUpdate(userId.toString(), { isProfileCompleted: true });
});
const updateCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req === null || req === void 0 ? void 0 : req.files;
    const logoFile = (_a = files['logo']) === null || _a === void 0 ? void 0 : _a[0];
    const userId = req.user._id;
    const isCompanyAlreadyExist = yield companyRepository.findOne({
        userId
    });
    if (!isCompanyAlreadyExist) {
        throw new Error_1.BadRequestError('Company Not Found');
    }
    let logo;
    if (logoFile) {
        const { url } = yield (0, helpers_1.uploadBufferToCloudinary)(logoFile.buffer, logoFile.originalname, 'companies');
        logo = url;
    }
    yield companyRepository.update(isCompanyAlreadyExist === null || isCompanyAlreadyExist === void 0 ? void 0 : isCompanyAlreadyExist.id.toString(), Object.assign(Object.assign({}, req === null || req === void 0 ? void 0 : req.body), (logo && { profileLogo: logo })));
    return true;
});
const getCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return companyRepository.findOne({ userId: req.user._id });
});
const allOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    const companyId = company === null || company === void 0 ? void 0 : company.id.toString();
    const status = req === null || req === void 0 ? void 0 : req.query.status;
    const orders = yield orderRepository.allOrdersForCompany(status, companyId);
    const uniqueUserIds = [...new Set(orders.map((o) => o.userId.toString()))];
    const userCache = new Map();
    yield Promise.all(uniqueUserIds.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userRepository.findById(userId);
        const shopkeeper = yield shopRepository.findOne({ userId });
        if (user && shopkeeper) {
            const [longitude, latitude] = shopkeeper.location.coordinates;
            userCache.set(userId, {
                ownerName: shopkeeper.ownerName,
                shopName: shopkeeper.shopName,
                mobileNumber: shopkeeper.mobileNumber,
                shopAddress: shopkeeper.shopAddress,
                landmark: shopkeeper.landMark,
                latitude: latitude,
                longitude: longitude,
            });
        }
    })));
    let result = [];
    yield Promise.all(orders.map((order) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = order === null || order === void 0 ? void 0 : order.userId.toString();
        let total = 0;
        let finalTotal = 0;
        let products = order === null || order === void 0 ? void 0 : order.orderProducts.map((orderproduct) => {
            var _a, _b, _c, _d, _e, _f;
            total = total + (orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.price);
            finalTotal = finalTotal + (orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.finalPrice);
            return {
                orderProductId: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct._id,
                productId: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.productId,
                productName: (_a = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.product) === null || _a === void 0 ? void 0 : _a.name,
                productImage: (_c = (_b = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.product) === null || _b === void 0 ? void 0 : _b.images[0]) === null || _c === void 0 ? void 0 : _c.image,
                quantity: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.quantity,
                price: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.price,
                deliveredQuantity: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.deliveredQuantity,
                finalPrice: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.finalPrice,
                orderTimeUnitProductPrice: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.orderTimeUnitProductPrice,
                isOrderPlaced: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.isOrderPlaced,
                orderStatus: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.orderStatus,
                PaymentMethod: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.PaymentMethod,
                paymentTransaction: {
                    paymentId: (_d = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _d === void 0 ? void 0 : _d._id,
                    amount: (_e = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _e === void 0 ? void 0 : _e.amount,
                    paymentStatus: (_f = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _f === void 0 ? void 0 : _f.paymentStatus,
                },
            };
        });
        result.push({
            _id: order === null || order === void 0 ? void 0 : order._id,
            trackingNumber: order === null || order === void 0 ? void 0 : order.trackingNumber,
            orderID: order === null || order === void 0 ? void 0 : order.orderID,
            orderTime: order === null || order === void 0 ? void 0 : order.orderTime,
            orderTimeEpoch: order === null || order === void 0 ? void 0 : order.orderTimeEpoch,
            actutalTotalAmount: total,
            finalTotalAmount: finalTotal,
            shopkeeprDetails: userCache.get(userId),
            products,
        });
    })));
    return { data: result.reverse() };
});
const singleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const company = yield companyRepository.findOne({ userId: req.user._id });
    const companyId = company === null || company === void 0 ? void 0 : company.id.toString();
    const orderId = req.params.id;
    const order = yield orderRepository.singleOrderForCompany(orderId, companyId);
    const userId = order === null || order === void 0 ? void 0 : order.userId.toString();
    const user = yield userRepository.findById(userId);
    const shopkeeper = yield shopRepository.findOne({ userId });
    let total = 0;
    let finalTotal = 0;
    let products = order === null || order === void 0 ? void 0 : order.orderProducts.map((orderproduct) => {
        var _a, _b, _c, _d, _e, _f;
        total = total + (orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.price);
        finalTotal = finalTotal + (orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.finalPrice);
        return {
            orderProductId: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct._id,
            productId: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.productId,
            productName: (_a = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.product) === null || _a === void 0 ? void 0 : _a.name,
            productImage: (_c = (_b = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.product) === null || _b === void 0 ? void 0 : _b.images[0]) === null || _c === void 0 ? void 0 : _c.image,
            quantity: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.quantity,
            price: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.price,
            deliveredQuantity: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.deliveredQuantity,
            finalPrice: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.finalPrice,
            orderTimeUnitProductPrice: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.orderTimeUnitProductPrice,
            isOrderPlaced: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.isOrderPlaced,
            orderStatus: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.orderStatus,
            PaymentMethod: orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.PaymentMethod,
            paymentTransaction: {
                paymentId: (_d = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _d === void 0 ? void 0 : _d._id,
                amount: (_e = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _e === void 0 ? void 0 : _e.amount,
                paymentStatus: (_f = orderproduct === null || orderproduct === void 0 ? void 0 : orderproduct.paymentTransaction) === null || _f === void 0 ? void 0 : _f.paymentStatus,
            },
        };
    });
    // const [longitude, latitude] = shopkeeper?.location.coordinates;
    return {
        _id: order === null || order === void 0 ? void 0 : order._id,
        trackingNumber: order === null || order === void 0 ? void 0 : order.trackingNumber,
        orderID: order === null || order === void 0 ? void 0 : order.orderID,
        orderTime: order === null || order === void 0 ? void 0 : order.orderTime,
        orderTimeEpoch: order === null || order === void 0 ? void 0 : order.orderTimeEpoch,
        actutalTotalAmount: total,
        finalTotalAmount: finalTotal,
        shopkeeperDetails: {
            ownerName: shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.ownerName,
            shopName: shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.shopName,
            mobileNumber: shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.mobileNumber,
            shopAddress: shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.shopAddress,
            landmark: shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.landMark,
            latitude: (_a = shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.location.coordinates[1]) !== null && _a !== void 0 ? _a : null,
            longitude: (_b = shopkeeper === null || shopkeeper === void 0 ? void 0 : shopkeeper.location.coordinates[0]) !== null && _b !== void 0 ? _b : null,
        },
        products,
    };
});
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    // const companyId: string = company?.id.toString();
    const { orderUpdate } = req === null || req === void 0 ? void 0 : req.body;
    yield orderRepository.orderUpdateForCompany(orderUpdate);
    return true;
});
const updateOrderPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    // const companyId: string = company?.id.toString();
    const { paymentUpdate } = req === null || req === void 0 ? void 0 : req.body;
    yield orderRepository.paymentUpdateForCompanyOrder(paymentUpdate);
    return true;
});
const OrderAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    const companyId = company === null || company === void 0 ? void 0 : company.id.toString();
    const orders = yield orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter((order) => order.orderStatus === 'DELIVERED' || order.orderStatus === 'RECEIVED');
    const companyCancelled = orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = orders.filter((order) => order.orderStatus === 'PENDING');
    const weeklyDeliveredOrders = orderByWeek(deliveredOrders);
    const weeklyCompanyCancelled = orderByWeek(companyCancelled);
    const weeklyPending = orderByWeek(pending);
    return {
        weeklyDeliveredOrders: weeklyDeliveredOrders,
        weeklyCompanyCancelled: weeklyCompanyCancelled,
        weeklyPending: weeklyPending,
    };
});
const IncomeAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    const companyId = company === null || company === void 0 ? void 0 : company.id.toString();
    const orders = yield orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter((order) => order.orderStatus === 'DELIVERED');
    const weeklyDeliveredOrders = incomeByWeek(deliveredOrders);
    return {
        weeklyIncome: weeklyDeliveredOrders,
    };
});
const pieChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield companyRepository.findOne({ userId: req.user._id });
    const companyId = company === null || company === void 0 ? void 0 : company.id.toString();
    const orders = yield orderRepository.companyAnalyticsOrders(companyId);
    const deliveredOrders = orders.filter((order) => order.orderStatus === 'DELIVERED' || order.orderStatus === 'RECEIVED');
    const companyCancelled = orders.filter((order) => order.orderStatus === 'COMPANY_CANCELLED');
    const pending = orders.filter((order) => order.orderStatus === 'PENDING');
    return {
        weeklyDeliveredOrdersPercentage: Math.round((deliveredOrders.length / orders.length) * 100),
        weeklyCompanyCancelledPercentage: Math.round((companyCancelled.length / orders.length) * 100),
        weeklyPendingPercentage: Math.round((pending.length / orders.length) * 100),
    };
});
function orderByWeek(orderdata) {
    try {
        const end = new Date();
        end.setUTCHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const gte = start;
        const lte = end;
        // Group booking data by week
        const weeklyOrder = orderdata === null || orderdata === void 0 ? void 0 : orderdata.reduce((acc, data) => {
            const day = data === null || data === void 0 ? void 0 : data.createdAt.getUTCDate();
            const month = (data === null || data === void 0 ? void 0 : data.createdAt.getUTCMonth()) + 1;
            const year = data === null || data === void 0 ? void 0 : data.createdAt.getUTCFullYear();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;
            const dayName = (0, helpers_2.getDayName)(formattedDate);
            if (!acc[formattedDate]) {
                acc[formattedDate] = {
                    day: dayName,
                    count: 0,
                };
            }
            acc[formattedDate].count += 1;
            return acc;
        }, {});
        // Populate missing days in the current week
        let from = new Date(gte);
        const missingDates = {};
        while (from <= lte) {
            const dateStr = from.toISOString().split('T')[0];
            if (!weeklyOrder[dateStr]) {
                const dayName = (0, helpers_2.getDayName)(dateStr);
                missingDates[dateStr] = { day: dayName, count: 0 };
            }
            from.setDate(from.getDate() + 1);
        }
        // Merge weekly bookings and missing dates
        const processedData = Object.assign(Object.assign({}, weeklyOrder), missingDates);
        const sortedData = Object.keys(processedData)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((key) => ({
            x: processedData[key].day,
            y: Number(processedData[key].count),
        }));
        return { data: sortedData };
    }
    catch (error) {
        return [];
    }
}
function incomeByWeek(orderdata) {
    try {
        const end = new Date();
        end.setUTCHours(0, 0, 0, 0);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const gte = start;
        const lte = end;
        // Group booking data by week
        const weeklyOrder = orderdata === null || orderdata === void 0 ? void 0 : orderdata.reduce((acc, data) => {
            const day = data === null || data === void 0 ? void 0 : data.createdAt.getUTCDate();
            const month = (data === null || data === void 0 ? void 0 : data.createdAt.getUTCMonth()) + 1;
            const year = data === null || data === void 0 ? void 0 : data.createdAt.getUTCFullYear();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;
            const dayName = (0, helpers_2.getDayName)(formattedDate);
            if (!acc[formattedDate]) {
                acc[formattedDate] = {
                    day: dayName,
                    income: 0,
                };
            }
            acc[formattedDate].income += data === null || data === void 0 ? void 0 : data.finalPrice;
            return acc;
        }, {});
        // Populate missing days in the current week
        let from = new Date(gte);
        const missingDates = {};
        while (from <= lte) {
            const dateStr = from.toISOString().split('T')[0];
            if (!weeklyOrder[dateStr]) {
                const dayName = (0, helpers_2.getDayName)(dateStr);
                missingDates[dateStr] = { day: dayName, income: 0 };
            }
            from.setDate(from.getDate() + 1);
        }
        // Merge weekly bookings and missing dates
        const processedData = Object.assign(Object.assign({}, weeklyOrder), missingDates);
        const sortedData = Object.keys(processedData)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((key) => ({
            x: processedData[key].day,
            y: Number(processedData[key].income),
        }));
        return { data: sortedData };
    }
    catch (error) {
        return [];
    }
}
exports.default = {
    createCompanyDetails,
    getCompanyDetails,
    allOrders,
    singleOrder,
    updateOrder,
    OrderAnalytics,
    IncomeAnalytics,
    pieChart,
    updateCompanyDetails,
    updateOrderPaymentStatus
};
