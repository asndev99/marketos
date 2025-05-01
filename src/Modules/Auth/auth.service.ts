import { Request, Response, NextFunction } from "express";
import { MongoUserRepository } from "../User/repository/user.repository";
import bcrypt from "bcrypt";

const userRepository = new MongoUserRepository();

const createCompany = async (req: Request, res: Response) => {
  const existingCompany = await userRepository.findByUsername(
    req.body.username
  );
  if (existingCompany) {
    throw new BadRequestError(
      "Company With This Username Is Already Registered"
    );
  }
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  return userRepository.create({ ...req.body, hashPassword });
};

export default {
  createCompany,
};
