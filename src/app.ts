import express, { Application, NextFunction, Request, Response } from 'express';
import { globalErrorHandler } from './Middlewares/global.errorhandler.middleware';
// import adminRouter from "./Modules/Admin/admin.router";
import appRoutes from './index.routing';
import dotenv from 'dotenv';
import { loggerMiddleware } from './Configs/logger.middleware';
dotenv.config();
import cors, { CorsOptions } from 'cors';

export default async (app: Application) => {

    const corsOptions: CorsOptions = {
        origin: '*',
    };
    app.use(cors(corsOptions));
    app.use(loggerMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req: any, res: any) => {
        return res.status(200).json({
            message: 'Server is running port 8080',
        });
    });
    app.use('/api', appRoutes);
    app.use(globalErrorHandler);
    return app;
};
