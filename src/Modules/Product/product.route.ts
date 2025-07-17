import { validateSchema } from '../../Middlewares/validateSchema';
import productController from './product.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';

const productRouter = require('express').Router();

productRouter.post(
    '/',
    verifyUser,
    createUploadMiddleware([{ name: 'productImage', maxCount: 4, required: true }]),
    authorizeRole(UserRole.COMPANY),
    productController.createProduct
);
productRouter.get(
    '/',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.fetchAllProduct
);
productRouter.get(
    '/:id',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.fetchProductDetails
);
productRouter.patch(
    '/:id',
    verifyUser,
    createUploadMiddleware([{ name: 'productImage', maxCount: 4, required: false }]),
    authorizeRole(UserRole.COMPANY),
    productController.updateProductDetails
);
productRouter.delete(
    '/:id',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.deleteProduct
);
export default productRouter;
