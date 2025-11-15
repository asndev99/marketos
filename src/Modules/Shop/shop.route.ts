import express from 'express';
import { validateSchema } from '../../Middlewares/validateSchema';
import shopController from './shop.controller';
import { createShopProfileSchema } from './validation/createShopProfileSchema';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';
const shopRouter = express.Router();

shopRouter.get('/shop-category', shopController.shopCategories);

shopRouter.post(
    '/complete-profile',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    validateSchema(createShopProfileSchema),
    shopController.completeShopDetails
);

shopRouter.get(
    '/profile',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.getProfile
);

shopRouter.patch(
    '/image',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    createUploadMiddleware([
        {
            name: 'shopImage',
            maxCount: 1,
            required: false,
        },
    ]),
    shopController.updateProfilePicture
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

shopRouter.get(
    '/discounted-products',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.discountedProducts
);

shopRouter.get(
    '/all-companies',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.allCompanies
);

shopRouter.get(
    '/category-products',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.categoryProducts
);

shopRouter.get(
    '/company-products/:id',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.companyProducts
);

shopRouter.get(
    '/companies-by-category',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.getCompaniesByCategory
);

shopRouter.get(
    '/similar-products/:id',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    shopController.similarProducts
);

shopRouter.get('/search', verifyUser, authorizeRole(UserRole.SHOPKEEPER), shopController.search);

export default shopRouter;
