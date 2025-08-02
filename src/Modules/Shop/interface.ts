import { Types } from 'mongoose';

export interface IShop {
    userId: Types.ObjectId;
    ownerName: string;
    shopName: string;
    shopNumber?: string;
    mobileNumber: string;
    shopAddress: string;
    landMark?: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    NIC: string;
    ntn?: string;
}
export interface CreateShopPayload {
    ownerName: string;
    shopName: string;
    mobileNumber: string;
    shopAddress: string;
    landmark: string;
    latitude: number;
    longitude: number;
    NIC: string;
    ntn?: string;
}
