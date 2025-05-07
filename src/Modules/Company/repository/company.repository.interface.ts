import { ICompany } from "../interface";
import { ICompanyDocument } from "../company.model";

export interface ICompanyRepository {
    create(data: Partial<ICompany>): Promise<ICompany>;
}