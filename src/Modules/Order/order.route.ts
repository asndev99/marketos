import { validateSchema } from '../../Middlewares/validateSchema';
import orderController from './order.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { createUploadMiddleware } from '../../Middlewares/formData/multer.middleware';

const orderRouter = require('express').Router();
orderRouter.post(
    '/summary',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.fetchOrderSummary
);
orderRouter.post(
    '/place-order',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.placeAnOrder
);
orderRouter.get(
    '/all-order',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.myOrders
);
orderRouter.get(
    '/single-order/:id',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.mySingleOrder
);
export default orderRouter;
