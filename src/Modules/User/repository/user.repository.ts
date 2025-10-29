import { IUserDocument, UserModel } from '../user.model';
import { IUserRepository } from './user.repository.interface';
import { FilterQuery } from 'mongoose';
import { ProductModel } from '../../Product/product.model';
import { CompanyModel } from '../../Company/company.model';

export class MongoUserRepository implements IUserRepository {
    async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
        return UserModel.create(data);
    }

    async findByUsername(username: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ username, isDeleted: false });
    }

    async findById(id: string): Promise<IUserDocument | null> {
        return UserModel.findById(id);
    }

    async findOne(
        payload: FilterQuery<IUserDocument>,
        exclude: Record<string, 0 | 1> = {}
    ): Promise<IUserDocument | null> {
        return UserModel.findOne(payload).select(exclude);
    }

    async findByIdAndUpdate(
        id: string,
        data: FilterQuery<IUserDocument>
    ): Promise<IUserDocument | null> {
        return UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    async deleteUser(id: string, userType: string): Promise<Boolean> {
        await UserModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            {
                new: true,
                runValidators: true,
            }
        );
        if (userType === 'COMPANY') {
            const company = await CompanyModel.findOneAndUpdate(
                { userId: id },
                { isDeleted: true },
                {
                    new: true,
                    runValidators: true,
                }
            );
            await ProductModel.findOneAndUpdate(
                { companyId: company?._id },
                { isDeleted: true },
                {
                    new: true,
                    runValidators: true,
                }
            );
        }

        return true;
    }
}
