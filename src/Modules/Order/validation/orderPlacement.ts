import { z } from 'zod';
import { baseStringSchema } from './common';

const orderDetailSchema = z
    .object({
        productId: baseStringSchema,
        companyId: baseStringSchema,
        totalPrice: z
            .number()
            .int('price must be an integer')
            .positive('price must be greater than 0'),
        quantity: z
            .number()
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than 0'),
        orderTimePrice: z
            .number()
            .int('price must be an integer')
            .positive('price must be greater than 0'),
        paymentMethod: z.enum(['CASH', 'CREDIT']),
    })
    .strict();
export const orderPlacementSchema = z.object({
    orderDetails: z.array(orderDetailSchema).nonempty('Order must contain at least one product'),
});
