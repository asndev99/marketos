import { paginationMeta } from '../../../Common/Interface';
import { IUserOrder, IOrderProduct, IOrderProductStatusHistory, IPaymentTransaction } from '../interface';
import { IUserOrderDocument, IOrderProductDocument, IOrderProductStatusHistoryDocumemnt, IPaymentTransactionDocument } from '../order.model';
import { FilterQuery, Types } from 'mongoose';

export interface IOrderRepository{
}