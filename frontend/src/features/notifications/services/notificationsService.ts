import { api } from "../../../lib/axios";
import type { GetNotificationsResponse } from "../types/notifications.types";

export const notificationsService = {
  getNotifications: async (): Promise<GetNotificationsResponse> => {
    const res = await api.get<GetNotificationsResponse>("/notifications");
    return res.data;
  },

  respondInvitation: async (notificationId: string, status: "accepted" | "rejected") => {
    const res = await api.patch<{ success: boolean; message: string }>(`/notifications/${notificationId}/respond`, {
      status,
    });
    return res.data;
  },
};
