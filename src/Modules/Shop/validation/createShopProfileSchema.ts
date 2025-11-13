import { z } from 'zod';
import { baseStringSchema, passwordSchema } from '../../Auth/validation/common';
import { mobileNumberSchema, nicSchema } from './common';

export const createShopProfileSchema = z
    .object({
        ownerName: baseStringSchema,
        shopName: baseStringSchema,
        shopNumber:baseStringSchema,
        mobileNumber: mobileNumberSchema,
        shopAddress: baseStringSchema,
        landMark: baseStringSchema,
        longitude: z.coerce.number(),
        latitude: z.coerce.number(),
        NIC: nicSchema,
        ntn: baseStringSchema.nullable().optional(),
        category: z.enum(["MART", "BAKERY", "RESTAURANT", "CAFE", "GENERAL_STORE", "DISTRIBUTOR"])
    })
    .strict();
