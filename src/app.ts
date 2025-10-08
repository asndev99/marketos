import express, { Request, Response, Application } from 'express';
import { globalErrorHandler } from './Middlewares/global.errorhandler.middleware';
import appRoutes from './index.routing';
import dotenv from 'dotenv';
import { loggerMiddleware } from './Configs/logger.middleware';
import cors from 'cors';

dotenv.config();

export default async (app: Application) => {

    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

    app.options('*', cors());

    app.use(loggerMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Server is running port 8080',
        });
    });

    app.use('/api', appRoutes);

    app.use(globalErrorHandler);

    return app;
};
