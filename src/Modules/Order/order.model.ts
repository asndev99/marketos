import mongoose, { Document, Schema, Types } from 'mongoose';
import {
    IUserOrder,
    IOrderProduct,
    IPaymentTransaction,
} from './interface';
import {PaymentStatus, PaymentMethod, OrderStatus} from "../../Common/constants";

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
        orderTimeUnitProductPrice: { type: Number, required: true },
        isOrderPlaced: { type: Boolean, default: false },
        orderStatus: { type: String, enum: OrderStatus, default: 'NEW' },
        PaymentMethod: {type: String, enum: PaymentMethod},
        cancelReason: { type: String, required: false },
    },
    { timestamps: true }
);

export interface IPaymentTransactionDocument extends Document, IPaymentTransaction {
    _id: Types.ObjectId;
}
const PaymentTransactionSchema: Schema<IPaymentTransactionDocument> = new Schema(
    {
        orderProductId: { type: Schema.Types.ObjectId, ref: 'OrderProduct', required: true },
        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
        amount: { type: Number, required: true },
        paymentStatus: { type: String, enum: PaymentStatus, default: 'NEW' },
    },
    { timestamps: true }
);

// productSchema.virtual('images', {
//     ref: 'ProductImage',
//     localField: '_id',
//     foreignField: 'productId',
// });

// productSchema.set('toObject', { virtuals: true });
// productSchema.set('toJSON', { virtuals: true });

UserOrderSchema.virtual('orderProducts', {
    ref: 'OrderProduct',
    localField: '_id',
    foreignField: 'orderId'
})

OrderProductSchema.virtual('paymentTransaction', {
  ref: 'PaymentTransaction',
  localField: '_id',
  foreignField: 'orderProductId',
  justOne: true,
});
UserOrderSchema.set('toObject', {virtuals: true});
UserOrderSchema.set('toJSON', {virtuals: true});

OrderProductSchema.set('toObject', {virtuals: true});
OrderProductSchema.set('toJSON', {virtuals: true});

export const UserOrderModel = mongoose.model<IUserOrderDocument>('UserOrder', UserOrderSchema);
export const OrderProductModel = mongoose.model<IOrderProductDocument>(
    'OrderProduct',
    OrderProductSchema
);
export const PaymentTransactionModel = mongoose.model<IPaymentTransactionDocument>(
    'PaymentTransaction',
    PaymentTransactionSchema
);
