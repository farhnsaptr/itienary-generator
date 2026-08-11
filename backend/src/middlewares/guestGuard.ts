import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

/**
 * Middleware untuk memblokir akses ke route khusus tamu (seperti login & register)
 * jika pengguna sudah memiliki access token yang masih valid.
 */
export const guestGuard = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      verifyAccessToken(token);
      return res.status(400).json({
        success: false,
        message: "Anda sudah terlogin. Silakan logout terlebih dahulu jika ingin masuk dengan akun lain.",
      });
    } catch (_err) {
      // Jika token expired/invalid, abaikan dan izinkan lanjut login/register
    }
  }

  next();
};
