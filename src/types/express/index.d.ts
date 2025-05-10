import * as express from 'express';
import { IUserDocument } from '../../Modules/User/user.model';

declare global {
    namespace Express {
        interface Request {
            user: IUserDocument;
        }
    }
}
