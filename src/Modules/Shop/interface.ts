import { Types } from 'mongoose';

export interface IShop {
    userId: Types.ObjectId;
    category: string;
    ownerName: string;
    shopName: string;
    shopNumber?: string;
    mobileNumber: string;
    shopAddress: string;
    landMark?: string;
    shopImage?: string | null;
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
    shopNumber: string,
    shopAddress: string;
    landmark: string;
    latitude: number;
    longitude: number;
    NIC: string;
    ntn?: string;
}
