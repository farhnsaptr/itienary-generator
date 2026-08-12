import { z } from "zod";

export interface ActivityPhotoItem {
  id: string;
  activity_id: string;
  photo_url: string;
  r2_key: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface Activity {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  location: string | null;
  activity_date: string;
  start_time: string;
  end_time: string;
  icon: string;
  color: string;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  activity_photos?: ActivityPhotoItem[];
}

export const createActivitySchema = z.object({
  title: z.string().min(1, "Judul kegiatan wajib diisi").max(20, "Maksimal 20 karakter"),
  description: z.string().max(25, "Maksimal 25 karakter").optional(),
  location: z.string().optional(),
  activity_date: z.string().min(1, "Tanggal kegiatan wajib diisi"),
  start_time: z.string().min(1, "Jam mulai wajib diisi"),
  end_time: z.string().min(1, "Jam selesai wajib diisi"),
  icon: z.string().default("map-pin"),
  color: z.string().default("#f97316"),
}).refine((data) => data.end_time > data.start_time, {
  message: "Jam selesai harus lebih besar dari jam mulai",
  path: ["end_time"],
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
