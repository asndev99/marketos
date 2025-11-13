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
    category: {
        type: String,
        required: true,
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
        default: null,
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
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    NIC: {
        type: String,
        required: true,
        unique: true,
    },
    ntn: {
        type: String,
        required: false,
        default: null,
    },
    shopImage: {
        type: String,
        required: false,
        default: null,
    },
});
shopSchema.index({ location: '2dsphere' });
export const ShopModel = mongoose.model<IShopDocument>('Shop', shopSchema);
