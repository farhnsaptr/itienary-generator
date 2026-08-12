import { Request, Response } from "express";
import { NotificationsService } from "./notifications.service";

export class NotificationsController {
  static async getNotifications(req: Request, res: Response) {
    const userId = req.user!.userId;
    const notifications = await NotificationsService.getUserNotifications(userId);
    const unreadCount = await NotificationsService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  }

  static async respondInvitation(req: Request, res: Response) {
    const userId = req.user!.userId;
    const notificationId = req.params.id as string;
    const { status } = req.body;

    const result = await NotificationsService.respondToInvitation(userId, notificationId, status);

    return res.status(200).json(result);
  }
}
