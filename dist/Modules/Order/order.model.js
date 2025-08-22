"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionModel = exports.OrderProductModel = exports.UserOrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../../Common/constants");
const UserOrderSchema = new mongoose_1.Schema({
    orderTime: { type: Date, required: true },
    orderTimeEpoch: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    trackingNumber: { type: String, required: true },
    orderID: { type: String, required: true },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
const OrderProductSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UserOrder', required: true },
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    deliveredQuantity: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    orderTimeUnitProductPrice: { type: Number, required: true },
    isOrderPlaced: { type: Boolean, default: false },
    orderStatus: { type: String, enum: constants_1.OrderStatus, default: 'PENDING' },
    PaymentMethod: { type: String, enum: constants_1.PaymentMethod },
    cancelReason: { type: String, required: false },
}, { timestamps: true });
const PaymentTransactionSchema = new mongoose_1.Schema({
    orderProductId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'OrderProduct', required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: constants_1.PaymentStatus, default: 'NEW' },
}, { timestamps: true });
UserOrderSchema.virtual('orderProducts', {
    ref: 'OrderProduct',
    localField: '_id',
    foreignField: 'orderId'
});
OrderProductSchema.virtual('paymentTransaction', {
    ref: 'PaymentTransaction',
    localField: '_id',
    foreignField: 'orderProductId',
    justOne: true,
});
UserOrderSchema.set('toObject', { virtuals: true });
UserOrderSchema.set('toJSON', { virtuals: true });
OrderProductSchema.set('toObject', { virtuals: true });
OrderProductSchema.set('toJSON', { virtuals: true });
exports.UserOrderModel = mongoose_1.default.model('UserOrder', UserOrderSchema);
exports.OrderProductModel = mongoose_1.default.model('OrderProduct', OrderProductSchema);
exports.PaymentTransactionModel = mongoose_1.default.model('PaymentTransaction', PaymentTransactionSchema);
