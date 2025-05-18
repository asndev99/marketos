import { Types } from 'mongoose';

export interface ICart {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    qty: number;
    shopId: Types.ObjectId;
}

export interface CartItem {
    qty: number;
    price: number;
    discountedPrice?: number;
    productId: string;
}

export interface CartItemDto {
    qty: number;
    price: number;
    total: number;
    productId: string;
}
