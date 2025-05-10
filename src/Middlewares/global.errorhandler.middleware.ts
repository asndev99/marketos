import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../Utils/Response';
import { AppError } from '../Utils/Error';

export const globalErrorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Something Went Wrong';
    return errorResponse(res, statusCode, message);
};
