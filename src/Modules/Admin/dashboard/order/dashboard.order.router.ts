import express from 'express';
import dashboardOrderController from './dashboard.order.controller';
const dashboardOrderRouter = express.Router();

dashboardOrderRouter.get('/', dashboardOrderController.listAllOrders);
dashboardOrderRouter.get('/:id', dashboardOrderController.orderDetails);

export default dashboardOrderRouter;
