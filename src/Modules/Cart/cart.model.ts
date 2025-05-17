import mongoose, { Schema, Types } from 'mongoose';
import { ICart } from './interface';

export interface ICartDocument extends ICart, Document {
    _id: Types.ObjectId;
}

const cartSchema: Schema<ICartDocument> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    qty: {
        type: Number,
        required: true,
    },
});

export const CartModel = mongoose.model<ICartDocument>('Cart', cartSchema);
