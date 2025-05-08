import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./interface";
export interface IProductDocument extends Document, IProduct {}

const productSchema: Schema<IProductDocument> = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: false,
    },
    discountedPrice: {
      type: Number,
      required: false,
    },
    stockQuantity: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DISCOUNTED"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const ProductModel = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);