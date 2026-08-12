import { supabase } from "../../lib/supabase";
import { uploadToR2, deleteFromR2 } from "../../lib/r2Client";
import { TripsService } from "../trips/trips.service";
import { CustomError } from "../../middlewares/errorHandler";
import { ActivityPhoto } from "./activity-photos.types";

export class ActivityPhotosService {
  static async getPhotosByActivity(activityId: string, userId: string) {
    const { data: activity } = await supabase
      .from("activities")
      .select("trip_id")
      .eq("id", activityId)
      .single();

    if (!activity) {
      const err: CustomError = new Error("Kegiatan tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const permissions = await TripsService.getUserTripPermissions(activity.trip_id, userId);
    if (!permissions) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke foto kegiatan ini");
      err.statusCode = 403;
      throw err;
    }

    const { data: photos, error } = await supabase
      .from("activity_photos")
      .select("*")
      .eq("activity_id", activityId)
      .order("created_at", { ascending: true });

    if (error) {
      const err: CustomError = new Error("Gagal mengambil foto kegiatan: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return photos as ActivityPhoto[];
  }

  static async uploadPhoto(
    activityId: string,
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
    caption?: string
  ) {
    const { data: activity } = await supabase
      .from("activities")
      .select("trip_id")
      .eq("id", activityId)
      .single();

    if (!activity) {
      const err: CustomError = new Error("Kegiatan tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const permissions = await TripsService.getUserTripPermissions(activity.trip_id, userId);
    if (!permissions) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke kegiatan ini");
      err.statusCode = 403;
      throw err;
    }

    if (!permissions.can_manage_photos) {
      const err: CustomError = new Error("Anda hanya memiliki izin melihat foto (tidak dapat mengunggah foto)");
      err.statusCode = 403;
      throw err;
    }

    // Cloudflare R2 Folder structure: uploads/trips/<trip_id>/activities/<activity_id>/
    const r2FolderPrefix = `uploads/trips/${activity.trip_id}/activities/${activityId}`;
    const { url, key } = await uploadToR2(fileBuffer, mimeType, r2FolderPrefix);

    const { data: newPhoto, error } = await supabase
      .from("activity_photos")
      .insert({
        activity_id: activityId,
        photo_url: url,
        r2_key: key,
        caption: caption || null,
        uploaded_by: userId,
      })
      .select()
      .single();

    if (error || !newPhoto) {
      await deleteFromR2(key);
      const err: CustomError = new Error("Gagal menyimpan foto kegiatan: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return newPhoto as ActivityPhoto;
  }

  static async uploadMultiplePhotos(
    activityId: string,
    userId: string,
    files: { buffer: Buffer; mimetype: string }[],
    caption?: string
  ) {
    const { data: activity } = await supabase
      .from("activities")
      .select("trip_id")
      .eq("id", activityId)
      .single();

    if (!activity) {
      const err: CustomError = new Error("Kegiatan tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const permissions = await TripsService.getUserTripPermissions(activity.trip_id, userId);
    if (!permissions || !permissions.can_manage_photos) {
      const err: CustomError = new Error("Anda tidak memiliki akses untuk mengunggah foto ke kegiatan ini");
      err.statusCode = 403;
      throw err;
    }

    const r2FolderPrefix = `uploads/trips/${activity.trip_id}/activities/${activityId}`;

    // Upload all files to Cloudflare R2 in parallel
    const uploadPromises = files.map((file) =>
      uploadToR2(file.buffer, file.mimetype, r2FolderPrefix)
    );
    const r2Results = await Promise.all(uploadPromises);

    // Prepare DB insert rows
    const rowsToInsert = r2Results.map((r2) => ({
      activity_id: activityId,
      photo_url: r2.url,
      r2_key: r2.key,
      caption: caption || null,
      uploaded_by: userId,
    }));

    const { data: newPhotos, error } = await supabase
      .from("activity_photos")
      .insert(rowsToInsert)
      .select();

    if (error || !newPhotos) {
      await Promise.all(r2Results.map((r2) => deleteFromR2(r2.key)));
      const err: CustomError = new Error("Gagal menyimpan foto kegiatan: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return newPhotos as ActivityPhoto[];
  }

  static async deletePhoto(photoId: string, userId: string) {
    const { data: photo } = await supabase
      .from("activity_photos")
      .select("activity_id, r2_key")
      .eq("id", photoId)
      .single();

    if (!photo) {
      const err: CustomError = new Error("Foto tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const { data: activity } = await supabase
      .from("activities")
      .select("trip_id")
      .eq("id", photo.activity_id)
      .single();

    if (activity) {
      const permissions = await TripsService.getUserTripPermissions(activity.trip_id, userId);
      if (!permissions || !permissions.can_manage_photos) {
        const err: CustomError = new Error("Anda tidak memiliki izin untuk menghapus foto ini");
        err.statusCode = 403;
        throw err;
      }
    }

    if (photo.r2_key) {
      await deleteFromR2(photo.r2_key);
    }

    const { error } = await supabase.from("activity_photos").delete().eq("id", photoId);

    if (error) {
      const err: CustomError = new Error("Gagal menghapus foto: " + error.message);
      err.statusCode = 500;
      throw err;
    }
  }
}
