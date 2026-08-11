import bcrypt from "bcrypt";
import { supabase } from "../../lib/supabase";
import {
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import { RegisterInput, LoginInput, SafeUser, User } from "./auth.types";
import { CustomError } from "../../middlewares/errorHandler";

function sanitizeUser(user: User): SafeUser {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export class AuthService {
  static async register(input: RegisterInput, userAgent?: string) {
    // Check existing username or email
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, username, email")
      .or(`username.eq.${input.username},email.eq.${input.email}`)
      .maybeSingle();

    if (existingUser) {
      const err: CustomError = new Error(
        existingUser.username === input.username
          ? "Username sudah digunakan"
          : "Email sudah terdaftar"
      );
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        username: input.username,
        email: input.email,
        password_hash: passwordHash,
        full_name: input.full_name || null,
        role: "user",
      })
      .select()
      .single();

    if (error || !newUser) {
      const err: CustomError = new Error("Gagal mendaftarkan pengguna: " + error?.message);
      err.statusCode = 500;
      throw err;
    }

    const payload = { userId: newUser.id, role: newUser.role as "admin" | "user" };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const tokenHash = hashRefreshToken(refreshToken);

    // Calculate refresh token expiry (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from("refresh_tokens").insert({
      user_id: newUser.id,
      token_hash: tokenHash,
      user_agent: userAgent || null,
      expires_at: expiresAt,
    });

    return {
      user: sanitizeUser(newUser as User),
      accessToken,
      refreshToken,
    };
  }

  static async login(input: LoginInput, userAgent?: string, oldRefreshToken?: string) {
    if (oldRefreshToken) {
      try {
        const oldHash = hashRefreshToken(oldRefreshToken);
        await supabase
          .from("refresh_tokens")
          .update({ revoked_at: new Date().toISOString() })
          .eq("token_hash", oldHash);
      } catch (_err) {
        // Silently ignore invalid/expired old tokens
      }
    }
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${input.usernameOrEmail},email.eq.${input.usernameOrEmail}`)
      .maybeSingle();

    if (!user) {
      const err: CustomError = new Error("Username/Email atau password salah");
      err.statusCode = 401;
      throw err;
    }

    if (!user.is_active) {
      const err: CustomError = new Error("Akun Anda telah dinonaktifkan");
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash);
    if (!isMatch) {
      const err: CustomError = new Error("Username/Email atau password salah");
      err.statusCode = 401;
      throw err;
    }

    const payload = { userId: user.id, role: user.role as "admin" | "user" };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token_hash: tokenHash,
      user_agent: userAgent || null,
      expires_at: expiresAt,
    });

    return {
      user: sanitizeUser(user as User),
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const tokenHash = hashRefreshToken(refreshToken);

      const { data: tokenRecord } = await supabase
        .from("refresh_tokens")
        .select("*")
        .eq("token_hash", tokenHash)
        .is("revoked_at", null)
        .maybeSingle();

      if (!tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
        const err: CustomError = new Error("Refresh token tidak valid atau telah kedaluwarsa");
        err.statusCode = 401;
        throw err;
      }

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", payload.userId)
        .single();

      if (!user || !user.is_active) {
        const err: CustomError = new Error("Pengguna tidak ditemukan atau tidak aktif");
        err.statusCode = 401;
        throw err;
      }

      const newPayload = { userId: user.id, role: user.role as "admin" | "user" };
      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);
      const newTokenHash = hashRefreshToken(newRefreshToken);

      // Revoke old refresh token
      await supabase
        .from("refresh_tokens")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", tokenRecord.id);

      // Store new refresh token
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("refresh_tokens").insert({
        user_id: user.id,
        token_hash: newTokenHash,
        user_agent: tokenRecord.user_agent,
        expires_at: expiresAt,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: sanitizeUser(user as User),
      };
    } catch (error) {
      const err: CustomError = new Error("Refresh token tidak valid");
      err.statusCode = 401;
      throw err;
    }
  }

  static async logout(refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      await supabase
        .from("refresh_tokens")
        .update({ revoked_at: new Date().toISOString() })
        .eq("token_hash", tokenHash);
    }
  }

  static async getMe(userId: string): Promise<SafeUser> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      const err: CustomError = new Error("Pengguna tidak ditemukan");
      err.statusCode = 44;
      throw err;
    }

    return sanitizeUser(user as User);
  }
}
