import { Types } from 'mongoose';

export interface IShop {
    userId: Types.ObjectId;
    ownerName: string;
    shopName: string;
    shopNumber?: string;
    mobileNumber: string;
    shopAddress: string;
    landMark: string;
    longitude: Number;
    latitude: Number;
    NIC: string;
}
