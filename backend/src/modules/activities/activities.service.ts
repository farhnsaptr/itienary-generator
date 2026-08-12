import { supabase } from "../../lib/supabase";
import { deleteFromR2 } from "../../lib/r2Client";
import { TripsService } from "../trips/trips.service";
import { CreateActivityInput, UpdateActivityInput, Activity } from "./activities.types";
import { CustomError } from "../../middlewares/errorHandler";

export class ActivitiesService {
  static async getTripActivities(tripId: string, userId: string, filterDate?: string) {
    const permissions = await TripsService.getUserTripPermissions(tripId, userId);
    if (!permissions) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    let query = supabase
      .from("activities")
      .select("*, activity_photos(id, photo_url, r2_key, caption, uploaded_by, created_at)")
      .eq("trip_id", tripId)
      .order("activity_date", { ascending: true })
      .order("start_time", { ascending: true })
      .order("sort_order", { ascending: true });

    if (filterDate) {
      query = query.eq("activity_date", filterDate);
    }

    const { data: activities, error } = await query;

    if (error) {
      const err: CustomError = new Error("Gagal mengambil daftar kegiatan: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return activities as Activity[];
  }

  static async createActivity(tripId: string, userId: string, input: CreateActivityInput) {
    const permissions = await TripsService.getUserTripPermissions(tripId, userId);
    if (!permissions) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    if (!permissions.can_manage_activities) {
      const err: CustomError = new Error("Anda hanya memiliki izin melihat kegiatan (tidak dapat menambah kegiatan)");
      err.statusCode = 403;
      throw err;
    }

    const { data: trip } = await supabase
      .from("trips")
      .select("start_date, end_date")
      .eq("id", tripId)
      .single();

    if (!trip) {
      const err: CustomError = new Error("Trip tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const actDate = new Date(input.activity_date);
    const tripStart = new Date(trip.start_date);
    const tripEnd = new Date(trip.end_date);

    if (actDate < tripStart || actDate > tripEnd) {
      const err: CustomError = new Error(
        `Tanggal kegiatan (${input.activity_date}) harus berada dalam rentang tanggal trip (${trip.start_date} s/d ${trip.end_date})`
      );
      err.statusCode = 400;
      throw err;
    }

    const { data: newActivity, error } = await supabase
      .from("activities")
      .insert({
        trip_id: tripId,
        title: input.title,
        description: input.description || null,
        location: input.location || null,
        location_url: input.location_url || null,
        activity_date: input.activity_date,
        start_time: input.start_time,
        end_time: input.end_time,
        icon: input.icon || "map-pin",
        color: input.color || "#f97316",
        sort_order: input.sort_order ?? 0,
        created_by: userId,
      })
      .select("*, activity_photos(*)")
      .single();

    if (error || !newActivity) {
      const err: CustomError = new Error("Gagal membuat kegiatan: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return newActivity as Activity;
  }

  static async getActivityById(activityId: string, userId: string) {
    const { data: activity, error } = await supabase
      .from("activities")
      .select("*, activity_photos(id, photo_url, r2_key, caption, uploaded_by, created_at)")
      .eq("id", activityId)
      .single();

    if (error || !activity) {
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

    return activity as Activity;
  }

  static async updateActivity(activityId: string, userId: string, input: UpdateActivityInput) {
    const { data: existingActivity } = await supabase
      .from("activities")
      .select("trip_id, start_time, end_time")
      .eq("id", activityId)
      .single();

    if (!existingActivity) {
      const err: CustomError = new Error("Kegiatan tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const permissions = await TripsService.getUserTripPermissions(existingActivity.trip_id, userId);
    if (!permissions || !permissions.can_manage_activities) {
      const err: CustomError = new Error("Anda tidak memiliki izin untuk mengubah kegiatan ini");
      err.statusCode = 403;
      throw err;
    }

    const startTime = input.start_time || existingActivity.start_time;
    const endTime = input.end_time || existingActivity.end_time;
    if (endTime === startTime) {
      const err: CustomError = new Error("Jam selesai (end_time) tidak boleh sama dengan jam mulai (start_time)");
      err.statusCode = 400;
      throw err;
    }

    if (input.activity_date) {
      const { data: trip } = await supabase
        .from("trips")
        .select("start_date, end_date")
        .eq("id", existingActivity.trip_id)
        .single();

      if (trip) {
        const actDate = new Date(input.activity_date);
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);

        if (actDate < tripStart || actDate > tripEnd) {
          const err: CustomError = new Error(
            `Tanggal kegiatan (${input.activity_date}) harus berada dalam rentang tanggal trip (${trip.start_date} s/d ${trip.end_date})`
          );
          err.statusCode = 400;
          throw err;
        }
      }
    }

    const { data: updatedActivity, error } = await supabase
      .from("activities")
      .update(input)
      .eq("id", activityId)
      .select("*, activity_photos(*)")
      .single();

    if (error || !updatedActivity) {
      const err: CustomError = new Error("Gagal memperbarui kegiatan: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return updatedActivity as Activity;
  }

  static async deleteActivity(activityId: string, userId: string) {
    const { data: existingActivity } = await supabase
      .from("activities")
      .select("trip_id")
      .eq("id", activityId)
      .single();

    if (!existingActivity) {
      const err: CustomError = new Error("Kegiatan tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    const permissions = await TripsService.getUserTripPermissions(existingActivity.trip_id, userId);
    if (!permissions || !permissions.can_manage_activities) {
      const err: CustomError = new Error("Anda tidak memiliki izin untuk menghapus kegiatan ini");
      err.statusCode = 403;
      throw err;
    }

    const { data: photos } = await supabase
      .from("activity_photos")
      .select("r2_key")
      .eq("activity_id", activityId);

    if (photos) {
      for (const p of photos) {
        if (p.r2_key) await deleteFromR2(p.r2_key);
      }
    }

    const { error } = await supabase.from("activities").delete().eq("id", activityId);

    if (error) {
      const err: CustomError = new Error("Gagal menghapus kegiatan: " + error.message);
      err.statusCode = 500;
      throw err;
    }
  }
}
