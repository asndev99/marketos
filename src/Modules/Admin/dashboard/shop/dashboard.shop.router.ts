import express from 'express';
import dashboardShopController from './dashboard.shop.controller';
const dashboardShopRouter = express.Router();

dashboardShopRouter.get('/', dashboardShopController.listAllShops);

export default dashboardShopRouter;
