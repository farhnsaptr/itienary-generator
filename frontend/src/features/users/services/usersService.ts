import { api } from "../../../lib/axios";
import type { AdminUser, CreateUserFormData, UpdateUserFormData } from "../types/users.types";

export interface GetUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export const usersService = {
  getUsers: async (search?: string, page: number = 1, limit: number = 20): Promise<GetUsersResponse> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await api.get<GetUsersResponse>(`/admin/users?${params.toString()}`);
    return res.data;
  },

  getUserById: async (id: string): Promise<AdminUser> => {
    const res = await api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${id}`);
    return res.data.data;
  },

  createUser: async (data: CreateUserFormData): Promise<AdminUser> => {
    const res = await api.post<{ success: boolean; data: AdminUser }>("/admin/users", data);
    return res.data.data;
  },

  updateUser: async (id: string, data: UpdateUserFormData): Promise<AdminUser> => {
    const res = await api.put<{ success: boolean; data: AdminUser }>(`/admin/users/${id}`, data);
    return res.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
