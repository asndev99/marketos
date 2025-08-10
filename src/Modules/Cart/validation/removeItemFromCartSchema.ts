import { z } from 'zod';
import { baseStringSchema } from './common';

export const removeItemFromCart = z.object({
    shopId: baseStringSchema,
    cartId: baseStringSchema,
    productId: baseStringSchema,
});
