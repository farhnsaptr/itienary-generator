import { Router } from "express";
import { NotificationsController } from "./notifications.controller";
import { authGuard } from "../../middlewares/authGuard";
import { asyncHandler } from "../../utils/asyncHandler";
import { z } from "zod";
import { validate } from "../../middlewares/validate";

const router = Router();

router.use(authGuard);

const respondSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID notifikasi harus UUID valid"),
  }),
  body: z.object({
    status: z.enum(["accepted", "rejected"]),
  }),
});

router.get("/", asyncHandler(NotificationsController.getNotifications));
router.patch("/:id/respond", validate(respondSchema), asyncHandler(NotificationsController.respondInvitation));

export default router;
