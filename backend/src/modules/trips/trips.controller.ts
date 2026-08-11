import { Request, Response } from "express";
import { TripsService } from "./trips.service";

export class TripsController {
  static async getUserTrips(req: Request, res: Response) {
    const userId = req.user!.userId;
    const trips = await TripsService.getUserTrips(userId);

    return res.status(200).json({
      success: true,
      data: trips,
    });
  }

  static async createTrip(req: Request, res: Response) {
    const userId = req.user!.userId;
    const coverFile = req.file
      ? { buffer: req.file.buffer, mimetype: req.file.mimetype }
      : undefined;

    const trip = await TripsService.createTrip(userId, req.body, coverFile);

    return res.status(201).json({
      success: true,
      message: "Trip berhasil dibuat",
      data: trip,
    });
  }

  static async getTripById(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.id as string;

    const trip = await TripsService.getTripById(tripId, userId);

    return res.status(200).json({
      success: true,
      data: trip,
    });
  }

  static async updateTrip(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.id as string;
    const coverFile = req.file
      ? { buffer: req.file.buffer, mimetype: req.file.mimetype }
      : undefined;

    const trip = await TripsService.updateTrip(tripId, userId, req.body, coverFile);

    return res.status(200).json({
      success: true,
      message: "Trip berhasil diperbarui",
      data: trip,
    });
  }

  static async deleteTrip(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.id as string;

    await TripsService.deleteTrip(tripId, userId);

    return res.status(200).json({
      success: true,
      message: "Trip berhasil dihapus",
    });
  }
}
