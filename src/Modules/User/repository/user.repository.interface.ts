import { IUser } from "../interface";
import { FilterQuery } from "mongoose";
import { IUserDocument } from "../user.model";

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findOne(payload: FilterQuery<IUserDocument>): Promise<IUserDocument | null>;
  deleteUser(id: string, userType: string): Promise<Boolean>;
  changePassword(payload: any): Promise<Boolean>;
}
