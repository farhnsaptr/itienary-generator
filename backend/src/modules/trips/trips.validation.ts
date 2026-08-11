import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTripSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Nama trip wajib diisi").max(150, "Nama trip maksimal 150 karakter"),
      description: z.string().optional(),
      start_date: z.string().regex(dateRegex, "Format start_date harus YYYY-MM-DD"),
      end_date: z.string().regex(dateRegex, "Format end_date harus YYYY-MM-DD"),
      theme_color: z.string().max(20).optional(),
      cover_image_url: z.string().url().optional().nullable(),
    })
    .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
      message: "Tanggal selesai (end_date) tidak boleh lebih awal dari tanggal mulai (start_date)",
      path: ["end_date"],
    }),
});

export const updateTripSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Trip harus UUID valid"),
  }),
  body: z.object({
    name: z.string().min(1).max(150).optional(),
    description: z.string().optional(),
    start_date: z.string().regex(dateRegex).optional(),
    end_date: z.string().regex(dateRegex).optional(),
    theme_color: z.string().max(20).optional(),
    cover_image_url: z.string().url().optional().nullable(),
  }),
});

export const getTripByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Trip harus UUID valid"),
  }),
});
