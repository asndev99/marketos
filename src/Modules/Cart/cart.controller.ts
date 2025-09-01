import { NextFunction, Request, Response } from 'express';
import cartService from './cart.service';
import { successResponse } from '../../Utils/Response';

//for SHOP RIGHT NOW
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await cartService.addToCart(req);
        return successResponse(res, 200, 'Item Added To Cart Successfully', null);
    } catch (error) {
        console.log('Error in add to cart', error);
        next(error);
    }
};

const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await cartService.getCartItems(req);
        return successResponse(res, 200, 'Cart Items Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting my cart', error);
        next(error);
    }
};

const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cartService.removeFromCart(req);
        return successResponse(res, 200, 'Cart Removed From Cart Successfully', null);
    } catch (error) {
        console.log('Error in removing from cart');
        next(error);
    }
};

const editCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await cartService.editCart(req);
        return successResponse(res, 200, 'Cart Updated Successfully', null);
    } catch (error) {
        console.log('Error in editing cart', error);
        next(error);
    }
};

export default {
    addToCart,
    editCart,
    getMyCart,
    removeFromCart,
};
