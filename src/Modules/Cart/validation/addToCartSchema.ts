import { z } from 'zod';
import { baseStringSchema } from './common';

export const addToCartSchema = z
    .object({
        shopId: baseStringSchema,
        productId: baseStringSchema,
    })
    .strict();
