import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const isProduction = process.env.NODE_ENV === "production";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 menit
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth/refresh",
  });
}

export class AuthController {
  static async register(_req: Request, res: Response) {
    return res.status(403).json({
      success: false,
      message: "Pendaftaran mandiri tidak diizinkan. Pengguna hanya dapat dibuat oleh Admin.",
    });
  }

  static async login(req: Request, res: Response) {
    const userAgent = req.headers["user-agent"];
    const oldRefreshToken = req.cookies?.refreshToken;
    const result = await AuthService.login(req.body, userAgent, oldRefreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token tidak ditemukan",
      });
    }

    const result = await AuthService.refresh(refreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token berhasil diperbarui",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    await AuthService.logout(refreshToken);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  }

  static async getMe(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await AuthService.getMe(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
}
