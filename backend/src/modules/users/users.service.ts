import { supabase } from "../../lib/supabase";
import { UpdateProfileInput, UserSearchResult } from "./users.types";
import { CustomError } from "../../middlewares/errorHandler";

export class UsersService {
  static async searchUsers(query: string, currentUserId: string): Promise<UserSearchResult[]> {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, email, full_name, avatar_url")
      .eq("is_active", true)
      .neq("id", currentUserId)
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) {
      const err: CustomError = new Error("Gagal mencari pengguna: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return users as UserSearchResult[];
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const updates: Record<string, any> = {};
    if (input.full_name !== undefined) updates.full_name = input.full_name;
    if (input.avatar_url !== undefined) updates.avatar_url = input.avatar_url;

    const { data: user, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at")
      .single();

    if (error || !user) {
      const err: CustomError = new Error("Gagal memperbarui profil: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    return user;
  }
}
