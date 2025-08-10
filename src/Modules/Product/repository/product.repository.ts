import { paginationMeta } from '../../../Common/Interface';
import { IProductPopulatedDocument } from '../interface';
import { IProductDocument, ProductModel } from '../product.model';
import { IProductImageDocument, ProductImageModel } from '../productImage.model';
import { FindManyOptions, IProductRepository } from './product.repository.interface';
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
    async findOneProduct(
        payload: FilterQuery<IProductDocument>
    ): Promise<IProductPopulatedDocument | null> {
        return ProductModel.findOne({ isDeleted: false, ...payload })
            .populate('images')
            .exec() as Promise<IProductPopulatedDocument | null>;
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

    async FindMany(
        payload: FindManyOptions
    ): Promise<{ data: IProductDocument[]; meta: paginationMeta }> {
        const {
            filter = {},
            sortBy = 'createdAt',
            sortOrder = 'desc',
            limit = 10,
            page = 1,
        } = payload;

        const skip = (page - 1) * limit;
        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };
        const [products, count] = await Promise.all([
            ProductModel.find(filter).populate({ path: "images" }).skip(skip).sort(sort).lean(),
            ProductModel.countDocuments(filter),
        ]);

        return {
            data: products,
            meta: {
                limit,
                page,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
}
