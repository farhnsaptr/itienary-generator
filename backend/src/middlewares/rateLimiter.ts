import rateLimit from "express-rate-limit";

/**
 * Global rate limiter untuk seluruh endpoint API
 */
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 300, // Maksimal 300 request per IP dalam 15 menit
  standardHeaders: true, // Mengirimkan header RateLimit-*
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan ke server. Silakan coba lagi dalam beberapa menit.",
  },
});

/**
 * Strict rate limiter khusus endpoint sensitive (login, register, refresh)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 20 percobaan login/register per IP dalam 15 menit (mencegah brute force)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login/registrasi. Silakan coba lagi dalam 15 menit.",
  },
});
