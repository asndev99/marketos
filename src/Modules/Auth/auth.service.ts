import { Request, Response, NextFunction } from 'express';
import { MongoUserRepository } from '../User/repository/user.repository';
import bcrypt from 'bcrypt';
import TokenService from './token.service';
import { UserRole } from '../../Common/constants';
import { BadRequestError } from '../../Utils/Error';

const userRepository = new MongoUserRepository();

const createAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    return userRepository.create({
        username,
        password: hashPassword,
        role: UserRole.ADMIN,
    });
};

const createCompany = async (req: Request, res: Response) => {
    const existingCompany = await userRepository.findByUsername(req.body.username);
    if (existingCompany) {
        throw new BadRequestError('Company With This Username Is Already Registered');
    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    return userRepository.create({ ...req.body, password: hashPassword });
};

const login = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const user = await userRepository.findOne({ username, role });
    if (!user) {
        throw new BadRequestError('Invalid Credentials');
    }
    const isPassword = bcrypt.compareSync(password, user.password);
    if (!isPassword) {
        throw new BadRequestError('Invalid Credenitals');
    }

    const accessToken = TokenService.generateAccessToken({
        _id: user._id.toString(),
        role: user.role,
    });
    return { accessToken };
};

export default {
    createAdmin,
    createCompany,
    login,
};
