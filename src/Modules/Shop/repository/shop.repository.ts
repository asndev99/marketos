import { FilterQuery } from 'mongoose';
import { IShopDocument, ShopModel } from '../shop.model';
import { IShopRepository } from './shop.repository.interface';

export class ShopRepository implements IShopRepository {
    async createProfile(data: Partial<IShopDocument>): Promise<IShopDocument> {
        return ShopModel.create(data);
    }

    async findOne(data: FilterQuery<IShopDocument>): Promise<IShopDocument | null> {
        return ShopModel.findOne(data);
    }
}
