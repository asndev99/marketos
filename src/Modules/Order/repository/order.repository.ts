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
    async allOrdersForCompany(companyId: string): Promise<IOrderProductPopulatedDocument[]> {
        return OrderProductModel.find({ companyId })
            .populate({
                path: 'paymentTransaction',
            })
            .lean<IOrderProductPopulatedDocument[]>()
            .exec();
    }
}
