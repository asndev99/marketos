import { Request, Response, NextFunction } from 'express';
import * as dashboardRepository from '../dashboard.repository';
import { successResponse } from '../../../../Utils/Response';

const listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.listOrder();
        return successResponse(res, 200, 'All Orders Listed Successfully', data);
    } catch (error) {
        console.log('Error in listing all orders', error);
        next(error);
    }
};

const orderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.orderDetails(req.params.id);
        return successResponse(res, 200, 'Order Details Fetched Successfully', data);
    } catch (error) {
        console.log('Error in order details', error);
        next(error);
    }
};

export default {
    listAllOrders,
    orderDetails,
};
