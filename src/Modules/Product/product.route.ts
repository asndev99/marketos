import { validateSchema } from '../../Middlewares/validateSchema';
import productController from './product.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';

const productRouter = require('express').Router();

productRouter.post(
    '/add-product',
    verifyUser,
    createUploadMiddleware([{ name: 'productImage', maxCount: 4, required: true }]),
    authorizeRole(UserRole.COMPANY),
    productController.createProduct
);
productRouter.get(
    '/get-product',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.fetchAllProduct
);
productRouter.get(
    '/get-product/:id',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.fetchProductDetails
);
productRouter.patch(
    '/edit-product/:id',
    verifyUser,
    createUploadMiddleware([]),
    authorizeRole(UserRole.COMPANY),
    productController.updateProductDetails
);
productRouter.delete(
    '/delete-product/:id',
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    productController.deleteProduct
);
export default productRouter;
