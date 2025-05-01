import { Request, Response, NextFunction } from "express";
import { MongoUserRepository } from "../User/repository/user.repository";
import bcrypt from "bcrypt";
import { successResponse } from "../../Utils/Response";

const userRepository = new MongoUserRepository();

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingCompany = await userRepository.findByUsername(
      req.body.username
    );
    if (existingCompany) {
      throw new BadRequestError(
        "Company With This Username Is Already Registered"
      );
    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const company = await userRepository.create({ ...req.body, hashPassword });

    return successResponse(res, 200, "Company Created Successfully", company);
  } catch (error) {
    console.log("Error in creating company", error);
    next(error);
  }
};
