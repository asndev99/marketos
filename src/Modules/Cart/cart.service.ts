import { Request } from 'express';
import { MongoCartRepository } from './repository/cart.repository';
import { getCartItemsDto } from './dto';

const cartRepository = new MongoCartRepository();

const addToCart = async (req: Request) => {
    const { shopId, productId, quantity } = req.body;
    const data = await cartRepository.addToCart({
        shopId,
        productId,
        userId: req.user._id.toString(),
        quantity,
    });
    console.log("data: ", data);
    if(data!==null){
        return getCartItemsDto(data, true);
    }else {
        return null;
    }
};

const getCartItems = async (req: Request) => {
    const data = await cartRepository.findMany({ userId: req.user._id.toString() }, {}, [
        {
            path: 'productId',
            select: 'name price discountedPrice status companyId stockQuantity',
            populate: {
                path: 'images',
                select: 'image',
            },
        },
    ]);
    return getCartItemsDto(data, false);
};

export default {
    addToCart,
    getCartItems,
};
