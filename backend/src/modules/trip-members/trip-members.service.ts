import { supabase } from "../../lib/supabase";
import { TripsService } from "../trips/trips.service";
import { AddMemberInput } from "./trip-members.types";
import { CustomError } from "../../middlewares/errorHandler";

export class TripMembersService {
  static async getMembers(tripId: string, userId: string) {
    const role = await TripsService.getUserTripRole(tripId, userId);
    if (!role) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    const { data: members, error } = await supabase
      .from("trip_members")
      .select("id, trip_id, user_id, role, joined_at, users:user_id(username, email, full_name, avatar_url)")
      .eq("trip_id", tripId)
      .order("joined_at", { ascending: true });

    if (error) {
      const err: CustomError = new Error("Gagal mengambil anggota trip: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return members;
  }

  static async addMember(tripId: string, requesterUserId: string, input: AddMemberInput) {
    const requesterRole = await TripsService.getUserTripRole(tripId, requesterUserId);
    if (requesterRole !== "owner") {
      const err: CustomError = new Error("Hanya owner trip yang dapat menambahkan anggota");
      err.statusCode = 403;
      throw err;
    }

    // Find target user by username, email, or id
    const { data: targetUser } = await supabase
      .from("users")
      .select("id, username, email, is_active")
      .or(`id.eq.${input.usernameOrEmailOrId},username.eq.${input.usernameOrEmailOrId},email.eq.${input.usernameOrEmailOrId}`)
      .maybeSingle();

    if (!targetUser) {
      const err: CustomError = new Error("Pengguna tidak ditemukan");
      err.statusCode = 44;
      throw err;
    }

    if (!targetUser.is_active) {
      const err: CustomError = new Error("Pengguna tidak aktif");
      err.statusCode = 400;
      throw err;
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("trip_members")
      .select("id")
      .eq("trip_id", tripId)
      .eq("user_id", targetUser.id)
      .maybeSingle();

    if (existingMember) {
      const err: CustomError = new Error("Pengguna sudah menjadi anggota trip ini");
      err.statusCode = 400;
      throw err;
    }

    const { data: newMember, error } = await supabase
      .from("trip_members")
      .insert({
        trip_id: tripId,
        user_id: targetUser.id,
        role: "member",
      })
      .select("id, trip_id, user_id, role, joined_at, users:user_id(username, email, full_name, avatar_url)")
      .single();

    if (error || !newMember) {
      const err: CustomError = new Error("Gagal menambahkan anggota: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return newMember;
  }

  static async removeMember(tripId: string, requesterUserId: string, targetUserId: string) {
    const requesterRole = await TripsService.getUserTripRole(tripId, requesterUserId);
    if (!requesterRole) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    // Get target member role
    const targetRole = await TripsService.getUserTripRole(tripId, targetUserId);
    if (!targetRole) {
      const err: CustomError = new Error("Anggota tidak ditemukan di trip ini");
      err.statusCode = 44;
      throw err;
    }

    if (targetRole === "owner") {
      const err: CustomError = new Error("Owner trip tidak dapat dikeluarkan dari trip");
      err.statusCode = 400;
      throw err;
    }

    // Only owner can remove other members, or member can remove themselves (leave trip)
    if (requesterRole !== "owner" && requesterUserId !== targetUserId) {
      const err: CustomError = new Error("Anda tidak berhak mengeluarkan anggota ini");
      err.statusCode = 403;
      throw err;
    }

    const { error } = await supabase
      .from("trip_members")
      .delete()
      .eq("trip_id", tripId)
      .eq("user_id", targetUserId);

    if (error) {
      const err: CustomError = new Error("Gagal mengeluarkan anggota: " + error.message);
      err.statusCode = 500;
      throw err;
    }
  }
}
