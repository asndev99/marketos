import { Request, Response, NextFunction } from "express";
import authService from "../Auth/auth.service";
import { successResponse } from "../../Utils/Response";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.createAdmin(req, res);
    successResponse(res, 200, "Admin Created Successfully", null);
  } catch (error) {
    console.log("Error in creating admin", error);
    next(error);
  }
};

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.loginAdmin(req, res);
    return successResponse(res, 200, "Successfully Logged in ", data);
  } catch (error) {
    console.log("Error in logging in admin", error);
    next(error);
  }
};

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
  loginAdmin,
  createCompany,
  createAdmin,
};
