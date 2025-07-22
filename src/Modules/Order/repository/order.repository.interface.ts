import { paginationMeta } from '../../../Common/Interface';
import { IUserOrder, IOrderProduct, IPaymentTransaction, IUserOrderPopulatedDocument, IOrderProductPopulatedDocument } from '../interface';
import { IUserOrderDocument, IOrderProductDocument, IPaymentTransactionDocument } from '../order.model';
import { FilterQuery, Types, ClientSession } from 'mongoose';

export interface FindManyOptions {
    // filter?: FilterQuery<IProductDocument>;
    page?: number;
    limit?: number;
    // sortBy?: keyof IProductDocument;
    sortOrder?: 'asc' | 'desc';
}

export interface IOrderRepository{
    createOrder(data: IUserOrder, session: ClientSession): Promise<IUserOrderDocument>;
    createOrderProduct(data: IOrderProduct[], session: ClientSession): Promise<IOrderProductDocument[]>;
    createPaymentTransaction(data: IPaymentTransaction[], session: ClientSession): Promise<IPaymentTransactionDocument[]>;
    allOrders(payload: FilterQuery<IUserOrderDocument>): Promise<IUserOrderPopulatedDocument[]>;
    singleOrder(payload: FilterQuery<IUserOrderDocument>): Promise<IUserOrderPopulatedDocument | null>;
    allOrdersForCompany(payload: string): Promise<IUserOrderPopulatedDocument[]>;
}