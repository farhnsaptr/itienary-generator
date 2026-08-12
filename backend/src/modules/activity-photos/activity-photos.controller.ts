import { Request, Response } from "express";
import { ActivityPhotosService } from "./activity-photos.service";
import { getFromR2 } from "../../lib/r2Client";
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

    const files: Express.Multer.File[] = [];
    if (req.files && Array.isArray(req.files)) {
      files.push(...req.files);
    } else if (req.files && typeof req.files === "object") {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) files.push(...fileArray);
      });
    } else if (req.file) {
      files.push(req.file);
    }

    if (files.length === 0) {
      const err: CustomError = new Error("File foto tidak ditemukan");
      err.statusCode = 400;
      throw err;
    }

    const photos = await ActivityPhotosService.uploadMultiplePhotos(
      activityId,
      userId,
      files,
      req.body.caption
    );

    return res.status(201).json({
      success: true,
      message: `${photos.length} foto berhasil diunggah`,
      data: photos,
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
    const objectKey = req.query.key as string;
    const isDownload = req.query.download === "true";
    const filename = (req.query.filename as string) || "foto.jpg";

    if (!imageUrl && !objectKey) {
      res.status(400).json({ success: false, message: "URL atau Key gambar wajib diisi" });
      return;
    }

    // Extract R2 object key from URL if not explicitly provided
    let key = objectKey;
    if (!key && imageUrl) {
      const match = imageUrl.match(/uploads\/.+/);
      if (match) {
        key = match[0];
      }
    }

    try {
      let buffer: Buffer | null = null;
      let contentType = "image/jpeg";

      // 1. Try reading directly from Cloudflare R2 via private S3 API first
      if (key) {
        const r2Data = await getFromR2(key);
        if (r2Data) {
          buffer = r2Data.buffer;
          contentType = r2Data.contentType;
        }
      }

      // 2. Fallback to HTTP fetch if S3 API read was unavailable
      if (!buffer && imageUrl) {
        const response = await fetch(imageUrl);
        if (response.ok) {
          contentType = response.headers.get("content-type") || "image/jpeg";
          buffer = Buffer.from(await response.arrayBuffer());
        }
      }

      if (!buffer) {
        res.status(404).json({ success: false, message: "Gambar tidak ditemukan" });
        return;
      }

      const origin = req.headers.origin;
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");

      if (isDownload) {
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
      }

      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Gagal mengambil gambar: " + err.message });
    }
  }
}
