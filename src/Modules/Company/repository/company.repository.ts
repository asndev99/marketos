import { ICompanyDocument, CompanyModel } from "../company.model";
import { ICompany } from "../interface";
import { ICompanyRepository } from "./company.repository.interface";

export class MongoCompanyRepository implements ICompanyRepository {
  async create(data: Partial<ICompanyDocument>): Promise<ICompanyDocument> {
    return CompanyModel.create(data);
  }
}
