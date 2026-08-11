export interface ActivityPhoto {
  id: string;
  activity_id: string;
  photo_url: string;
  r2_key: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface UploadPhotoInput {
  caption?: string;
}
