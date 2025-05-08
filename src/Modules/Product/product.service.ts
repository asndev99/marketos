import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../Common/constants";
import TokenService from "../Auth/token.service";
import { BadRequestError } from "../../Utils/Error";
import bcrypt from "bcrypt";
import { MongoProductRepository } from "./repository/product.repository";
import { MongoCompanyRepository } from "../Company/repository/company.repository";
interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[]
    }
}
import {uploadBufferToCloudinary} from "../../Utils/helpers";

const companyRepository = new MongoCompanyRepository();
const productRepository = new MongoProductRepository();


const createNewProduct = async (req: MulterRequest, res: Response) => {
  let {numOfDistribution, companyName} = req.body;
  const userId = req?.user?._id;
  numOfDistribution = Number(numOfDistribution);
  const companyDetails = await companyRepository.findOne({userId})
  if(!companyDetails){
    throw new BadRequestError("Company Not Found");
  }
  const companyId = companyDetails?._id;
  const createdProduct = await productRepository.create({companyId, ...req?.body});
  const images = req?.files["productImage"];
  const data = await Promise.all(
    images.map( async (file) => {
          const { url } = await uploadBufferToCloudinary(file?.buffer, file.originalname, "products");
          return {image: url, productId: createdProduct?._id};
    })
  )

  return createdProduct?._id;
};

export default {
    createNewProduct
};
