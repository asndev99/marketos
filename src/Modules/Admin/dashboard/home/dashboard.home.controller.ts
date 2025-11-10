import { Request, Response, NextFunction } from 'express';
import * as dashboardRepository from '../dashboard.repository';
import { successResponse } from '../../../../Utils/Response';

const getBusinessOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.getBusinessOverview();
        return successResponse(res, 200, 'Business Overview Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting business Overview', error);
        next(error);
    }
};

//PIE CHART OF ORDER STATUS DISTRIBUTION
const getOrderStatusDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.getOrderStatusDistribution();
        return successResponse(res, 200, 'Order Distribution Fetched Successfully', {
            data,
        });
    } catch (error) {
        console.log('Error in getting order status distribution', error);
        next(error);
    }
};

//Horizontal Bar Chart
const topSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.topSellingProducts();
        return successResponse(res, 200, 'Top Selling Products Fetched Successfully', data);
    } catch (error) {
        console.log('Error in top selling products', error);
        next(error);
    }
};

export default {
    getBusinessOverview,
    getOrderStatusDistribution,
    topSellingProducts,
};
