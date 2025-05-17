import { Request } from 'express';
import { MongoCartRepository } from './repository/cart.repository';
import { MongoProductRepository } from '../Product/repository/product.repository';

const cartRepository = new MongoCartRepository();
const productRepository = new MongoProductRepository();

const addToCart = async (req: Request) => {
    const { shopId, productId } = req.body;
    return cartRepository.create({ shopId, productId, userId: req.user._id });
};

const removeFromCart = async (req: Request) => {
    return req;
};

const getMyCartItems = async (req: Request) => {
    return;
};

export default {
    addToCart,
    removeFromCart,
    getMyCartItems,
};
