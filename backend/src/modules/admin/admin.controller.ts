import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export class AdminController {
  static async getUsers(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);

    const result = await AdminService.getAllUsers(search, page, limit);

    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  }

  static async updateUserStatus(req: Request, res: Response) {
    const targetUserId = req.params.id as string;
    const updatedUser = await AdminService.updateUserStatus(targetUserId, req.body);

    return res.status(200).json({
      success: true,
      message: "Status pengguna berhasil diperbarui",
      data: updatedUser,
    });
  }

  static async getTripsOverview(_req: Request, res: Response) {
    const trips = await AdminService.getAllTripsOverview();

    return res.status(200).json({
      success: true,
      data: trips,
    });
  }
}
