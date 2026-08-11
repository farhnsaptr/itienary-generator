export interface UpdateUserStatusInput {
  is_active?: boolean;
  role?: "admin" | "user";
}

export interface AdminTripOverview {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_by: string;
  owner_username: string;
  member_count: number;
  activity_count: number;
  created_at: string;
}
