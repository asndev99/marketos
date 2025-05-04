import { IUserDocument, UserModel } from "../user.model";
import { IUserRepository } from "./user.repository.interface";
import { FilterQuery } from "mongoose";

export class MongoUserRepository implements IUserRepository {
  async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ username });
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
}
