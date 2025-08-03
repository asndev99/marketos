import express, { Application } from 'express';
import { globalErrorHandler } from './Middlewares/global.errorhandler.middleware';
// import adminRouter from "./Modules/Admin/admin.router";
import appRoutes from './index.routing';
import dotenv from "dotenv";
import { loggerMiddleware } from './Configs/logger.middleware';
dotenv.config();

export default async (app: Application) => {
    app.use(loggerMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', appRoutes);
    app.use(globalErrorHandler);
    return app;
};
