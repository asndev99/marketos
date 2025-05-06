import mongoose, { Document, Schema, Types } from "mongoose";

// Interface
export interface ISession extends Document {
  userId: Types.ObjectId;
  accessToken: string;
  deviceType?: string;
  refreshToken?: string;
  fcmToken?: string;
}

const sessionSchema: Schema<ISession> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: false,
      default: "unknown",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model<ISession>("Session", sessionSchema);
