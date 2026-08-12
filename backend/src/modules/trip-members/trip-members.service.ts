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
      .select("id, trip_id, user_id, role, status, can_manage_activities, can_manage_photos, joined_at, users:user_id(username, email, full_name, avatar_url, user_code)")
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
      const err: CustomError = new Error("Hanya owner trip yang dapat mengundang anggota baru");
      err.statusCode = 403;
      throw err;
    }

    // Get trip info
    const { data: trip } = await supabase.from("trips").select("name").eq("id", tripId).single();
    if (!trip) {
      const err: CustomError = new Error("Trip tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    // Get requester info
    const { data: inviter } = await supabase.from("users").select("username, full_name").eq("id", requesterUserId).single();

    // Find target user by user_code (or fallback to UUID id, username, or email)
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(input.userCode);
    let targetUserQuery = supabase.from("users").select("id, username, email, is_active, user_code");

    if (isUuid) {
      targetUserQuery = targetUserQuery.eq("id", input.userCode);
    } else {
      targetUserQuery = targetUserQuery.or(`user_code.eq.${input.userCode},username.eq.${input.userCode},email.eq.${input.userCode}`);
    }

    const { data: targetUser } = await targetUserQuery.maybeSingle();

    if (!targetUser) {
      const err: CustomError = new Error(`Pengguna dengan User ID '${input.userCode}' tidak ditemukan`);
      err.statusCode = 404;
      throw err;
    }

    if (targetUser.id === requesterUserId) {
      const err: CustomError = new Error("Anda tidak dapat mengundang diri Anda sendiri");
      err.statusCode = 400;
      throw err;
    }

    if (!targetUser.is_active) {
      const err: CustomError = new Error("Pengguna tidak aktif");
      err.statusCode = 400;
      throw err;
    }

    // Check if user is already a member or invited
    const { data: existingMember } = await supabase
      .from("trip_members")
      .select("id, status")
      .eq("trip_id", tripId)
      .eq("user_id", targetUser.id)
      .maybeSingle();

    if (existingMember) {
      const err: CustomError = new Error(
        existingMember.status === "pending"
          ? "Pengguna sudah diundang dan sedang menunggu konfirmasi"
          : "Pengguna sudah menjadi anggota trip ini"
      );
      err.statusCode = 400;
      throw err;
    }

    const { data: newMember, error } = await supabase
      .from("trip_members")
      .insert({
        trip_id: tripId,
        user_id: targetUser.id,
        role: "member",
        status: "pending",
        can_manage_activities: input.can_manage_activities || false,
        can_manage_photos: input.can_manage_photos || false,
      })
      .select("id, trip_id, user_id, role, status, can_manage_activities, can_manage_photos, joined_at, users:user_id(username, email, full_name, avatar_url, user_code)")
      .single();

    if (error || !newMember) {
      const err: CustomError = new Error("Gagal mengundang anggota: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    // Create Notification item for target user
    const inviterName = inviter?.full_name || inviter?.username || "Seseorang";
    await supabase.from("notifications").insert({
      user_id: targetUser.id,
      trip_id: tripId,
      inviter_id: requesterUserId,
      type: "trip_invitation",
      title: `Undangan Trip: ${trip.name}`,
      message: `${inviterName} mengundang Anda bergabung di trip "${trip.name}".`,
      is_read: false,
      status: "pending",
    });

    return newMember;
  }

  static async removeMember(tripId: string, requesterUserId: string, targetUserId: string) {
    const requesterRole = await TripsService.getUserTripRole(tripId, requesterUserId);
    if (!requesterRole) {
      const err: CustomError = new Error("Anda tidak memiliki akses ke trip ini");
      err.statusCode = 403;
      throw err;
    }

    const targetRole = await TripsService.getUserTripRole(tripId, targetUserId);
    if (!targetRole) {
      const err: CustomError = new Error("Anggota tidak ditemukan di trip ini");
      err.statusCode = 404;
      throw err;
    }

    if (targetRole === "owner") {
      const err: CustomError = new Error("Owner trip tidak dapat dikeluarkan dari trip");
      err.statusCode = 400;
      throw err;
    }

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
