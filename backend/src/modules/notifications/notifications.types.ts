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
  trip_name?: string;
  inviter_name?: string;
}

export interface RespondNotificationInput {
  status: "accepted" | "rejected";
}
