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

  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id as string;
    const user = await AdminService.getUserById(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  }

  static async createUser(req: Request, res: Response) {
    const newUser = await AdminService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Pengguna baru berhasil dibuat",
      data: newUser,
    });
  }

  static async updateUser(req: Request, res: Response) {
    const userId = req.params.id as string;
    const updatedUser = await AdminService.updateUser(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Data pengguna berhasil diperbarui",
      data: updatedUser,
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

  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.id as string;
    await AdminService.deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "Pengguna berhasil dihapus",
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
