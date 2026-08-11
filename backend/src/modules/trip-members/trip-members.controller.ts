import { Request, Response } from "express";
import { TripMembersService } from "./trip-members.service";

export class TripMembersController {
  static async getMembers(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.tripId as string;

    const members = await TripMembersService.getMembers(tripId, userId);

    return res.status(200).json({
      success: true,
      data: members,
    });
  }

  static async addMember(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.tripId as string;

    const newMember = await TripMembersService.addMember(tripId, userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Anggota berhasil ditambahkan",
      data: newMember,
    });
  }

  static async removeMember(req: Request, res: Response) {
    const userId = req.user!.userId;
    const tripId = req.params.tripId as string;
    const targetUserId = req.params.targetUserId as string;

    await TripMembersService.removeMember(tripId, userId, targetUserId);

    return res.status(200).json({
      success: true,
      message: "Anggota berhasil dikeluarkan dari trip",
    });
  }
}
