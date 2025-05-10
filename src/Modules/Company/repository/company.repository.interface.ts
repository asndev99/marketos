import { ICompany } from '../interface';
import { ICompanyDocument } from '../company.model';
import { FilterQuery } from 'mongoose';

export interface ICompanyRepository {
    create(data: Partial<ICompany>): Promise<ICompany>;
    findOne(payload: FilterQuery<ICompanyDocument>): Promise<ICompanyDocument | null>;
}
