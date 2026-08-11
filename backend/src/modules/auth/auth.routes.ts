import { Router } from "express";
import { AuthController } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { guestGuard } from "../../middlewares/guestGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi error atau email/username sudah digunakan
 */
router.post("/register", guestGuard, validate(registerSchema), asyncHandler(AuthController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmail, password]
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, cookie diset
 *       401:
 *         description: Kredensial tidak valid
 */
router.post("/login", guestGuard, validate(loginSchema), asyncHandler(AuthController.login));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token menggunakan refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 *       401:
 *         description: Refresh token tidak valid atau kedaluwarsa
 */
router.post("/refresh", asyncHandler(AuthController.refresh));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout pengguna dan hapus cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post("/logout", authGuard, asyncHandler(AuthController.logout));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Ambil profil pengguna saat ini
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Data profil pengguna
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authGuard, asyncHandler(AuthController.getMe));

export default router;
