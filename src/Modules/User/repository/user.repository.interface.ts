import { IUser } from "../interface";

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}
