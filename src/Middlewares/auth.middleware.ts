import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoUserRepository } from '../Modules/User/repository/user.repository';
import { JWT_SECRET } from '../Configs/env.config';
import { JwtVerifiedPayload } from '../Common/constants';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../Utils/Error';

const userRepository = new MongoUserRepository();
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new UnauthorizedError('Session Expired,please login to continue');
        }
        const verifiedUser = jwt.verify(authorization, JWT_SECRET!) as JwtVerifiedPayload;
        const user = await userRepository.findById(verifiedUser.id);
        if (!user || (user && user.isDeleted)) {
            throw new UnauthorizedError('Session Expired,please login to continue');
        }
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return next(new UnauthorizedError('Session Expired, Please login to continue'));
        }
        next(error);
    }
};
