import { IProduct, IProductImage } from "../interface";
import { IProductDocument } from "../product.model";
import { FilterQuery } from "mongoose";

export interface ICompanyRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    findOne(payload: FilterQuery<IProductDocument>): Promise<IProductDocument | null>;
    createImage(data: IProductImage[]): Promise<IProductImage[]>;
}