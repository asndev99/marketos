import mongoose from "mongoose";
import { MONGO_URI } from "./env.config";

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new BadRequestError("MONGO_URI NOT FOUND");
    }
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error: any) {
    throw new Error(error);
  }
};
