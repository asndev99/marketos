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
            select: 'name price discountedPrice status companyId',
            populate: {
                path: 'images',
                select: 'image',
            },
        },
    ]);
    console.log("data: ", data);
    return getCartItemsDto(data);
};

const removeFromCart = async (req: Request) => {
    const { productId, shopId, cartId } = req.body;
    return await cartRepository.RemoveItemFromCart({ productId, shopId, cartId });
};

const editCart = async (req: Request) => {
    const { operation, qty = 1, cartId } = req.body;
    const existingItem = await cartRepository.findOne({ _id: cartId });

    if (operation === 'increement') {
        if (existingItem) {
            return await cartRepository.findOneAndUpdate(
                { _id: existingItem._id },
                { qty: existingItem.qty + qty }
            );
        }
        return;
    }

    if (operation === 'decreement') {
        if (existingItem) {
            const updatedQty = existingItem.qty - qty;
            if (updatedQty <= 0) {
                return await cartRepository.findOneAndDelete({ _id: existingItem._id });
            }
            return await cartRepository.findOneAndUpdate(
                { _id: existingItem._id },
                { qty: updatedQty }
            );
        }
        return;
    }

    if (operation === 'set') {
        if (existingItem) {
            return await cartRepository.findOneAndUpdate({ _id: existingItem._id }, { qty });
        }
        return;
    }
};

export default {
    addToCart,
    editCart,
    removeFromCart,
    getCartItems,
};
