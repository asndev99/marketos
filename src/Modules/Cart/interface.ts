import { Types } from 'mongoose';

export interface ICart {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    qty: number;
    shopId: Types.ObjectId;
}
