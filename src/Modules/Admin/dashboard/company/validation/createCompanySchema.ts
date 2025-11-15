import z from 'zod';
import { baseStringSchema } from '../../../../Auth/validation/common';

export const createCompanySchema = z
    .object({
        username: baseStringSchema,
        password: baseStringSchema,
    })
    .strict();
