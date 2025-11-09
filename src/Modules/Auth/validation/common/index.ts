import { date, z } from 'zod';
import { roles, UserRole } from '../../../../Common/constants';

export const baseStringSchema = z.string().trim().min(1, 'Field cannot be empty');

export const passwordSchema = z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character');

export const login = z
    .object({
        username: baseStringSchema,
        password: baseStringSchema,
        role: z.enum(roles),
    })
    .strict();

export const validateUserNameSchema = z
    .object({
        username: baseStringSchema,
    })
    .strict();

export const changePasswordSchema = z
    .object({
        newPassword: passwordSchema,
        oldPassword: baseStringSchema,
        confirmPassword: baseStringSchema,
    }).strict()
    .refine((data) => data.newPassword !== data.oldPassword, {
        message: 'New password must be different from old password',
        path: ['newPassword'],
    })
    .refine((data) => data?.confirmPassword === data?.newPassword, {
        message: 'Confirm password must match new password',
        path: ['confirmPassword'],
    });
