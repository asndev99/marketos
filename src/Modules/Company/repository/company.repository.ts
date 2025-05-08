import { ICompanyDocument, CompanyModel } from "../company.model";
import { ICompanyRepository } from "./company.repository.interface";
import { FilterQuery } from "mongoose";

export class MongoCompanyRepository implements ICompanyRepository {
  async create(data: Partial<ICompanyDocument>): Promise<ICompanyDocument> {
    return CompanyModel.create(data);
  }
  async findOne(
    payload: FilterQuery<ICompanyDocument>,
    exclude: Record<string, 0 | 1> = {}
  ): Promise<ICompanyDocument | null> {
    return CompanyModel.findOne(payload).select(exclude);
  }
}
