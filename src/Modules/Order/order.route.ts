import { validateSchema } from '../../Middlewares/validateSchema';
import orderController from './order.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';

const orderRouter = require('express').Router();
orderRouter.get(
    '/summary',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.fetchOrderSummary
);
export default orderRouter;
