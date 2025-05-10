import { z } from 'zod';
import { baseStringSchema, passwordSchema } from './common';

export const createCompanySchema = z
    .object({
        username: baseStringSchema,
        password: passwordSchema,
        role: z.enum(['COMPANY']),
    })
    .strict();
