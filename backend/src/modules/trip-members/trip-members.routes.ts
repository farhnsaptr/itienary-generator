import { Router } from "express";
import { TripMembersController } from "./trip-members.controller";
import { addMemberSchema, removeMemberSchema, getMembersSchema } from "./trip-members.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router({ mergeParams: true });

router.use(authGuard);

/**
 * @swagger
 * /trips/{tripId}/members:
 *   get:
 *     summary: Ambil daftar anggota trip
 *     tags: [Trip Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar anggota trip
 *   post:
 *     summary: Tambah anggota ke trip (hanya owner)
 *     tags: [Trip Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmailOrId]
 *             properties:
 *               usernameOrEmailOrId:
 *                 type: string
 *                 description: Username, email, atau UUID user yang diundang
 *     responses:
 *       201:
 *         description: Anggota berhasil ditambahkan
 */
router.get("/", validate(getMembersSchema), asyncHandler(TripMembersController.getMembers));
router.post("/", validate(addMemberSchema), asyncHandler(TripMembersController.addMember));

/**
 * @swagger
 * /trips/{tripId}/members/{targetUserId}:
 *   delete:
 *     summary: Keluarkan anggota dari trip / Keluar dari trip
 *     tags: [Trip Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Anggota berhasil dikeluarkan
 */
router.delete("/:targetUserId", validate(removeMemberSchema), asyncHandler(TripMembersController.removeMember));

export default router;
