import { Router } from "express";
import { UsersController } from "./users.controller";
import { searchUsersSchema, updateProfileSchema } from "./users.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.use(authGuard);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Cari pengguna berdasarkan username/email
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Kata kunci username atau email
 *     responses:
 *       200:
 *         description: Daftar pengguna ditemukan
 */
router.get("/search", validate(searchUsersSchema), asyncHandler(UsersController.searchUsers));

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update profil pengguna
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 */
router.put("/profile", validate(updateProfileSchema), asyncHandler(UsersController.updateProfile));

export default router;
