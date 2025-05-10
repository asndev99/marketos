import { z } from 'zod';
import { baseStringSchema, passwordSchema } from './common';

export const createAdminSchema = z
    .object({
        username: baseStringSchema,
        password: passwordSchema,
    })
    .strict();
