import { z } from "zod";
import { baseStringSchema } from './common';

export const orderParamsSchema = z.object({
  id: baseStringSchema
});

export const orderQuerySchema = z.object({
  status: z.enum(["RECEIVED", "USER_CANCELLED"]),
});

export const orderPaymentSchema = z.object({
    status: z.enum(["COMPLETED"])
})