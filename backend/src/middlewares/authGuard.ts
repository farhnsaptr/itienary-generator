import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token missing",
      });
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired access token",
    });
  }
};
