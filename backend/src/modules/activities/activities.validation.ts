import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const createActivitySchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
  body: z
    .object({
      title: z.string().min(1, "Judul kegiatan wajib diisi").max(150, "Judul maksimal 150 karakter"),
      description: z.string().optional(),
      location: z.string().max(255).optional(),
      activity_date: z.string().regex(dateRegex, "Format activity_date harus YYYY-MM-DD"),
      start_time: z.string().regex(timeRegex, "Format start_time harus HH:mm atau HH:mm:ss"),
      end_time: z.string().regex(timeRegex, "Format end_time harus HH:mm atau HH:mm:ss"),
      icon: z.string().max(50).default("map-pin"),
      color: z.string().max(20).default("#f97316"),
      sort_order: z.number().int().default(0),
    })
    .refine((data) => data.end_time > data.start_time, {
      message: "Jam selesai (end_time) harus lebih besar dari jam mulai (start_time)",
      path: ["end_time"],
    }),
});

export const updateActivitySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Activity harus UUID valid"),
  }),
  body: z.object({
    title: z.string().min(1).max(150).optional(),
    description: z.string().optional(),
    location: z.string().max(255).optional(),
    activity_date: z.string().regex(dateRegex).optional(),
    start_time: z.string().regex(timeRegex).optional(),
    end_time: z.string().regex(timeRegex).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(20).optional(),
    sort_order: z.number().int().optional(),
  }),
});

export const getActivityByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Activity harus UUID valid"),
  }),
});

export const getTripActivitiesSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
  query: z.object({
    date: z.string().regex(dateRegex).optional(),
  }),
});
