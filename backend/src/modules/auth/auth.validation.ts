import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    full_name: z.string().max(100, "Nama lengkap maksimal 100 karakter").optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    usernameOrEmail: z.string().min(1, "Username atau Email wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
  }),
});
