export interface NotificationItem {
  id: string;
  user_id: string;
  trip_id: string | null;
  inviter_id: string | null;
  type: "trip_invitation" | "general";
  title: string;
  message: string;
  is_read: boolean;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: NotificationItem[];
  unreadCount: number;
}
