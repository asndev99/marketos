import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../Utils/Response";
import companyService from './company.service';

const loginCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.login(req, res);
    return successResponse(res, 200, "Successfully Logged in ", data);
  } catch (error) {
    console.log("Error in logging in admin", error);
    next(error);
  }
};

const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.createCompanyDetails(req, res);
    return successResponse(res, 200, "Successfully Created Company Profile ", data);
  } catch (error) {
    console.log("Error in creating product", error);
    next(error);
  }
};

export default {
  loginCompany,
  createProfile,
};
