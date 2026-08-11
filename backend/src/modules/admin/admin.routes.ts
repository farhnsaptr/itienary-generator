import { Router } from "express";
import { AdminController } from "./admin.controller";
import { getUsersSchema, updateUserStatusSchema } from "./admin.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { adminGuard } from "../../middlewares/adminGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Protect all admin routes with authGuard AND adminGuard
router.use(authGuard, adminGuard);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Ambil daftar seluruh pengguna (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar pengguna dan pagination
 */
router.get("/users", validate(getUsersSchema), asyncHandler(AdminController.getUsers));

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update status aktif/role pengguna (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Status pengguna diperbarui
 */
router.patch("/users/:id/status", validate(updateUserStatusSchema), asyncHandler(AdminController.updateUserStatus));

/**
 * @swagger
 * /admin/trips:
 *   get:
 *     summary: Ambil overview seluruh trip sistem (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Ringkasan trip dari view admin_trip_overview
 */
router.get("/trips", asyncHandler(AdminController.getTripsOverview));

export default router;
