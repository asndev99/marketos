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

export default {
    addToCart,
};
