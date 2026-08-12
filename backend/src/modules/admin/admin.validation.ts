import { z } from "zod";

export const getUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID User harus UUID valid"),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    full_name: z.string().max(100).optional(),
    role: z.enum(["admin", "user"]).default("user"),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID User harus UUID valid"),
  }),
  body: z.object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore")
      .optional(),
    email: z.string().email("Format email tidak valid").optional(),
    password: z.string().min(6, "Password minimal 6 karakter").optional(),
    full_name: z.string().max(100).optional(),
    role: z.enum(["admin", "user"]).optional(),
    is_active: z.boolean().optional(),
  }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID User harus UUID valid"),
  }),
  body: z.object({
    is_active: z.boolean().optional(),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID User harus UUID valid"),
  }),
});
