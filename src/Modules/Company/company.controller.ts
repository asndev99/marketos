import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../Utils/Response";
import companyService from './company.service';
interface MulterRequest extends Request {
  files: {
      [fieldname: string]: Express.Multer.File[]
  }
}

const createProfile = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.createCompanyDetails(req, res);
    return successResponse(res, 200, "Successfully Created Company Profile ", data);
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.getCompanyDetails(req, res);
    return successResponse(res, 200, "Get Company Profile Successfully", data);
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.allOrders(req, res);
    return successResponse(res, 200, "Get All company orders Successfully", data?.data);
  } catch (error) {
    console.log("Error in fetching all orders", error);
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.singleOrder(req, res);
    return successResponse(res, 200, "Get order details Successfully", data);
  } catch (error) {
    console.log("Error in fetching all orders", error);
    next(error);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.updateOrder(req, res);
    return successResponse(res, 200, "Update order status Successfully", data);
  } catch (error) {
    console.log("Error in fetching all orders", error);
    next(error);
  }
};

const orderAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.OrderAnalytics(req, res);
    return successResponse(res, 200, "Get order analytics Successfully", data);
  } catch (error) {
    console.log("Error in fetching all orders", error);
    next(error);
  }
};

const incomeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.IncomeAnalytics(req, res);
    return successResponse(res, 200, "Get income analytics Successfully", data);
  } catch (error) {
    console.log("Error in fetching all orders", error);
    next(error);
  }
};

export default {
  createProfile,
  getProfile,
  getOrders,
  getOrder,
  updateOrder,
  orderAnalytics,
  incomeAnalytics
};
