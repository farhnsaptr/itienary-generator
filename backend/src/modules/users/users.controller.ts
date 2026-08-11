import { Request, Response } from "express";
import { UsersService } from "./users.service";

export class UsersController {
  static async searchUsers(req: Request, res: Response) {
    const query = req.query.q as string;
    const currentUserId = req.user!.userId;

    const users = await UsersService.searchUsers(query, currentUserId);

    return res.status(200).json({
      success: true,
      data: users,
    });
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const updatedUser = await UsersService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: updatedUser,
    });
  }
}
