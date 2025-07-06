import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../Utils/Response';
import orderService from './order.service';
const fetchOrderSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await orderService.orderSummary(req, res);
        return successResponse(res, 200, 'Successfully Fetched Product Details ', data);
    } catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
};

export default {
    fetchOrderSummary,
};
