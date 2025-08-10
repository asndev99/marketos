import { FilterQuery } from 'mongoose';
import { IShopDocument } from '../shop.model';

export interface IShopRepository {
    createProfile(data: Partial<IShopDocument>): Promise<IShopDocument>;
    findOne(data: FilterQuery<IShopDocument>): Promise<IShopDocument | null>;
    findOneAndUpdate(where: FilterQuery<IShopDocument>, data: IShopDocument): Promise<IShopDocument | null>
}
