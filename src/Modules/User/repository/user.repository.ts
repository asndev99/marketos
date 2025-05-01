import { IUser } from "../interface";
import { UserModel } from "../user.model";
import { IUserRepository } from "./user.repository.interface";

export class MongoUserRepository implements IUserRepository {
  async create(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }
}
