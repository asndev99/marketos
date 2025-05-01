import * as express from "express";
import { AuthUser } from "../Common/Interface";
import { IUser } from "../Modules/User/interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
