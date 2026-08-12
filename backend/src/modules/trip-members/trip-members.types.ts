export interface TripMemberInfo {
  id: string;
  trip_id: string;
  user_id: string;
  role: "owner" | "member";
  status: "pending" | "accepted" | "rejected";
  can_manage_activities: boolean;
  can_manage_photos: boolean;
  joined_at: string;
  users?: {
    username: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    user_code: string;
  };
}

export interface AddMemberInput {
  userCode: string;
  can_manage_activities?: boolean;
  can_manage_photos?: boolean;
}
