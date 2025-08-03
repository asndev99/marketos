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
        { name: 'logo', maxCount: 1, required: true },
    ]),
    companyController.createProfile
);

companyRouter.get('/', verifyUser, authorizeRole(UserRole.COMPANY), companyController.getProfile);
companyRouter.get('/order', verifyUser, authorizeRole(UserRole.COMPANY), companyController.getOrders);
companyRouter.get('/order/:id', verifyUser, authorizeRole(UserRole.COMPANY), companyController.getOrder);
companyRouter.patch('/update-order/', verifyUser, authorizeRole(UserRole.COMPANY), companyController.updateOrder);
companyRouter.get('/order-analytics', verifyUser, authorizeRole(UserRole.COMPANY), companyController.orderAnalytics);
companyRouter.get('/income-analytics', verifyUser, authorizeRole(UserRole.COMPANY), companyController.incomeAnalytics);
export default companyRouter;
