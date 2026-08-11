import { Request, Response } from "express";
import { ActivitiesService } from "./activities.service";

export class ActivitiesController {
  static async getTripActivities(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.tripId as string;
    const filterDate = req.query.date as string | undefined;

    const activities = await ActivitiesService.getTripActivities(tripId, userId, filterDate);

    return res.status(200).json({
      success: true,
      data: activities,
    });
  }

  static async createActivity(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.tripId as string;

    const activity = await ActivitiesService.createActivity(tripId, userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Kegiatan berhasil ditambahkan",
      data: activity,
    });
  }

  static async getActivityById(req: Request, res: Response) {
    const userId = req.user!.userId;
    const activityId = req.params.id as string;

    const activity = await ActivitiesService.getActivityById(activityId, userId);

    return res.status(200).json({
      success: true,
      data: activity,
    });
  }

  static async updateActivity(req: Request, res: Response) {
    const userId = req.user!.userId;
    const activityId = req.params.id as string;

    const activity = await ActivitiesService.updateActivity(activityId, userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Kegiatan berhasil diperbarui",
      data: activity,
    });
  }

  static async deleteActivity(req: Request, res: Response) {
    const userId = req.user!.userId;
    const activityId = req.params.id as string;

    await ActivitiesService.deleteActivity(activityId, userId);

    return res.status(200).json({
      success: true,
      message: "Kegiatan berhasil dihapus",
    });
  }
}
