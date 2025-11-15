import express from 'express';
const dashboardHomeRouter = express.Router();
import dashboardHomeController from './dashboard.home.controller';

dashboardHomeRouter.get('/overview', dashboardHomeController.getBusinessOverview);
dashboardHomeRouter.get(
    '/orderstatus-distribution',
    dashboardHomeController.getOrderStatusDistribution
);
dashboardHomeRouter.get('/topselling-products', dashboardHomeController.topSellingProducts);

export default dashboardHomeRouter;
