import express, { Application, NextFunction, Request, Response } from 'express';
import { globalErrorHandler } from './Middlewares/global.errorhandler.middleware';
import appRoutes from './index.routing';
import dotenv from 'dotenv';
import { loggerMiddleware } from './Configs/logger.middleware';
dotenv.config();
import cors from 'cors';

export default async (app: Application) => {

    // const corsOptions: CorsOptions = {
    //     origin: '*',
    // };
    // app.use(cors(corsOptions));
    app.use(cors(
        {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        }
    ));
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
