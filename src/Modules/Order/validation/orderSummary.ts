import { z } from 'zod';
import { baseStringSchema } from './common';

const orderDetailSchema  = z
    .object({
        productId: baseStringSchema,
        quantity: z
            .number()
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than 0'),
    })
    .strict();
export const orderSummarySchema = z.object({
    orderDetails: z.array(orderDetailSchema).nonempty('Order must contain at least one product'),
});
