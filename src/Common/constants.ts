export enum UserRole {
    ADMIN = 'ADMIN',
    COMPANY = 'COMPANY',
    RIDER = 'RIDER',
    SHOPKEEPER = 'SHOPKEEPER',
    BOOKKEEPER = 'BOOKKEEPER',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    Received = 'Received'
}

export enum PaymentMethod {
    CASH = 'CASH',
    CREDIT = 'CREDIT'
}
export enum OrderStatus {
    NEW = 'NEW',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export interface JwtVerifiedPayload {
    id: string;
    role: UserRole;
}

export const companiesCategories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Paintry Staples',
    'Beverages',
    'Snacks & Confactionery',
    'Frozen Foods',
    'Canned & Jarred Goods',
    'Pasta,Rice & Grains',
    'Condiments & Spices',
    'Breakfast Items',
    'Health & Organic Foods',
    'Baby Products',
    'Pet Supplies',
];

//for valdiation purpose
export const roles = ['ADMIN', 'COMPANY', 'RIDER', 'SHOPKEEPER', 'BOOKKEEPER'] as const;
