import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../Configs/env.config";

const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "7d";

const generateAccessToken = (payload: { _id: string; role: string }) => {
  return jwt.sign({ id: payload._id, role: payload.role }, JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (payload: { _id: string; role: string }) => {
  return jwt.sign(
    { id: payload._id, role: payload.role },
    JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

const TokenService = {
  generateAccessToken,
  generateRefreshToken,
};

export default TokenService;
