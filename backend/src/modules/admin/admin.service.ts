import bcrypt from "bcrypt";
import { supabase } from "../../lib/supabase";
import { CreateUserInput, UpdateUserInput, UpdateUserStatusInput, AdminTripOverview } from "./admin.types";
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

  static async getUserById(userId: string) {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at")
      .eq("id", userId)
      .single();

    if (error || !user) {
      const err: CustomError = new Error("Pengguna tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }

    return user;
  }

  static async createUser(input: CreateUserInput) {
    // Check if username or email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, username, email")
      .or(`username.eq.${input.username},email.eq.${input.email}`)
      .maybeSingle();

    if (existingUser) {
      const err: CustomError = new Error(
        existingUser.username === input.username ? "Username sudah digunakan" : "Email sudah terdaftar"
      );
      err.statusCode = 400;
      throw err;
    }

    const password_hash = await bcrypt.hash(input.password, 10);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        username: input.username,
        email: input.email,
        password_hash,
        full_name: input.full_name || null,
        role: input.role || "user",
        is_active: true,
      })
      .select("id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at")
      .single();

    if (error || !newUser) {
      const err: CustomError = new Error("Gagal membuat pengguna baru: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return newUser;
  }

  static async updateUser(targetUserId: string, input: UpdateUserInput) {
    // Check if user exists
    const existing = await this.getUserById(targetUserId);

    const updates: Record<string, any> = {};
    if (input.username !== undefined) updates.username = input.username;
    if (input.email !== undefined) updates.email = input.email;
    if (input.full_name !== undefined) updates.full_name = input.full_name;
    if (input.role !== undefined) updates.role = input.role;
    if (input.is_active !== undefined) updates.is_active = input.is_active;

    if (input.password && input.password.trim() !== "") {
      updates.password_hash = await bcrypt.hash(input.password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return existing;
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", targetUserId)
      .select("id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at")
      .single();

    if (error || !updatedUser) {
      const err: CustomError = new Error("Gagal memperbarui pengguna: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return updatedUser;
  }

  static async updateUserStatus(targetUserId: string, input: UpdateUserStatusInput) {
    return this.updateUser(targetUserId, input);
  }

  static async deleteUser(targetUserId: string) {
    // Check if user exists
    await this.getUserById(targetUserId);

    const { error } = await supabase.from("users").delete().eq("id", targetUserId);

    if (error) {
      const err: CustomError = new Error("Gagal menghapus pengguna: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return { success: true };
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
