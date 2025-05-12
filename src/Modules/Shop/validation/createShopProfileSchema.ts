import { z } from 'zod';
import { baseStringSchema, passwordSchema } from '../../Auth/validation/common';
import { mobileNumberSchema, nicSchema } from './common';

export const createShopProfileSchema = z
    .object({
        username: baseStringSchema,
        password: passwordSchema,
        ownerName: baseStringSchema,
        shopName: baseStringSchema,
        mobileNumber: mobileNumberSchema,
        shopAddress: baseStringSchema,
        landMark: baseStringSchema,
        longitude: z.coerce.number(),
        latitude: z.coerce.number(),
        NIC: nicSchema,
    })
    .strict();
