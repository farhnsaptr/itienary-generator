import { z } from "zod";

export const addMemberSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
  body: z.object({
    usernameOrEmailOrId: z.string().min(1, "Username, email, atau user ID wajib diisi"),
  }),
});

export const removeMemberSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
    targetUserId: z.string().uuid("ID User harus UUID valid"),
  }),
});

export const getMembersSchema = z.object({
  params: z.object({
    tripId: z.string().uuid("ID Trip harus UUID valid"),
  }),
});
