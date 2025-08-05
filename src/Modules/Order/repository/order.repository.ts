import { paginationMeta } from '../../../Common/Interface';
import {
    IOrderProduct,
    IUserOrder,
    IPaymentTransaction,
    IUserOrderPopulatedDocument,
    IOrderProductPopulatedDocument,
} from '../interface';
import {
    IUserOrderDocument,
    UserOrderModel,
    IOrderProductDocument,
    OrderProductModel,
    IPaymentTransactionDocument,
    PaymentTransactionModel,
} from '../order.model';
import { FindManyOptions, IOrderRepository } from './order.repository.interface';
import { FilterQuery, Types, ClientSession } from 'mongoose';
import { orderUpdateValidation } from '../../Company/interface';

export class MongoOrderRepository implements IOrderRepository {
    async createOrder(data: IUserOrder, session: ClientSession): Promise<IUserOrderDocument> {
        return UserOrderModel.create([data], { session }).then((docs) => docs[0]);
    }
    async createOrderProduct(
        data: IOrderProduct[],
        session: ClientSession
    ): Promise<IOrderProductDocument[]> {
        return OrderProductModel.insertMany(data, { session });
    }
    async createPaymentTransaction(
        data: IPaymentTransaction[],
        session: ClientSession
    ): Promise<IPaymentTransactionDocument[]> {
        return PaymentTransactionModel.insertMany(data, { session });
    }
    async allOrders(
        payload: FilterQuery<IUserOrderDocument>
    ): Promise<IUserOrderPopulatedDocument[]> {
        return UserOrderModel.find({ ...payload })
            .populate({
                path: 'orderProducts',
                populate: {
                    path: 'paymentTransaction',
                },
            })
            .lean<IUserOrderPopulatedDocument[]>()
            .exec();
    }
    async singleOrder(
        payload: FilterQuery<IUserOrderDocument>
    ): Promise<IUserOrderPopulatedDocument> {
        const userOrder = await UserOrderModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(payload?.userId),
                },
            },
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderProducts',
                },
            },
            {
                $unwind: '$orderProducts',
            },
            {
                $lookup: {
                    from: 'paymenttransactions',
                    localField: 'orderProducts._id',
                    foreignField: 'orderProductId',
                    as: 'orderProducts.paymentTransaction',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.paymentTransaction',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderProducts.productId',
                    foreignField: '_id',
                    as: 'orderProducts.product',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'productimages',
                    localField: 'orderProducts.product._id',
                    foreignField: 'productId',
                    as: 'orderProducts.product.images',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    orderTime: { $first: '$orderTime' },
                    orderTimeEpoch: { $first: '$orderTimeEpoch' },
                    totalPrice: { $first: '$totalPrice' },
                    trackingNumber: { $first: '$trackingNumber' },
                    orderID: { $first: '$orderID' },
                    userId: { $first: '$userId' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    orderProducts: { $push: '$orderProducts' },
                },
            },
        ]);
        return userOrder[0];
    }

    async allOrdersForCompany(companyId: string): Promise<IUserOrderPopulatedDocument[]> {
        const userOrders = await UserOrderModel.aggregate([
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderProducts',
                },
            },
            {
                $unwind: '$orderProducts',
            },
            {
                $match: {
                    'orderProducts.companyId': new Types.ObjectId(companyId),
                },
            },
            {
                $lookup: {
                    from: 'paymenttransactions',
                    localField: 'orderProducts._id',
                    foreignField: 'orderProductId',
                    as: 'orderProducts.paymentTransaction',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.paymentTransaction',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderProducts.productId',
                    foreignField: '_id',
                    as: 'orderProducts.product',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'productimages',
                    localField: 'orderProducts.product._id',
                    foreignField: 'productId',
                    as: 'orderProducts.product.images',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    orderTime: { $first: '$orderTime' },
                    orderTimeEpoch: { $first: '$orderTimeEpoch' },
                    totalPrice: { $first: '$totalPrice' },
                    trackingNumber: { $first: '$trackingNumber' },
                    orderID: { $first: '$orderID' },
                    userId: { $first: '$userId' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    orderProducts: { $push: '$orderProducts' },
                },
            },
        ]);

        return userOrders;
    }

    async singleOrderForCompany(
        orderId: string,
        companyId: string
    ): Promise<IUserOrderPopulatedDocument> {
        const userOrder = await UserOrderModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(orderId),
                },
            },
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderProducts',
                },
            },
            {
                $unwind: '$orderProducts',
            },
            {
                $match: {
                    'orderProducts.companyId': new Types.ObjectId(companyId),
                },
            },
            {
                $lookup: {
                    from: 'paymenttransactions',
                    localField: 'orderProducts._id',
                    foreignField: 'orderProductId',
                    as: 'orderProducts.paymentTransaction',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.paymentTransaction',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderProducts.productId',
                    foreignField: '_id',
                    as: 'orderProducts.product',
                },
            },
            {
                $unwind: {
                    path: '$orderProducts.product',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'productimages',
                    localField: 'orderProducts.product._id',
                    foreignField: 'productId',
                    as: 'orderProducts.product.images',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    orderTime: { $first: '$orderTime' },
                    orderTimeEpoch: { $first: '$orderTimeEpoch' },
                    totalPrice: { $first: '$totalPrice' },
                    trackingNumber: { $first: '$trackingNumber' },
                    orderID: { $first: '$orderID' },
                    userId: { $first: '$userId' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    orderProducts: { $push: '$orderProducts' },
                },
            },
        ]);

        return userOrder[0];
    }

    async orderUpdateForCompany(payload: orderUpdateValidation[]): Promise<Boolean> {
        const operations = payload.map((item: orderUpdateValidation) => ({
            updateOne: {
                filter: { _id: item?.orderId },
                update: {
                    $set: {
                        orderStatus: item?.status,
                        deliveredQuantity: item?.quantity,
                        finalPrice: item?.price,
                        isOrderPlaced: true,
                    },
                },
            },
        }));
        const operationsPayment = payload.map((item: orderUpdateValidation) => ({
            updateOne: {
                filter: { orderProductId: item?.orderId },
                update: {
                    $set: {
                        amount: item?.price,
                    },
                },
            },
        }));
        await OrderProductModel.bulkWrite(operations);
        await PaymentTransactionModel.bulkWrite(operationsPayment);
        return true;
    }

    async companyAnalyticsOrders(companyId: string): Promise<IOrderProductDocument[]> {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return OrderProductModel.find({
            companyId: companyId,
            createdAt: { $gte: sevenDaysAgo },
        });
    }

    async orderIds(userId: string): Promise<string[]> {
        const orders = await UserOrderModel.find({ userId }).select('_id').lean();
        const ids = orders.map((order) => (order._id.toString()));
        return ids;
    }

    async shopOrderAnalytics(orderIds: string[]): Promise<IOrderProductDocument[]> {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 10);
        return OrderProductModel.find({
            orderId: {
                $in: orderIds,
            },
            createdAt: { $gte: sevenDaysAgo },
        });
    }
}
