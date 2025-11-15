import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './interface';
export interface IProductDocument extends Document, IProduct {}

const productSchema: Schema<IProductDocument> = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        sku: {
            type: String,
            required: false,
            default: null,
        },
        price: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        barcode: {
            type: String,
            required: false,
            default: null,
        },
        discountedPrice: {
            type: Number,
            required: false,
            default: null,
        },
        stockQuantity: {
            type: Number,
            required: false,
            default: null,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'DISCOUNTED'],
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.virtual('images', {
    ref: 'ProductImage',
    localField: '_id',
    foreignField: 'productId',
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

export const ProductModel = mongoose.model<IProductDocument>('Product', productSchema);
