import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().max(100, "Nama lengkap maksimal 100 karakter").optional(),
    avatar_url: z.string().url("Format URL avatar tidak valid").optional().nullable(),
  }),
});

export const searchUsersSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Query pencarian tidak boleh kosong"),
  }),
});
