import { Request, Response, NextFunction } from 'express';
import * as dashboardRepository from '../dashboard.repository';
import { successResponse } from '../../../../Utils/Response';

const listAllShops = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.listAllShops();
        return successResponse(res, 200, 'All Shops Fetched Successfully', data);
    } catch (error) {
        console.log('Error in listing shops', error);
        next(error);
    }
};

export default {
    listAllShops,
};
