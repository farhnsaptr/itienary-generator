import { supabase } from "../../lib/supabase";
import { deleteFromR2, uploadToR2 } from "../../lib/r2Client";
import { CreateTripInput, UpdateTripInput, Trip } from "./trips.types";
import { CustomError } from "../../middlewares/errorHandler";

export class TripsService {
  /**
   * Helper to verify if user is member/owner of trip
   */
  static async getUserTripRole(tripId: string, userId: string): Promise<"owner" | "member" | null> {
    const { data: member } = await supabase
      .from("trip_members")
      .select("role")
      .eq("trip_id", tripId)
      .eq("user_id", userId)
      .maybeSingle();

    return member ? (member.role as "owner" | "member") : null;
  }

  static async getUserTrips(userId: string) {
    const { data: members, error: memberError } = await supabase
      .from("trip_members")
      .select("trip_id, role")
      .eq("user_id", userId);

    if (memberError) {
      const err: CustomError = new Error("Gagal mengambil data trip: " + memberError.message);
      err.statusCode = 500;
      throw err;
    }

    if (!members || members.length === 0) {
      return [];
    }

    const tripIds = members.map((m) => m.trip_id);
    const roleMap = new Map(members.map((m) => [m.trip_id, m.role]));

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("*")
      .in("id", tripIds)
      .order("start_date", { ascending: true });

    if (tripsError) {
      const err: CustomError = new Error("Gagal mengambil detail trip: " + tripsError.message);
      err.statusCode = 500;
      throw err;
    }

    return (trips as Trip[]).map((trip) => ({
      ...trip,
      my_role: roleMap.get(trip.id),
    }));
  }

  static async createTrip(
    userId: string,
    input: CreateTripInput,
    coverFile?: { buffer: Buffer; mimetype: string }
  ) {
    let cover_image_url = input.cover_image_url || null;
    let cover_image_key = input.cover_image_key || null;

    if (coverFile) {
      const uploadRes = await uploadToR2(coverFile.buffer, coverFile.mimetype, "trip-covers");
      cover_image_url = uploadRes.url;
      cover_image_key = uploadRes.key;
    }

    const { data: newTrip, error: createError } = await supabase
      .from("trips")
      .insert({
        name: input.name,
        description: input.description || null,
        start_date: input.start_date,
        end_date: input.end_date,
        theme_color: input.theme_color || "#6366f1",
        cover_image_url,
        cover_image_key,
        created_by: userId,
      })
      .select()
      .single();

    if (createError || !newTrip) {
      const err: CustomError = new Error("Gagal membuat trip: " + createError?.message);
      err.statusCode = 500;
      throw err;
    }

    // Add user as owner in trip_members
    const { error: memberError } = await supabase.from("trip_members").insert({
      trip_id: newTrip.id,
      user_id: userId,
      role: "owner",
    });

    if (memberError) {
      const err: CustomError = new Error("Gagal menambahkan owner trip: " + memberError.message);
      err.statusCode = 500;
      throw err;
    }

    return {
      ...newTrip,
      my_role: "owner",
    };
  }

  static async getTripById(tripId: string, userId: string) {
    const role = await this.getUserTripRole(tripId, userId);
    if (!role) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (error || !trip) {
      const err: CustomError = new Error("Trip tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    return {
      ...trip,
      my_role: role,
    };
  }

  static async updateTrip(
    tripId: string,
    userId: string,
    input: UpdateTripInput,
    coverFile?: { buffer: Buffer; mimetype: string }
  ) {
    const role = await this.getUserTripRole(tripId, userId);
    if (role !== "owner") {
      const err: CustomError = new Error("Hanya owner trip yang dapat mengubah data trip");
      err.statusCode = 403;
      throw err;
    }

    const { data: existingTrip } = await supabase
      .from("trips")
      .select("cover_image_key")
      .eq("id", tripId)
      .single();

    const updates: Record<string, any> = {};
    if (input.name) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.start_date) updates.start_date = input.start_date;
    if (input.end_date) updates.end_date = input.end_date;
    if (input.theme_color) updates.theme_color = input.theme_color;

    if (coverFile) {
      if (existingTrip?.cover_image_key) {
        await deleteFromR2(existingTrip.cover_image_key);
      }
      const uploadRes = await uploadToR2(coverFile.buffer, coverFile.mimetype, "trip-covers");
      updates.cover_image_url = uploadRes.url;
      updates.cover_image_key = uploadRes.key;
    }

    const { data: updatedTrip, error } = await supabase
      .from("trips")
      .update(updates)
      .eq("id", tripId)
      .select()
      .single();

    if (error || !updatedTrip) {
      const err: CustomError = new Error("Gagal memperbarui trip: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return {
      ...updatedTrip,
      my_role: "owner",
    };
  }

  static async deleteTrip(tripId: string, userId: string) {
    const role = await this.getUserTripRole(tripId, userId);
    if (role !== "owner") {
      const err: CustomError = new Error("Hanya owner trip yang dapat menghapus trip ini");
      err.statusCode = 403;
      throw err;
    }

    // Get trip cover and activity photos for R2 cleanup
    const { data: trip } = await supabase
      .from("trips")
      .select("cover_image_key")
      .eq("id", tripId)
      .single();

    if (trip?.cover_image_key) {
      await deleteFromR2(trip.cover_image_key);
    }

    // Find all activity photos in this trip
    const { data: activities } = await supabase
      .from("activities")
      .select("id")
      .eq("trip_id", tripId);

    if (activities && activities.length > 0) {
      const activityIds = activities.map((a) => a.id);
      const { data: photos } = await supabase
        .from("activity_photos")
        .select("r2_key")
        .in("activity_id", activityIds);

      if (photos) {
        for (const p of photos) {
          if (p.r2_key) await deleteFromR2(p.r2_key);
        }
      }
    }

    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (error) {
      const err: CustomError = new Error("Gagal menghapus trip: " + error.message);
      err.statusCode = 500;
      throw err;
    }
  }
}
