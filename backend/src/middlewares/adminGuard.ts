import { Request, Response, NextFunction } from "express";

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User context missing",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin privilege required",
    });
  }

  next();
};
