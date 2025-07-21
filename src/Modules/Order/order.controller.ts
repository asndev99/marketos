import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../Utils/Response';
import orderService from './order.service';

const fetchOrderSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await orderService.orderSummary(req, res);
        return successResponse(res, 200, 'Successfully Fetched Product Details ', data);
    } catch (error) {
        console.log('Error in fetching order summary', error);
        next(error);
    }
};

const placeAnOrder = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const data = await orderService.orderPlacement(req, res, session);
        await session.commitTransaction();
        return successResponse(res, 200, 'Successfully Placed Your Order ', data);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log('Error in placing an order', error);
        next(error);
    }
};

const myOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await orderService.allOrders(req, res);
        return successResponse(res, 200, 'Successfully Fetched All Your Order ', data);
    } catch (error) {
        console.log('Error in fetching in orders', error);
        next(error);
    }
};

const mySingleOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await orderService.fetchSingleorder(req, res);
        return successResponse(res, 200, 'Successfully Fetched Your Order Details', data);
    } catch (error) {
        console.log('Error in fatching order details', error);
        next(error);
    }
};

export default {
    fetchOrderSummary,
    placeAnOrder,
    myOrders,
    mySingleOrder
};
