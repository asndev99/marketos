export enum UserRole {
    ADMIN = 'ADMIN',
    COMPANY = 'COMPANY',
    RIDER = 'RIDER',
    SHOPKEEPER = 'SHOPKEEPER',
    BOOKKEEPER = 'BOOKKEEPER',
}

export interface JwtVerifiedPayload {
    id: string;
    role: UserRole;
}

//for valdiation purpose
export const roles = ['ADMIN', 'COMPANY', 'RIDER', 'SHOPKEEPER', 'BOOKKEEPER'] as const;
