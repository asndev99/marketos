import { Request, Response, NextFunction } from "express";
import { MongoUserRepository } from "../User/repository/user.repository";
import TokenService from "../Auth/token.service";
import { BadRequestError } from "../../Utils/Error";
import bcrypt from "bcrypt";
import { MongoCompanyRepository } from "./repository/company.repository";
interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[]
    }
}
import {uploadBufferToCloudinary} from "../../Utils/helpers";

const companyRepository = new MongoCompanyRepository();
const userRepository = new MongoUserRepository();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const company = await userRepository.findOne({username, role: "COMPANY"});
  if(!company){
    throw new BadRequestError("Invalid Credentials");
  }
  const isPassword = bcrypt.compareSync(password, company.password);
  if (!isPassword) {
    throw new BadRequestError("Invalid Credenitals");
  }

  const accessToken = TokenService.generateAccessToken({
    _id: company?._id.toString(),
    role: company.role
  })
  return {accessToken};
};

const createCompanyDetails = async (req: MulterRequest, res: Response) => {
  let {numOfDistribution, companyName} = req.body;
  const userId = req?.user?._id;
  numOfDistribution = Number(numOfDistribution);
  const isCompanyAlreadyExist = await companyRepository.findOne({userId, companyName})
  if(isCompanyAlreadyExist){
    throw new BadRequestError("Company already Created");
  }
  const { url: coverPhoto } = await uploadBufferToCloudinary(req?.files["coverPhoto"]?.[0]?.buffer, req?.files["coverPhoto"]?.[0].originalname, "companies");
  const { url: logo } = await uploadBufferToCloudinary(req?.files["logo"]?.[0]?.buffer, req?.files["logo"]?.[0].originalname, "companies");
  return companyRepository.create({userId, ...req.body, coverPhoto: coverPhoto, profileLogo: logo});
};
const getCompanyDetails = async (req: Request, res: Response) => {
    const userId = req?.user?._id;
    const companyDetails = await companyRepository.findOne({userId})
    if(!companyDetails){
      throw new BadRequestError("Company Not Created");
    }
    return companyDetails;
}
export default {
    login,
    createCompanyDetails,
    getCompanyDetails
};
