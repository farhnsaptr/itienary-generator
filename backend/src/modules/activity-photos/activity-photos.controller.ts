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

  static async proxyDownload(req: Request, res: Response) {
    const imageUrl = req.query.url as string;
    const isDownload = req.query.download === "true";
    const filename = (req.query.filename as string) || "foto.jpg";

    if (!imageUrl) {
      res.status(400).json({ success: false, message: "URL gambar wajib diisi" });
      return;
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        return;
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      const buffer = Buffer.from(await response.arrayBuffer());

      const origin = req.headers.origin;
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

      if (isDownload) {
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
      }

      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Gagal mengambil gambar: " + err.message });
    }
  }
}
