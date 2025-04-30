import express, { Application } from "express";
import { globalErrorHandler } from "./Middlewares/global.errorhandler.middleware";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(globalErrorHandler);
  return app;
};
