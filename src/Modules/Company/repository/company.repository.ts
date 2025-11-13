import { paginationMeta } from '../../../Common/Interface';
import { ICompanyDocument, CompanyModel } from '../company.model';
import { ProductModel } from '../../Product/product.model';
import { FindManyOptions, ICompanyRepository } from './company.repository.interface';
import { FilterQuery, ObjectId } from 'mongoose';

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

    async findMany(
        category: string | undefined,
        payload: FindManyOptions
    ): Promise<{
        data: ICompanyDocument[];
        meta: paginationMeta;
    }> {
        let {
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

        if (category !== undefined) {
            const companyIds = await this.distinctCompanies(category as string);
            filter = {
                ...filter,
                _id: { $in: companyIds },
            };
        }

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

    async distinctCompanies(mappedCategory: string): Promise<any[]> {
        const companyIds = await ProductModel.distinct('companyId', {
            category: mappedCategory,
            isDeleted: false,
        });
        return companyIds ?? null;
    }

    async findCompanyCategories(id: string): Promise<string[]> {
        const companyCategory = await this.findOne({ _id: id }, { category: 1 });
        const categories = companyCategory?.category ?? [];
        return this.distinctCompanyCategories(id, categories as string[]);
    }

    async distinctCompanyCategories(id: string, categories: string[]): Promise<string[]> {
        const existingCategories = await ProductModel.distinct('category', {
            companyId: id,
            isDeleted: false,
        });
        const filteredCategories = categories.filter((category) =>
            existingCategories.includes(category)
        );
        return filteredCategories;
    }
}
