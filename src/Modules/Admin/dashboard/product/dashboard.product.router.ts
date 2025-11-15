import express from 'express';
const dashboardProductRouter = express.Router();
import dashboardProductController from './dashboard.product.controller';

dashboardProductRouter.get('/', dashboardProductController.listAllProducts);
dashboardProductRouter.patch('/status/:productId', dashboardProductController.updateProductStatus);

export default dashboardProductRouter;
