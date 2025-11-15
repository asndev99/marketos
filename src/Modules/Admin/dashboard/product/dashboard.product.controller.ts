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

const updateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await dashboardRepository.updateStatus({
            productId: req.params.productId,
            status: req.body.status,
        });
        return successResponse(res, 200, 'Product Status Updated Successfully');
    } catch (error) {
        console.log('Error in updating status', error);
    }
};

export default {
    updateProductStatus,
    listAllProducts,
};
