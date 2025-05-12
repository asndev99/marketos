import { IUserDocument } from '../Modules/User/user.model';

export interface AuthRequest extends Request {
    user: IUserDocument;
}

export interface paginationMeta {
    total: Number;
    page: Number;
    limit: Number;
    totalPages: Number;
}
