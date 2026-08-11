import { Router } from "express";
import multer from "multer";
import { TripsController } from "./trips.controller";
import { createTripSchema, updateTripSchema, getTripByIdSchema } from "./trips.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

router.use(authGuard);

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Ambil daftar trip pengguna (sebagai owner maupun member)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Daftar trip ditemukan
 *   post:
 *     summary: Buat trip baru
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, start_date, end_date]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 example: "2026-09-01"
 *               end_date:
 *                 type: string
 *                 example: "2026-09-05"
 *               theme_color:
 *                 type: string
 *                 example: "#6366f1"
 *               cover_file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Trip berhasil dibuat
 */
router.get("/", asyncHandler(TripsController.getUserTrips));
router.post(
  "/",
  upload.single("cover_file"),
  validate(createTripSchema),
  asyncHandler(TripsController.createTrip)
);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Ambil detail trip berdasarkan ID
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail trip
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: Trip tidak ditemukan
 *   put:
 *     summary: Update trip (hanya owner)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               theme_color:
 *                 type: string
 *               cover_file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Trip berhasil diperbarui
 *   delete:
 *     summary: Hapus trip (hanya owner)
 *     tags: [Trips]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip berhasil dihapus
 */
router.get("/:id", validate(getTripByIdSchema), asyncHandler(TripsController.getTripById));
router.put(
  "/:id",
  upload.single("cover_file"),
  validate(updateTripSchema),
  asyncHandler(TripsController.updateTrip)
);
router.delete("/:id", validate(getTripByIdSchema), asyncHandler(TripsController.deleteTrip));

export default router;
