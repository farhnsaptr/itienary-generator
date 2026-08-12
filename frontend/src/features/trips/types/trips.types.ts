import { z } from "zod";

export interface Trip {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_key: string | null;
  start_date: string;
  end_date: string;
  theme_color: string;
  created_by: string;
  my_role?: "owner" | "member";
  can_manage_activities?: boolean;
  can_manage_photos?: boolean;
  created_at: string;
  updated_at: string;
}

export const createTripSchema = z
  .object({
    name: z.string().min(1, "Nama trip wajib diisi").max(20, "Maksimal 20 karakter"),
    description: z.string().max(25, "Maksimal 25 karakter").optional(),
    start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
    end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
    theme_color: z.string().min(1, "Warna tema wajib diisi"),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
    path: ["end_date"],
  });

export type CreateTripFormData = z.infer<typeof createTripSchema>;
