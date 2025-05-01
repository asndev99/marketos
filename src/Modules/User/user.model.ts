import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./interface";
import { UserRole } from "../../Common/constants";

export interface IUserModel extends Document, IUser {}

const userSchema: Schema<IUserModel> = new Schema({
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
});

export const UserModel = mongoose.model<IUserModel>("User", userSchema);
