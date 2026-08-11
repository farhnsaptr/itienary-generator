import { Request, Response } from "express";
import { ActivityPhotosService } from "./activity-photos.service";
import { CustomError } from "../../middlewares/errorHandler";

export class ActivityPhotosController {
  static async getPhotos(req: Request, res: Response) {
    const userId = req.user!.userId;
    const activityId = req.params.activityId as string;

    const photos = await ActivityPhotosService.getPhotosByActivity(activityId, userId);

    return res.status(200).json({
      success: true,
      data: photos,
    });
  }

  static async uploadPhoto(req: Request, res: Response) {
    const userId = req.user!.userId;
    const activityId = req.params.activityId as string;

    if (!req.file) {
      const err: CustomError = new Error("File foto tidak ditemukan");
      err.statusCode = 400;
      throw err;
    }

    const photo = await ActivityPhotosService.uploadPhoto(
      activityId,
      userId,
      req.file.buffer,
      req.file.mimetype,
      req.body.caption
    );

    return res.status(201).json({
      success: true,
      message: "Foto berhasil diunggah",
      data: photo,
    });
  }

  static async deletePhoto(req: Request, res: Response) {
    const userId = req.user!.userId;
    const photoId = req.params.id as string;

    await ActivityPhotosService.deletePhoto(photoId, userId);

    return res.status(200).json({
      success: true,
      message: "Foto berhasil dihapus",
    });
  }
}
