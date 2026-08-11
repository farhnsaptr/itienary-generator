import { z } from "zod";

export const uploadPhotoSchema = z.object({
  params: z.object({
    activityId: z.string().uuid("ID Activity harus UUID valid"),
  }),
  body: z.object({
    caption: z.string().max(255).optional(),
  }),
});

export const deletePhotoSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Photo harus UUID valid"),
  }),
});
