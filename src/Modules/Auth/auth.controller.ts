import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { successResponse } from '../../Utils/Response';

//ADMIN SPECIFIC ROUTES
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = authService.createAdmin(req, res);
        return successResponse(res, 200, 'Admin Created Successfully', data);
    } catch (error) {
        console.log('Error in creating admin', error);
        next(error);
    }
};

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = authService.createCompany(req, res);
        return successResponse(res, 200, 'Company Created Successfully', data);
    } catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
};

//IT SHOULD BE ROLE BASED DYNAMIC LOGIN.
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = authService.login(req, res);
        return successResponse(res, 200, 'Logged In Successfully', data);
    } catch (error) {
        console.log('Error in logging in', error);
        next(error);
    }
};

export default {
    login,
    createAdmin,
    createCompany,
};
