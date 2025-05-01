import { ZodError, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

export const formatError = (error: ZodError): any => {
  let errors: any = {};
  error.errors?.map((issue) => {
    errors[issue.path?.[0]] = issue.message;
  });
  return errors;
};

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let dataToValidate;
    if (req.is("multipart/form-data")) {
      dataToValidate = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [key, value])
      );
    } else if (req.is("application/json")) {
      dataToValidate = req.body;
    }
    try {
      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        const validationErrorInstance = new ValidationError(errors);
        next(validationErrorInstance);
      } else {
        next(error);
      }
    }
  };
};
