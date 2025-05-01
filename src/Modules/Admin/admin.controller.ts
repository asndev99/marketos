import { Request, Response, NextFunction } from "express";
import authService from "../Auth/auth.service";
import { successResponse } from "../../Utils/Response";

const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await authService.createCompany(req, res);
    return successResponse(res, 200, "Company Created Successfully", data);
  } catch (error) {
    console.log("Error in creating admin", error);
    next(error);
  }
};

export default {
  createCompany,
};
