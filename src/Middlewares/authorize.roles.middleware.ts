import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../Common/constants';

import { UnauthorizedError } from '../Utils/Error';

/**
 * Middleware to authorize based on one or more roles.
 * @param roles - allowed roles
 */
export const authorizeRole = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('You are not allowed to access this route');
        }
        next();
    };
};
