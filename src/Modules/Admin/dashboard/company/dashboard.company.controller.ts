import { Request, Response, NextFunction } from 'express';
import * as dashboardRepository from '../dashboard.repository';
import { successResponse } from '../../../../Utils/Response';

const listAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.listAllCompanies();
        return successResponse(res, 200, 'All Companies Fetched Successfully', data);
    } catch (error) {
        console.log('Error in listing all companies', error);
        next(error);
    }
};

const companyDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.companyDetails(req.params.id);
        return successResponse(res, 200, 'Company Details Fetched Successfully', data);
    } catch (error) {
        console.log('Error in fetching company details', error);
        next(error);
    }
};

const companyProductsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await dashboardRepository.productList(req.params.id);
        return successResponse(res, 200, 'Product List Fetched Successfully', data);
    } catch (error) {
        console.log('Error in company product details', error);
        next(error);
    }
};

export default {
    listAllCompanies,
    companyDetails,
    companyProductsList,
};
