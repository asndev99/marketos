import mongoose, { Document, Schema } from "mongoose";
import { IProductImage } from "./interface";
export interface IProductImageDocument extends Document, IProductImage {}

const productSchema: Schema<IProductImageDocument> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    image: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        required: false
    }
  },
  {
    timestamps: true,
  }
);
export const ProductImageModel = mongoose.model<IProductImageDocument>(
  "ProductImage",
  productSchema
);