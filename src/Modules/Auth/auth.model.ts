import mongoose, { Document, Schema } from "mongoose";

// Interface
export interface ISession extends Document {
  userId: string;
  accessToken: string;
  deviceType?: string;
  refreshToken?: string;
  fcmToken?: string;
}

const sessionSchema: Schema<ISession> = new Schema(
  {
    userId: {
      type: String,
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
