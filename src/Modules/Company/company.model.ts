import mongoose, { Document, Schema } from 'mongoose';
import { ICompany } from './interface';
export interface ICompanyDocument extends ICompany, Document {}

const companySchema: Schema<ICompanyDocument> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        establishedDate: {
            type: String,
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
        warehouseAddress: {
            type: String,
            required: false,
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
        profileLogo: {
            type: String,
            required: true,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
        popularityRate: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);
export const CompanyModel = mongoose.model<ICompanyDocument>('Company', companySchema);
