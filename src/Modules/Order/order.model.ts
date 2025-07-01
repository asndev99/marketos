import mongoose, { Document, Schema, Types } from 'mongoose';
import {
    IUserOrder,
    IOrderProduct,
    IOrderProductStatusHistory,
    IPaymentTransaction,
} from './interface';
const OrderStatusEnum = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']; // customize as needed
const PaymentStatusEnum = ['PENDING', 'PAID', 'FAILED'];
const TransactionStatusEnum = ['PENDING', 'COMPLETED', 'REFUNDED'];

export interface IUserOrderDocument extends Document, IUserOrder {
    _id: Types.ObjectId;
}
const UserOrderSchema: Schema<IUserOrderDocument> = new Schema(
    {
        orderTime: { type: Date, required: true },
        orderTimeEpoch: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        trackingNumber: { type: String, required: true },
        orderID: { type: String, required: true },
        paymentStatus: { type: String, enum: PaymentStatusEnum, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export interface IOrderProductDocument extends Document, IOrderProduct {
    _id: Types.ObjectId;
}
const OrderProductSchema: Schema<IOrderProductDocument> = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: 'UserOrder', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        orderTimePrice: { type: Number, required: true },
        isOrderPlaced: { type: Boolean, default: false },
        orderStatus: { type: String, enum: OrderStatusEnum, default: 'NEW' },
        cancelReason: { type: String, required: false },
    },
    { timestamps: true }
);

export interface IOrderProductStatusHistoryDocumemnt extends Document, IOrderProductStatusHistory {
    _id: Types.ObjectId;
}
const OrderProductStatusHistorySchema: Schema<IOrderProductStatusHistoryDocumemnt> = new Schema({
    orderProductId: { type: Schema.Types.ObjectId, ref: 'OrderProduct', required: true },
    status: { type: String, enum: OrderStatusEnum, required: true },
    changedAt: { type: Date, required: true },
});

export interface IPaymentTransactionDocument extends Document, IPaymentTransaction {
    _id: Types.ObjectId;
}
const PaymentTransactionSchema: Schema<IPaymentTransactionDocument> = new Schema(
    {
        orderProductId: { type: Schema.Types.ObjectId, ref: 'OrderProduct', required: true },
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
        amount: { type: Number, required: true },
        paymentStatus: { type: String, enum: TransactionStatusEnum, default: 'NEW' },
    },
    { timestamps: true }
);

export const UserOrderModel = mongoose.model<IUserOrderDocument>('UserOrder', UserOrderSchema);
export const OrderProductModel = mongoose.model<IOrderProductDocument>(
    'OrderProduct',
    OrderProductSchema
);
export const OrderProductStatusHistoryModel = mongoose.model<IOrderProductStatusHistoryDocumemnt>(
    'OrderProductStatusHistory',
    OrderProductStatusHistorySchema
);
export const PaymentTransactionModel = mongoose.model<IPaymentTransactionDocument>(
    'PaymentTransaction',
    PaymentTransactionSchema
);
