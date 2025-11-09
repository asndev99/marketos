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
        const data = await authService.login(req, res);
        return successResponse(res, 200, 'Logged In Successfully', data);
    } catch (error) {
        console.log('Error in logging in', error);
        next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.deleteAccount(req);
        return successResponse(res, 200, 'Account Deleted Successfully', data);
    } catch (error) {
        console.log('Error in logging in', error);
        next(error);
    }
};

const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.changePassword(req);
        return successResponse(res, 200, 'Successfully changed your password', null);
    } catch (error) {
        console.log('Error in logging in', error);
        next(error);
    }
};

//NOT IN USER FOR NOW
const createShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.createShop(req);
        return successResponse(res, 200, 'Shop User Created Now Complete Details', data);
    } catch (error) {
        console.log('Error in creating shop', error);
        next(error);
    }
};

const validateUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.validateUsername(req);
        return successResponse(res, 200, 'Username is available', null);
    } catch (error) {
        console.log('Error in validating username', error);
        next(error);
    }
};
export default {
    login,
    createAdmin,
    createCompany,
    createShop,
    validateUsername,
    deleteUser,
    changeUserPassword
};
