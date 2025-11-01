import { FilterQuery, PopulateOptions, ClientSession, QueryOptions } from 'mongoose';
import { CartModel, ICartDocument } from '../cart.model';
import { ICartRepository } from './interface';

export class MongoCartRepository implements ICartRepository {
    async create(payload: FilterQuery<ICartDocument>): Promise<ICartDocument> {
        return CartModel.create(payload);
    }

    async addToCart(payload: {
        userId: string;
        productId: string;
        shopId: string;
        quantity: number;
    }): Promise<ICartDocument | null> {
        // const { productId, userId, shopId, quantity } = payload;

        // const existingItem = await this.findOne({ shopId, productId, userId });

        // if (existingItem && quantity == 0) {
        //     await this.RemoveProductFromCart({
        //         productId,
        //         userId,
        //     });
        //     return null;
        // }

        // if (existingItem) {
        //     const updated = await this.findOneAndUpdate(
        //         { _id: existingItem._id },
        //         { qty: quantity }
        //     );
        //     if (!updated) {
        //         throw new Error('Failed to update cart item');
        //     }
        //     const updatedItem = await this.findOne({ shopId, productId, userId }, {}, [
        //         {
        //             path: 'productId',
        //             select: 'name price discountedPrice status companyId stockQuantity',
        //             populate: {
        //                 path: 'images',
        //                 select: 'image',
        //             },
        //         },
        //     ]);
        //     return updatedItem;
        // }

        // const newCreated = await this.create({ userId, productId, shopId, qty: quantity } as any);
        // const createdItem = await this.findOne({ _id: newCreated?._id }, {}, [
        //     {
        //         path: 'productId',
        //         select: 'name price discountedPrice status companyId stockQuantity',
        //         populate: {
        //             path: 'images',
        //             select: 'image',
        //         },
        //     },
        // ]);
        // return createdItem;

        const { userId, productId, shopId, quantity } = payload;

        // 🧹 If quantity = 0, remove the item if it exists
        if (quantity === 0) {
            await this.RemoveProductFromCart({ productId, userId });
            return null;
        }

        const updatedOrCreatedItem = await this.findOneAndUpdate(
            { userId, productId, shopId },
            {
                $set: { qty: quantity },
                $setOnInsert: { userId, productId, shopId },
            },
            { new: true, upsert: true }
        ).populate({
            path: 'productId',
            select: 'name price discountedPrice status companyId stockQuantity',
            populate: { path: 'images', select: 'image' },
        }).lean() as ICartDocument | null;

        return updatedOrCreatedItem;
    }

    async findOne(
        payload: FilterQuery<ICartDocument>,
        exclude: Record<string, 0 | 1> = {},
        populate?: string | string[] | PopulateOptions | PopulateOptions[]
    ): Promise<ICartDocument | null> {
        let query = CartModel.findOne(payload).select(exclude);

        if (populate) {
            query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
        }

        return query;
    }
    /**
     * Finds multiple Cart documents based on the provided filter query.
     *
     * @param {FilterQuery<ICartDocument>} payload - MongoDB query object to filter documents.
     * @param {Record<string, 0 | 1>} [exclude={}] - Fields to exclude (0) or include (1) from the result set.
     * @param {string | string[] | PopulateOptions | PopulateOptions[]} [populate] - Fields or references to populate.
     *
     * @returns {Promise<ICartDocument[]>} - A promise that resolves to an array of cart documents.
     *
     * @example
     * // Example 1: Simple find with field exclusion
     * await findMany({ userId: "123" }, { __v: 0 });
     *
     * @example
     * // Example 2: With populate string
     * await findMany({ userId: "123" }, {}, "product");
     *
     * @example
     * // Example 3: With populate options
     * await findMany({ userId: "123" }, {}, { path: "product", select: "title price" });
     *
     * @example
     * // Example 4: With multiple populate fields
     * await findMany({ userId: "123" }, {}, [
     *   { path: "product", select: "title" },
     *   { path: "user", select: "name email" }
     * ]);
     */
    // Mongoose populate() Method Accepts Multiple Types
    async findMany(
        payload: FilterQuery<ICartDocument>,
        exclude: Record<string, 0 | 1> = {},
        populate?: string | string[] | PopulateOptions | PopulateOptions[]
    ): Promise<ICartDocument[]> {
        let query = CartModel.find(payload).select(exclude);

        if (populate) {
            query = query.populate(populate as PopulateOptions | (string | PopulateOptions)[]);
        }

        return query;
    }

    async findOneAndDelete(options: FilterQuery<ICartDocument>): Promise<ICartDocument | null> {
        return CartModel.findOneAndDelete(options);
    }

    // async findOneAndUpdate(
    //     whereOptions: FilterQuery<ICartDocument>,
    //     updateOptions: Partial<ICartDocument>
    // ): Promise<ICartDocument | null> {
    //     return CartModel.findOneAndUpdate(whereOptions, updateOptions, { new: true });
    // }

    findOneAndUpdate(
        whereOptions: FilterQuery<ICartDocument>,
        updateOptions: Partial<ICartDocument> | any,
        options: QueryOptions = {}
    ) {
        return CartModel.findOneAndUpdate(whereOptions, updateOptions, {
            new: true,
            ...options,
        });
    }

    async RemoveProductFromCart(options: {
        productId: string;
        userId: string;
    }): Promise<ICartDocument | null> {
        const existingItem = await this.findOne({
            productId: options.productId,
            userId: options.userId,
        });

        if (!existingItem) return null;
        else return this.findOneAndDelete({ _id: existingItem._id });
    }
}
