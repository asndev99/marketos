import { Request } from 'express';
import { ShopRepository } from '../repository/shop.repository';
import { BadRequestError, NotFoundError } from '../../../Utils/Error';
import { MongoUserRepository } from '../../User/repository/user.repository';
import { CreateShopPayload } from '../interface';
import { uploadBufferToCloudinary } from '../../../Utils/helpers';

const shopRepository = new ShopRepository();
const userRepository = new MongoUserRepository();

const completeShopDetails = async (req: Request) => {
    if (req.user.isProfileCompleted) {
        throw new BadRequestError("Your Shop Details Are Completed");
    }

    const createShopPayload = req.body as CreateShopPayload;

    const isPhoneNicExists = await shopRepository.findOne({
        $or: [{ mobileNumber: createShopPayload.mobileNumber }, { NIC: createShopPayload.NIC }],
    });

    if (isPhoneNicExists) {
        throw new BadRequestError('Shop with this phone or CNIC already exists');
    }

    const latitude = parseFloat(createShopPayload.latitude.toString());
    const longitude = parseFloat(createShopPayload.longitude.toString());


    await shopRepository.createProfile({
        ...createShopPayload,
        ntn: createShopPayload.ntn ?? undefined,
        userId: req.user?._id,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude],
        },
    }),

        await userRepository.findByIdAndUpdate(req.user._id.toString(), { isProfileCompleted: true })
    return;

}

const updateProfilePicture = async (req: Request) => {
    const files = req.files as Record<string, Express.Multer.File[]>;
    if (!files || !files['shopImage'] || files['shopImage'].length === 0) {
        return await shopRepository.findOneAndUpdate(
            { userId: req.user._id },
            { shopImage: null }
        );
    }
    const file = files['shopImage'][0];
    const { url: logo } = await uploadBufferToCloudinary(
        file.buffer,
        file.originalname,
        'shop'
    );
    return await shopRepository.findOneAndUpdate(
        { userId: req.user._id },
        { shopImage: logo }
    );
};


const getProfile = async (req: Request) => {
    const data = await shopRepository.findOne({ userId: req.user._id });
    if (!data) throw new NotFoundError('Shop Not Found');

    return data;
};

export default {
    getProfile,
    completeShopDetails,
    updateProfilePicture
};
