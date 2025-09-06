import { validateSchema } from '../../Middlewares/validateSchema';
import { validateParams } from '../../Middlewares/validateParams';
import { validateQueryParams } from '../../Middlewares/validateQueryParams';
import orderController from './order.controller';
import { verifyUser } from '../../Middlewares/auth.middleware';
import { authorizeRole } from '../../Middlewares/authorize.roles.middleware';
import { UserRole } from '../../Common/constants';
import { orderSummarySchema } from './validation/orderSummary';
import { orderPlacementSchema } from './validation/orderPlacement';
import { orderParamsSchema, orderQuerySchema, orderPaymentSchema } from './validation/updateOrder';

const orderRouter = require('express').Router();
orderRouter.post(
    '/summary',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    validateSchema(orderSummarySchema),
    orderController.fetchOrderSummary
);
orderRouter.post(
    '/place-order',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    validateSchema(orderPlacementSchema),
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
    validateParams(orderParamsSchema),
    orderController.mySingleOrder
);
orderRouter.get(
    '/pie-analytics',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    orderController.pieChartAnalytics
);
orderRouter.patch(
    '/update-status/:id',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    validateParams(orderParamsSchema),
    validateQueryParams(orderQuerySchema),
    orderController.updateOrderStatus
);
orderRouter.patch(
    '/update-payment/:id',
    verifyUser,
    authorizeRole(UserRole.SHOPKEEPER),
    validateParams(orderParamsSchema),
    validateQueryParams(orderPaymentSchema),
    orderController.updateOrderPaymentStatus
);
export default orderRouter;
