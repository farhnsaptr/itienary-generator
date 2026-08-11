export interface Activity {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  location: string | null;
  activity_date: string;
  start_time: string;
  end_time: string;
  icon: string;
  color: string;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  activity_photos?: {
    id: string;
    photo_url: string;
    caption: string | null;
  }[];
}

export interface CreateActivityInput {
  title: string;
  description?: string;
  location?: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  icon?: string;
  color?: string;
  sort_order?: number;
}

export interface UpdateActivityInput {
  title?: string;
  description?: string;
  location?: string;
  activity_date?: string;
  start_time?: string;
  end_time?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
}
