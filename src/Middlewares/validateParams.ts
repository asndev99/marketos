import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { formatError } from "./validateSchema";

export const validateParams = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
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
