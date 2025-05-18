import { Request } from 'express';
import { MongoCartRepository } from './repository/cart.repository';
import { MongoProductRepository } from '../Product/repository/product.repository';
import { getCartItemsDto } from './dto';

const cartRepository = new MongoCartRepository();
const productRepository = new MongoProductRepository();

const addToCart = async (req: Request) => {
    const { shopId, productId } = req.body;
    return cartRepository.addToCart({ shopId, productId, userId: req.user._id.toString() });
};

const getCartItems = async (req: Request) => {
    const data = await cartRepository.findMany({ userId: req.user._id.toString() }, {}, [
        {
            path: 'productId',
            select: 'name price discountedPrice status',
            populate: {
                path: 'images',
                select: 'image',
            },
        },
    ]);
    return getCartItemsDto(data);
};

const removeFromCart = async (req: Request) => {
    const { productId, shopId, cartId } = req.body;
    return await cartRepository.RemoveItemFromCart({ productId, shopId, cartId });
};

export default {
    addToCart,
    getCartItems,
    removeFromCart,
};
