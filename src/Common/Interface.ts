import { IUser } from "../Modules/User/interface";

export interface AuthRequest extends Request {
  user: IUser;
}
