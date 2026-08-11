import { Router } from "express";
import multer from "multer";
import { ActivityPhotosController } from "./activity-photos.controller";
import { uploadPhotoSchema, deletePhotoSchema } from "./activity-photos.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB photo limit
});

export const activityPhotosRouter = Router({ mergeParams: true });
activityPhotosRouter.use(authGuard);

/**
 * @swagger
 * /activities/{activityId}/photos:
 *   get:
 *     summary: Ambil daftar foto untuk kegiatan
 *     tags: [Activity Photos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar foto kegiatan
 *   post:
 *     summary: Upload foto ke kegiatan (disimpan di R2)
 *     tags: [Activity Photos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               caption:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Foto berhasil diunggah
 */
activityPhotosRouter.get("/", asyncHandler(ActivityPhotosController.getPhotos));
activityPhotosRouter.post(
  "/",
  upload.single("photo"),
  validate(uploadPhotoSchema),
  asyncHandler(ActivityPhotosController.uploadPhoto)
);

export const directPhotosRouter = Router();
directPhotosRouter.use(authGuard);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Hapus foto kegiatan (dihapus dari DB dan R2)
 *     tags: [Activity Photos]
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
 *         description: Foto berhasil dihapus
 */
directPhotosRouter.delete("/:id", validate(deletePhotoSchema), asyncHandler(ActivityPhotosController.deletePhoto));
