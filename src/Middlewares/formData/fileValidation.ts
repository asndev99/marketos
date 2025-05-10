import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../Utils/Error';

export function validateImageFields(requiredFields: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        const files = req.files as Record<string, Express.Multer.File[]>;
        for (const field of requiredFields) {
            if (!files || !files[field] || files[field].length === 0) {
                throw new ValidationError(`${field} image is required.`);
            }
        }
        next();
    };
}
