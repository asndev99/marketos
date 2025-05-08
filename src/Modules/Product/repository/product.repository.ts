import { IProductDocument, ProductModel } from "../product.model";
import { IProductImageDocument, ProductImageModel } from "../productImage.model";
import { IProduct } from "../interface";
import { ICompanyRepository } from "./product.repository.interface";
import { FilterQuery } from "mongoose";

export class MongoProductRepository implements ICompanyRepository {
  async create(data: Partial<IProductDocument>): Promise<IProductDocument> {
    return ProductModel.create(data);
  }
  async findOne(
    payload: FilterQuery<IProductDocument>,
    exclude: Record<string, 0 | 1> = {}
  ): Promise<IProductDocument | null> {
    return ProductModel.findOne(payload).select(exclude);
  }
  async createImage(data: IProductImageDocument[]): Promise<IProductImageDocument[]> {
    return ProductImageModel.insertMany(data);
  }  
}
