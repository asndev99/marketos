import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../Utils/Response";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || "Something Went Wrong";
  errorResponse(res, statusCode, message);
};
