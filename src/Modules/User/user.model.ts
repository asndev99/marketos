import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./interface";
import { UserRole } from "../../Common/constants";

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const userSchema: Schema<IUserDocument> = new Schema({
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
  isNotificationsEnabled: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
