import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface DecodedTokenInfo {

  email: string;
 
}

declare global {
  namespace Express {
    interface Request {
      userInfo?: DecodedTokenInfo;
    }
  }
}
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(400).json({
      success: false,
      message: "Access denied no token provided. Please Login to continue",
    });
    return;
  }

  try {
    const decodedTokenInfo = jwt.verify(
      token,
      process.env.JWT_SECRETKEY!
    ) as DecodedTokenInfo;

    req.userInfo = decodedTokenInfo;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Access denied, token verification failed. Please log in to continue.",
    });
  }
};

export default authMiddleware;
