export interface Trip {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_key: string | null;
  start_date: string;
  end_date: string;
  theme_color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTripInput {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  theme_color?: string;
  cover_image_url?: string;
  cover_image_key?: string;
}

export interface UpdateTripInput {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  theme_color?: string;
  cover_image_url?: string;
  cover_image_key?: string;
}
