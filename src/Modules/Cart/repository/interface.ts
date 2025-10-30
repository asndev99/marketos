import { FilterQuery, PopulateOptions } from 'mongoose';
import { ICartDocument } from '../cart.model';

export interface ICartRepository {
    addToCart(payload: {
        userId: string;
        productId: string;
        shopId: string;
    }): Promise<ICartDocument | null>;

    create(payload: FilterQuery<ICartDocument>): Promise<ICartDocument>;

    findOne(
        payload: FilterQuery<ICartDocument>,
        exclude?: Record<string, 0 | 1>,
        populate?: string | string[] | PopulateOptions | PopulateOptions[]
    ): Promise<ICartDocument | null>;

    findOneAndDelete(options: FilterQuery<ICartDocument>): Promise<ICartDocument | null>;

    findOneAndUpdate(
        whereOptions: FilterQuery<ICartDocument>,
        updateOptions: Partial<ICartDocument>
    ): Promise<ICartDocument | null>;

    RemoveItemFromCart(options: {
        productId: string;
        cartId: string;
        shopId: string;
    }): Promise<ICartDocument | null>;

    findMany(
        payload: FilterQuery<ICartDocument>,
        exclude?: Record<string, 0 | 1>,
        populate?: string | string[] | PopulateOptions | PopulateOptions[]
    ): Promise<ICartDocument[] | []>;
}
