import { Router } from "express";
import { ActivitiesController } from "./activities.controller";
import {
  createActivitySchema,
  updateActivitySchema,
  getActivityByIdSchema,
  getTripActivitiesSchema,
} from "./activities.validation";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";

// Router for /trips/:tripId/activities
export const tripActivitiesRouter = Router({ mergeParams: true });
tripActivitiesRouter.use(authGuard);

/**
 * @swagger
 * /trips/{tripId}/activities:
 *   get:
 *     summary: Ambil daftar kegiatan dalam trip
 *     tags: [Activities]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filter tanggal (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daftar kegiatan
 *   post:
 *     summary: Tambah kegiatan dalam trip
 *     tags: [Activities]
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
 *             required: [title, activity_date, start_time, end_time]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               activity_date:
 *                 type: string
 *                 example: "2026-09-02"
 *               start_time:
 *                 type: string
 *                 example: "13:00"
 *               end_time:
 *                 type: string
 *                 example: "15:00"
 *               icon:
 *                 type: string
 *                 example: "umbrella"
 *               color:
 *                 type: string
 *                 example: "#f97316"
 *               sort_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Kegiatan berhasil ditambahkan
 */
tripActivitiesRouter.get("/", validate(getTripActivitiesSchema), asyncHandler(ActivitiesController.getTripActivities));
tripActivitiesRouter.post("/", validate(createActivitySchema), asyncHandler(ActivitiesController.createActivity));

// Direct router for /activities/:id
export const activitiesRouter = Router();
activitiesRouter.use(authGuard);

/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Ambil detail kegiatan berdasarkan ID
 *     tags: [Activities]
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
 *         description: Detail kegiatan
 *   put:
 *     summary: Update kegiatan
 *     tags: [Activities]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               activity_date:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               sort_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kegiatan berhasil diperbarui
 *   delete:
 *     summary: Hapus kegiatan
 *     tags: [Activities]
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
 *         description: Kegiatan berhasil dihapus
 */
activitiesRouter.get("/:id", validate(getActivityByIdSchema), asyncHandler(ActivitiesController.getActivityById));
activitiesRouter.put("/:id", validate(updateActivitySchema), asyncHandler(ActivitiesController.updateActivity));
activitiesRouter.delete("/:id", validate(getActivityByIdSchema), asyncHandler(ActivitiesController.deleteActivity));
