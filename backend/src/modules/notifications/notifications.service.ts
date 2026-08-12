import { supabase } from "../../lib/supabase";
import { NotificationItem } from "./notifications.types";
import { CustomError } from "../../middlewares/errorHandler";

export class NotificationsService {
  static async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      const err: CustomError = new Error("Gagal mengambil notifikasi: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return notifications as NotificationItem[];
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return 0;
    }

    return count || 0;
  }

  static async respondToInvitation(userId: string, notificationId: string, status: "accepted" | "rejected") {
    // 1. Fetch notification item
    const { data: notification, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notificationId)
      .eq("user_id", userId)
      .single();

    if (error || !notification) {
      const err: CustomError = new Error("Notifikasi tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    if (notification.type !== "trip_invitation" || !notification.trip_id) {
      const err: CustomError = new Error("Notifikasi ini bukan undangan trip valid");
      err.statusCode = 400;
      throw err;
    }

    // 2. Update notification status
    await supabase
      .from("notifications")
      .update({
        status,
        is_read: true,
      })
      .eq("id", notificationId);

    // 3. Update trip_members status for user_id and trip_id
    if (status === "accepted") {
      await supabase
        .from("trip_members")
        .update({ status: "accepted" })
        .eq("trip_id", notification.trip_id)
        .eq("user_id", userId);
    } else {
      // If rejected, remove member record
      await supabase
        .from("trip_members")
        .delete()
        .eq("trip_id", notification.trip_id)
        .eq("user_id", userId);
    }

    return {
      success: true,
      message: status === "accepted" ? "Undangan trip diterima" : "Undangan trip ditolak",
    };
  }
}
