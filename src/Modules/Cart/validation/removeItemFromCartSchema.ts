import { z } from 'zod';
import { baseStringSchema } from './common';

export const removeItemFromCart = z.object({
    cartId: baseStringSchema,
    productId: baseStringSchema,
});
