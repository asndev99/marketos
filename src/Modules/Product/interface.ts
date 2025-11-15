import { Types } from 'mongoose';
export interface IProduct {
    companyId: Types.ObjectId;
    name: String;
    description: String;
    category: String;
    sku: String;
    price: number;
    currency: String;
    barcode: String;
    discountedPrice: number;
    stockQuantity: number;
    status: String;
    isDeleted: Boolean;
    isBlocked:Boolean;
}
export interface IProductImage {
    isDelete: Boolean;
    productId: Types.ObjectId;
    image: string;
}

export interface IProductPopulatedDocument extends IProduct {
    _id: Types.ObjectId;
    images: IProductImage[];
}
