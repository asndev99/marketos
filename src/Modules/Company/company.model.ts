import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./interface";
export interface ICompanyModel extends Document, ICompany {}

const companySchema: Schema<ICompanyModel> = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    establishedDate: {
      type: Date,
      required: true,
    },
    websiteLink: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    NTN: {
      type: String,
      required: false,
    },
    saleTaxNum: {
      type: String,
      required: false,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    alternativeNumber: {
      type: String,
      required: true,
    },
    numOfDistribution: {
      type: Number,
      required: true,
    },
    profileLogo: {
      type: String,
      required: false,
    },
    coverPhoto: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
export const companyModel = mongoose.model<ICompanyModel>(
  "Company",
  companySchema
);
