import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../Utils/Response";
import productService from "./product.service";
interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const createProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.createNewProduct(req, res);
    return successResponse(res, 200, "Successfully Created New Product ", data);
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};
const fetchAllProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.getAllProducts(req, res);
    return successResponse(
      res,
      200,
      "Successfully Fetched All Products ",
      data
    );
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};
const fetchProductDetails = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.getProduct(req, res);
    return successResponse(
      res,
      200,
      "Successfully Fetched Product Details ",
      data
    );
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};
const updateProductDetails = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.editProduct(req, res);
    return successResponse(
      res,
      200,
      "Successfully Edited Product Details ",
      data
    );
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};

const deleteProduct = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.deleteProduct(req, res);
    return successResponse(
      res,
      200,
      "Successfully Deleted Product Details ",
      data
    );
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};
export default {
  createProduct,
  fetchAllProduct,
  fetchProductDetails,
  updateProductDetails,
  deleteProduct,
};
