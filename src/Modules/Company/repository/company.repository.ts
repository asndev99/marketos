import { paginationMeta } from '../../../Common/Interface';
import { ICompanyDocument, CompanyModel } from '../company.model';
import { FindManyOptions, ICompanyRepository } from './company.repository.interface';
import { FilterQuery } from 'mongoose';

export class MongoCompanyRepository implements ICompanyRepository {
    async create(data: Partial<ICompanyDocument>): Promise<ICompanyDocument> {
        return CompanyModel.create(data);
    }
    async update(id: string, data: Partial<ICompanyDocument>): Promise<ICompanyDocument | null> {
        return CompanyModel.findByIdAndUpdate(id, { ...data });
    }
    async findOne(
        payload: FilterQuery<ICompanyDocument>,
        exclude: Record<string, 0 | 1> = {}
    ): Promise<ICompanyDocument | null> {
        return CompanyModel.findOne(payload).select(exclude);
    }

    async findMany(payload: FindManyOptions): Promise<{
        data: ICompanyDocument[];
        meta: paginationMeta;
    }> {
        const {
            filter = {},
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = payload;

        const skip = (page - 1) * limit;
        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [data, total] = await Promise.all([
            CompanyModel.find(filter).skip(skip).limit(limit).sort(sort),
            CompanyModel.countDocuments(filter),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
