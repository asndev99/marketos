import { ICompany } from '../interface';
import { ICompanyDocument } from '../company.model';
import { FilterQuery } from 'mongoose';
import { paginationMeta } from '../../../Common/Interface';

export interface FindManyOptions {
    filter?: FilterQuery<ICompanyDocument>;
    page?: number;
    limit?: number;
    sortBy?: keyof ICompanyDocument;
    sortOrder?: 'asc' | 'desc';
}
export interface ICompanyRepository {
    create(data: Partial<ICompany>): Promise<ICompany>;
    findOne(payload: FilterQuery<ICompanyDocument>): Promise<ICompanyDocument | null>;
    findMany(payload: FindManyOptions): Promise<{
        data: ICompanyDocument[];
        meta: paginationMeta;
    }>;
}
