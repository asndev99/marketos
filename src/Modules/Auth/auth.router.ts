import { Router } from 'express';
import { validateSchema } from '../../Middlewares/validateSchema';
import { createAdminSchema } from './validation/createAdminSchema';
import authController from './auth.controller';
import { createCompanySchema } from './validation/createCompanySchema';
import { login } from './validation/common';

const authRouter = Router();

//ADMIN SPECIFIC ROUTES
authRouter.post(
    '/admin/create-admin',
    validateSchema(createAdminSchema),
    authController.createAdmin
);
authRouter.post(
    '/admin/create-company',
    validateSchema(createCompanySchema),
    authController.createCompany
);

//GENERALIZED ROUTES
authRouter.post('/login', validateSchema(login), authController.login);

export default authRouter;
