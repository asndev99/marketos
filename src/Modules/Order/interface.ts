import { Types } from 'mongoose';
export interface IUserOrder {
    orderTime: Date;
    orderTimeEpoch: number;
    totalPrice: number;
    trackingNumber: string;
    orderID: string;
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    userId: Types.ObjectId;
}

export interface IOrderProduct {
    orderId: Types.ObjectId;
    productId: Types.ObjectId;
    companyId: Types.ObjectId;
    quantity?: number;
    price: number;
    orderTimePrice: number;
    isOrderPlaced?: boolean;
    orderStatus?: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    cancelReason?: string;
}

export interface IOrderProductStatusHistory {
    orderProductId: Types.ObjectId;
    status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    changedAt?: Date;
}

export interface IPaymentTransaction {
    orderProductId: Types.ObjectId;
    companyId: Types.ObjectId;
    amount: number;
    paymentStatus?: 'PENDING' | 'COMPLETED' | 'REFUNDED';
}
