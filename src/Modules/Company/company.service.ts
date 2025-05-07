import { Request, Response, NextFunction } from "express";
import { MongoUserRepository } from "../User/repository/user.repository";
import { UserRole } from "../../Common/constants";
import TokenService from "../Auth/token.service";
import { BadRequestError } from "../../Utils/Error";
import bcrypt from "bcrypt";
import { MongoCompanyRepository } from "./repository/company.repository";

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

const createCompanyDetails = async (req: Request, res: Response) => {
  let {companyName, establishedDate, websiteLink, category, city, state, address, warehouseAddress, saleTaxNum, NTN, contactPersonName, contactNumber, contactEmail, alternativeNumber, numOfDistribution} = req.body;
  numOfDistribution = Number(numOfDistribution);
  return companyRepository.create({...req.body});
};
export default {
    login,
    createCompanyDetails,
};
