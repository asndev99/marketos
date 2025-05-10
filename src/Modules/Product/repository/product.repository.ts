import { IProductDocument, ProductModel } from '../product.model';
import { IProductImageDocument, ProductImageModel } from '../productImage.model';
import { IProductRepository } from './product.repository.interface';
import { FilterQuery, Types } from 'mongoose';
type NewProductImage = {
    image: string;
    productId: Types.ObjectId;
};
export class MongoProductRepository implements IProductRepository {
    async create(data: Partial<IProductDocument>): Promise<IProductDocument> {
        return ProductModel.create(data);
    }
    async findOne(
        payload: FilterQuery<IProductDocument>,
        exclude: Record<string, 0 | 1> = {}
    ): Promise<IProductDocument | null> {
        return ProductModel.findOne(payload).select(exclude);
    }
    async createImage(data: NewProductImage[]): Promise<IProductImageDocument[]> {
        return ProductImageModel.insertMany(data);
    }
    async findAll(payload: FilterQuery<IProductDocument>): Promise<IProductDocument[]> {
        return ProductModel.find({ isDeleted: false, ...payload })
            .populate('images')
            .exec();
    }
    async findOneProduct(payload: FilterQuery<IProductDocument>): Promise<IProductDocument | null> {
        return ProductModel.findOne({ isDeleted: false, ...payload })
            .populate('images')
            .exec();
    }
    async deleteProductImages(payload: { _id: Types.ObjectId }[]): Promise<Object> {
        const ids = payload.map((p) => p._id);
        return await ProductImageModel.deleteMany({ _id: { $in: ids } });
    }
    async updateProduct(id: Types.ObjectId, data: Partial<IProductDocument>): Promise<Object> {
        return await ProductModel.updateOne({ _id: id }, { $set: data });
    }
    async deleteProduct(id: Types.ObjectId): Promise<Boolean> {
        await ProductModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
        await ProductImageModel.updateMany({ productId: id }, { $set: { isDelete: true } });
        return true;
    }
}
