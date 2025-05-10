import { IProduct, IProductImage } from "../interface";
import { IProductDocument } from "../product.model";
import { FilterQuery, Types } from "mongoose";
type NewProductImage = {
  image: string;
  productId: Types.ObjectId;
};
type Images = {
    _id: Types.ObjectId
}
export interface ICompanyRepository {
    create(data: Partial<IProductDocument>): Promise<IProductDocument>;
    findOne(payload: FilterQuery<IProductDocument>): Promise<IProductDocument | null>;
    createImage(data: NewProductImage[]): Promise<IProductImage[]>;
    findAll(payload: FilterQuery<IProduct>): Promise<IProduct[]>;
    findOneProduct(payload: FilterQuery<IProductDocument>): Promise<IProductDocument | null>;
    deleteProductImages(payload: Images[]): Promise<Object>;
    updateProduct(id: Types.ObjectId, data: Partial<IProduct>): Promise<Object>;
    deleteProduct(id: Types.ObjectId): Promise<Boolean>;
}