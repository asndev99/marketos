import express from 'express';
import dashboardOrderController from './dashboard.order.controller';
const dashboardOrderRouter = express.Router();

dashboardOrderRouter.get('/', dashboardOrderController.listAllOrders);

export default dashboardOrderRouter;
