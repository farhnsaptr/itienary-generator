export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, "password_hash">;

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginInput {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
