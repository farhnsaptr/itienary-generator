import { supabase } from "../../lib/supabase";
import { UpdateUserStatusInput, AdminTripOverview } from "./admin.types";
import { CustomError } from "../../middlewares/errorHandler";

export class AdminService {
  static async getAllUsers(search?: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from("users")
      .select("id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query;

    if (error) {
      const err: CustomError = new Error("Gagal mengambil daftar pengguna: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return {
      users,
      total: count || 0,
      page,
      limit,
    };
  }

  static async updateUserStatus(targetUserId: string, input: UpdateUserStatusInput) {
    const updates: Record<string, any> = {};
    if (input.is_active !== undefined) updates.is_active = input.is_active;
    if (input.role !== undefined) updates.role = input.role;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", targetUserId)
      .select("id, username, email, full_name, role, is_active, updated_at")
      .single();

    if (error || !updatedUser) {
      const err: CustomError = new Error("Gagal memperbarui status pengguna: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return updatedUser;
  }

  static async getAllTripsOverview() {
    const { data: trips, error } = await supabase
      .from("admin_trip_overview")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const err: CustomError = new Error("Gagal mengambil overview trip: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return trips as AdminTripOverview[];
  }
}
