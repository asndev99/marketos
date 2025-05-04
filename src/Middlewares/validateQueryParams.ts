import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { formatError } from "./validateSchema";
import { ValidationError } from "../Utils/Error";

export const validateQueryParams = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        next(new ValidationError(errors));
      } else {
        next(error);
      }
    }
  };
};
