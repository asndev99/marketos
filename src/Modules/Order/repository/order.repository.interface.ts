import { paginationMeta } from '../../../Common/Interface';
import { IUserOrder, IOrderProduct, IPaymentTransaction, IUserOrderPopulatedDocument, IOrderProductPopulatedDocument } from '../interface';
import { IUserOrderDocument, IOrderProductDocument, IPaymentTransactionDocument, OrderProductModel } from '../order.model';
import { FilterQuery, Types, ClientSession } from 'mongoose';
import {orderUpdateValidation} from '../../Company/interface';

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
    singleOrder(payload: FilterQuery<IUserOrderDocument>): Promise<IUserOrderPopulatedDocument>;
    allOrdersForCompany(payload: string): Promise<IUserOrderPopulatedDocument[]>;
    singleOrderForCompany(orderId: string, companyId: string): Promise<IUserOrderPopulatedDocument>;
    orderUpdateForCompany(payload: orderUpdateValidation[]): Promise<Boolean>
    orderIds(payload: string): Promise<string[]>;
    companyAnalyticsOrders(payload: string): Promise<IOrderProductDocument[]>;
    shopOrderAnalytics(payload: string[]): Promise<IOrderProductDocument[]>;
    updateOrderForShop(orderId: string, status: string): Promise<any>;
}