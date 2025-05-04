import express, { Application } from "express";
import { globalErrorHandler } from "./Middlewares/global.errorhandler.middleware";
import adminRouter from "./Modules/Admin/admin.router";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/admin", adminRouter);
  app.use(globalErrorHandler);
  return app;
};
