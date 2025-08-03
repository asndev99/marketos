import { z } from 'zod';
import { baseStringSchema, passwordSchema } from './common';

export const createShopSchema = z
    .object({
        username: baseStringSchema,
        password: passwordSchema,
    })
    .strict();
