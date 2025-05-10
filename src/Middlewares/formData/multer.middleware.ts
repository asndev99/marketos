import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../Utils/Error';

const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`${file.fieldname} must be an image.`));
    }
};

const upload = multer({
    fileFilter,
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

interface FieldConfig {
    name: string;
    maxCount: number;
    required?: boolean;
}

export function createUploadMiddleware(fields: FieldConfig[]) {
    const middleware = upload.fields(fields);

    return function (req: Request, res: Response, next: NextFunction) {
        middleware(req, res, function (err) {
            if (err) {
                return next(new ValidationError(err.message));
            }

            const files = req.files as Record<string, Express.Multer.File[]>;

            for (const field of fields) {
                if (
                    field.required &&
                    (!files || !files[field.name] || files[field.name].length === 0)
                ) {
                    return next(new ValidationError(`${field.name} is required`));
                }
            }

            next();
        });
    };
}
