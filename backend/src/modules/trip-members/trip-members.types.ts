export interface TripMemberInfo {
  id: string;
  trip_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  users?: {
    username: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface AddMemberInput {
  usernameOrEmailOrId: string;
  role?: "member";
}
