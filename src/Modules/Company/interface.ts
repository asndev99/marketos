import { Types } from 'mongoose';
export interface ICompany {
    userId: Types.ObjectId;
    companyName: String;
    establishedDate: String;
    websiteLink: String;
    category: String;
    state: String;
    city: String;
    address: String;
    warehouseAddress: String;
    NTN: String;
    saleTaxNum: String;
    contactPersonName: String;
    contactNumber: String;
    contactEmail: string;
    alternativeNumber: String;
    numOfDistribution: Number;
    profileLogo: String;
    coverPhoto: String;
    isPopular: Boolean;
    popularityRate: Number;
}
