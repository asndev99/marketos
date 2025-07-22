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
    ): Promise<IUserOrderPopulatedDocument | null> {
        return UserOrderModel.findOne({ ...payload })
            .populate({
                path: 'orderProducts',
                populate: {
                    path: 'paymentTransaction',
                },
            })
            .lean<IUserOrderPopulatedDocument>()
            .exec();
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
}
