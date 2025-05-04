import { IUserDocument } from "../Modules/User/user.model";

export interface AuthRequest extends Request {
  user: IUserDocument;
}
