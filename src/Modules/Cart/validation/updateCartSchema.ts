import { z } from 'zod';
import { baseStringSchema } from './common';

export const updateCartSchema = z
    .object({
        operation: z.enum(['increement', 'decreement']),
        cartId: baseStringSchema,
        qty: z.coerce.number(),
    })
    .strict();
