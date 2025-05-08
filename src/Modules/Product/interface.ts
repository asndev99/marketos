import {Types} from "mongoose";
export interface IProduct {
    companyId: Types.ObjectId,
    name: String,
    description: String,
    category: String,
    sku: String,
    price: Number,
    currency: String,
    barcode: String,
    discountedPrice: Number,
    stockQuantity: Number,
    status: String,
    images: string[]
}
export interface IProductImage {
    productId: Types.ObjectId,
    image: string
}