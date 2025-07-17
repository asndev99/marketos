import { Request } from 'express';
import { ShopRepository } from '../repository/shop.repository';
import { BadRequestError, NotFoundError } from '../../../Utils/Error';
import { MongoUserRepository } from '../../User/repository/user.repository';
import bcrypt from 'bcrypt';
import { UserRole } from '../../../Common/constants';
import TokenService from '../../Auth/token.service';

const shopRepository = new ShopRepository();
const userRepository = new MongoUserRepository();
const completeShopProfileDetails = async (req: Request) => {
    const { username, password, ...restPayload } = req.body;
    const existingShop = await shopRepository.findOne({
        $or: [{ mobileNumber: restPayload.mobileNumber }, { NIC: restPayload.NIC }],
    });

    if (existingShop) {
        throw new BadRequestError('Mobile Number or CNIC is already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
        username,
        password: hashPassword,
        role: UserRole.SHOPKEEPER,
    });

    const shopDetailsPayload = {
        ...restPayload,
        userId: user._id,
    };

    await shopRepository.createProfile(shopDetailsPayload);
    await userRepository.findByIdAndUpdate(user._id.toString(), { isProfileCompleted: true });

    const accessToken = TokenService.generateAccessToken({
        _id: user._id.toString(),
        role: user.role,
    });

    return {
        accessToken,
    };
};
const getProfile = async (req: Request) => {
    const data = await shopRepository.findOne({_id: req.user._id});
    if(!data) throw new NotFoundError("Shop Not Found");

    return data;
}
export default {
    completeShopProfileDetails,
    getProfile
};
