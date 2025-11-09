import { Router } from 'express';
import { validateSchema } from '../../Middlewares/validateSchema';
import { createAdminSchema } from './validation/createAdminSchema';
import authController from './auth.controller';
import { createCompanySchema } from './validation/createCompanySchema';
import { login, validateUserNameSchema, changePasswordSchema } from './validation/common';
import { createShopSchema } from './validation/createShopSchema';
import { verifyUser } from '../../Middlewares/auth.middleware';

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

authRouter.post('/create-shop', validateSchema(createShopSchema), authController.createShop);

//GENERALIZED ROUTES
authRouter.post('/login', validateSchema(login), authController.login);
authRouter.patch(
    '/change-password',
    verifyUser,
    validateSchema(changePasswordSchema),
    authController.changeUserPassword
);
authRouter.delete('/delete', verifyUser, authController.deleteUser);

authRouter.post(
    '/validate-username',
    validateSchema(validateUserNameSchema),
    authController.validateUsername
);

export default authRouter;
