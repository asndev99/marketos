import express from 'express';
import dashboardOrderRouter from './dashboard/order/dashboard.order.router';
import dashboardCompanyRouter from './dashboard/company/dashboard.company.router';
import dashboardProductRouter from './dashboard/product/dashboard.product.router';
import dashboardHomeRouter from './dashboard/home/dashboard.home.router';
import dashboardShopRouter from './dashboard/shop/dashboard.shop.router';

const adminRouter = express.Router();

adminRouter.use('/home', dashboardHomeRouter);
adminRouter.use('/order', dashboardOrderRouter);
adminRouter.use('/company', dashboardCompanyRouter);
adminRouter.use('/product', dashboardProductRouter);
adminRouter.use('/shop', dashboardShopRouter);
export default adminRouter;
