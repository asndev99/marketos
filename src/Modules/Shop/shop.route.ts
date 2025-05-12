import express from 'express';
import { validateSchema } from '../../Middlewares/validateSchema';
import shopController from './shop.controller';
import { createShopProfileSchema } from './validation/createShopProfileSchema';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
const shopRouter = express.Router();

shopRouter.post(
    '/create-profile',
    validateSchema(createShopProfileSchema),
    shopController.createProfile
);

shopRouter.get(
    '/top-categories',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.getTopCategories
);

shopRouter.get(
    '/popular-companies',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.popularCompanies
);

export default shopRouter;
