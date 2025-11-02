import { Request, Response, NextFunction } from 'express';
import { MongoUserRepository } from '../User/repository/user.repository';
import bcrypt from 'bcrypt';
import TokenService from './token.service';
import { UserRole } from '../../Common/constants';
import { BadRequestError } from '../../Utils/Error';
import { ShopRepository } from '../Shop/repository/shop.repository';

const userRepository = new MongoUserRepository();
const shopRepository = new ShopRepository();

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
    return userRepository.create({ ...req.body, password: hashPassword, role: 'COMPANY' });
};

const login = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const user = await userRepository.findOne({ username, role, isDeleted: false });
    if (!user) {
        throw new BadRequestError('User Not Found');
    }
    const isPassword = bcrypt.compareSync(password, user.password);
    if (!isPassword) {
        throw new BadRequestError('Invalid Credenitals');
    }
    const accessToken = TokenService.generateAccessToken({
        _id: user._id.toString(),
        role: user.role,
    });

    const data = {
        accessToken,
        isProfileCompleted: user.isProfileCompleted
    }
    if (role == UserRole.SHOPKEEPER) {
        const shop = await shopRepository.findOne({ userId: user._id });
        return {
            ...data,
            shop
        }
    }
    return data;

};

const createShop = async (req: Request) => {
    const { username, password } = req.body;
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
        throw new BadRequestError('This username is already in use');
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const shopKeeper = await userRepository.create({ username, password: hashPassword, role: UserRole.SHOPKEEPER });
    const accessToken = TokenService.generateAccessToken({
        _id: shopKeeper._id.toString(),
        role: shopKeeper.role,
    });
    return { accessToken };
};

const validateUsername = async (req: Request) => {
    const user = await userRepository.findByUsername(req.body.username);
    if (user) {
        throw new BadRequestError('Username is already taken');
    }
    return;
};

const deleteAccount = async (req: Request) => {
    await userRepository.deleteUser(req?.user?._id.toString(), req?.user?.role);
    return true;
}

export default {
    createAdmin,
    createCompany,
    login,
    createShop,
    validateUsername,
    deleteAccount
};
