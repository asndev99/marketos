import { Request, Response, NextFunction } from 'express';
import * as dashboardRepository from '../dashboard.repository';
import { successResponse } from '../../../../Utils/Response';

const listAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.listAllProducts();
        return successResponse(res, 200, 'All Products Fetched Successfully', data);
    } catch (error) {
        console.log('Error in listing all products', error);
        next(error);
    }
};

export default {
    listAllProducts,
};
