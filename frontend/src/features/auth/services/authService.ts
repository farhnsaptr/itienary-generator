import { api } from "../../../lib/axios";
import type { LoginFormData, RegisterFormData, AuthApiResponse } from "../types/auth.types";
import type { User } from "../../../store/authStore";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthApiResponse> => {
    const res = await api.post<AuthApiResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterFormData): Promise<AuthApiResponse> => {
    const res = await api.post<AuthApiResponse>("/auth/register", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ success: boolean; data: User }>("/auth/me");
    return res.data.data;
  },
};
