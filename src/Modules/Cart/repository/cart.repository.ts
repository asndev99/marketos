import { FilterQuery } from 'mongoose';
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
    }): Promise<ICartDocument> {
        const { productId, userId, shopId } = payload;

        const existingItem = await this.findOne({ shopId, productId, userId });

        if (existingItem) {
            const updated = await this.findOneAndUpdate(
                { _id: existingItem._id },
                { qty: existingItem.qty + 1 }
            );
            if (!updated) {
                throw new Error('Failed to update cart item');
            }
            return updated;
        }

        return this.create({ userId, productId, shopId, qty: 1 } as any);
    }

    async findOne(
        payload: FilterQuery<ICartDocument>,
        exclude: Record<string, 0 | 1> = {}
    ): Promise<ICartDocument | null> {
        return CartModel.findOne(payload).select(exclude);
    }

    async findOneAndDelete(options: FilterQuery<ICartDocument>): Promise<ICartDocument | null> {
        return CartModel.findOneAndDelete(options);
    }

    async findOneAndUpdate(
        whereOptions: FilterQuery<ICartDocument>,
        updateOptions: Partial<ICartDocument>
    ): Promise<ICartDocument | null> {
        return CartModel.findOneAndUpdate(whereOptions, updateOptions, { new: true });
    }

    async RemoveItemFromCart(options: {
        productId: string;
        cartId: string;
        shopId: string;
    }): Promise<ICartDocument | null> {
        const existingItem = await this.findOne({
            _id: options.cartId,
            productId: options.productId,
            shopId: options.shopId,
        });

        if (!existingItem) return null;

        const newQty = existingItem.qty - 1;

        if (newQty <= 0) {
            return this.findOneAndDelete({ _id: existingItem._id });
        } else {
            return this.findOneAndUpdate({ _id: existingItem._id }, { qty: newQty });
        }
    }
}
