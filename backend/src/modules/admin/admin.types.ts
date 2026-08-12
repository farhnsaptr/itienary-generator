export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role: "admin" | "user";
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: "admin" | "user";
  is_active?: boolean;
}

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
