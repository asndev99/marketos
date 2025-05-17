import { z } from 'zod';

export const baseStringSchema = z.string().trim().min(1, 'Field cannot be empty');
