import { z } from 'zod';

export const mobileNumberSchema = z.string().regex(/^03[0-9]{2}-[0-9]{7}$/, {
    message: 'Invalid mobile number format. Use 03XX-XXXXXXX',
});

export const nicSchema = z.string().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/, {
    message: 'Invalid NIC format. Use XXXXX-XXXXXXX-X',
});
