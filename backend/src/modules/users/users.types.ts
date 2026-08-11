export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}
