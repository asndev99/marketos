import mongoose, { Document, Schema } from 'mongoose';
import { IShop } from './interface';

export interface IShopDocument extends IShop, Document {}

const shopSchema: Schema<IShopDocument> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    shopNumber: {
        type: String,
        required: false,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    shopAddress: {
        type: String,
        required: true,
    },
    landMark: {
        type: String,
        required: false,
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    NIC: {
        type: String,
        required: true,
        unique: true,
    },
});

export const ShopModel = mongoose.model<IShopDocument>('Shop', shopSchema);
