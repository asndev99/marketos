import { Types } from 'mongoose';
import { PaymentStatus, PaymentMethod, OrderStatus } from '../../Common/constants';

export interface IPaymentTransaction {
    orderProductId: Types.ObjectId;
    companyId: Types.ObjectId;
    amount: number;
    paymentStatus?: PaymentStatus;
}

export interface IOrderProduct {
    orderId: Types.ObjectId;
    productId: Types.ObjectId;
    companyId: Types.ObjectId;
    quantity?: number;
    price: number;
    orderTimeUnitProductPrice: number;
    isOrderPlaced?: boolean;
    orderStatus?: OrderStatus;
    PaymentMethod?: PaymentMethod;
    cancelReason?: string;
}

export interface IUserOrder {
    orderTime: Date;
    orderTimeEpoch: number;
    totalPrice: number;
    trackingNumber: string;
    orderID: string;
    userId: Types.ObjectId;
}

export interface IPaymentTransactionPopulated extends IPaymentTransaction {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IOrderProductPopulatedDocument extends IOrderProduct {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    paymentTransaction: IPaymentTransactionPopulated;
}
export interface IUserOrderPopulatedDocument extends IUserOrder {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    orderProducts: IOrderProductPopulatedDocument[];
}
