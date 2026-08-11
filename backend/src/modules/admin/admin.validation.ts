import { z } from "zod";

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID User harus UUID valid"),
  }),
  body: z.object({
    is_active: z.boolean().optional(),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
