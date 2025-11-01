import { Types } from 'mongoose';
export interface ICompany {
    userId: Types.ObjectId;
    companyName: String;
    establishedDate: String;
    websiteLink: String;
    category: [String];
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
    profileLogo: String;
    isPopular: Boolean;
    popularityRate: Number;
    isDeleted: Boolean
}

export interface orderUpdateValidation {
    orderId: Types.ObjectId;
    quantity: number;
    status: string,
    price: number
}