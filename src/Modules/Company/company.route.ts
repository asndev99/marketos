import companyController from './company.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';

const companyRouter = require('express').Router();

companyRouter.post(
    '/create-profile',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    createUploadMiddleware([
        { name: 'coverPhoto', maxCount: 1, required: false },
        { name: 'logo', maxCount: 1, required: true },
    ]),
    companyController.createProfile
);

companyRouter.get('/', verifyUser, authorizeRole(UserRole.COMPANY), companyController.getProfile);
export default companyRouter;
