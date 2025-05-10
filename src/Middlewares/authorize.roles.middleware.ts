import { NextFunction } from "express";
import { UserRole } from "../Common/constants";
import { AuthRequest } from "../Common/Interface";
import { UnauthorizedError } from "../Utils/Error";

export const authorizeRole = (role: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      throw new UnauthorizedError("You Are Not Allowed To Access This Route");
    }else {
      next();
    }
  };
};
