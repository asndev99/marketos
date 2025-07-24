import { NextFunction, Request, Response } from 'express';
import shopHomeService from './services/shop.home.service';
import shopProfileService from './services/shop.profile.service';
import { successResponse } from '../../Utils/Response';

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopProfileService.completeShopProfileDetails(req);
        return successResponse(res, 200, 'Shop Profile Completed Successfully', data);
    } catch (error) {
        console.log('Error in completing shop details', error);
        next(error);
    }
};
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopProfileService.getProfile(req);
        return successResponse(res, 200, 'Profile Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting shop profile', error);
        next(error);
    }
};
export const getTopCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getCategories(req);
        return successResponse(res, 200, 'Top Categories Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting popular companies', error);
        next(error);
    }
};

export const popularCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getPopularCompanies(req);
        return successResponse(res, 200, 'Popular Companies Fetched Successully', data);
    } catch (error) {
        console.log('Error in getting popular companies');
        next(error);
    }
};

export const discountedProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getDiscountedProducts(req);
        return successResponse(res, 200, 'Discounted Products Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
};

export const categoryProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getCategoryProducts(req);
        return successResponse(res, 200, 'Category Products Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
};

export const allCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getAllCompanies(req);
        return successResponse(res, 200, 'All Companies Fetched Successully', data);
    } catch (error) {
        console.log('Error in getting popular companies');
        next(error);
    }
};

export const companyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await shopHomeService.getCompanyProducts(req);
        return successResponse(res, 200, 'Company Products Fetched Successfully', data);
    } catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
};

export default {
    createProfile,
    getProfile,
    getTopCategories,
    popularCompanies,
    discountedProducts,
    allCompanies,
    categoryProducts,
    companyProducts
};
