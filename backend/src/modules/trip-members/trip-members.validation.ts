import { z } from "zod";

export const addMemberSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
  body: z.object({
    userCode: z.string().min(1, "User ID 8-digit wajib diisi"),
    can_manage_activities: z.boolean().optional().default(false),
    can_manage_photos: z.boolean().optional().default(false),
  }),
});

export const getMembersSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
});

export const removeMemberSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
    userId: z.string().uuid("ID User harus UUID valid"),
  }),
});
