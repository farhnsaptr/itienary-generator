import { api } from "../../../lib/axios";
import type { Activity, ActivityPhotoItem, CreateActivityFormData } from "../types/activities.types";

export const activitiesService = {
  getTripActivities: async (tripId: string, filterDate?: string): Promise<Activity[]> => {
    const params = new URLSearchParams();
    if (filterDate) params.append("date", filterDate);

    const res = await api.get<{ success: boolean; data: Activity[] }>(
      `/trips/${tripId}/activities?${params.toString()}`
    );
    return res.data.data;
  },

  createActivity: async (tripId: string, data: CreateActivityFormData): Promise<Activity> => {
    const res = await api.post<{ success: boolean; data: Activity }>(
      `/trips/${tripId}/activities`,
      data
    );
    return res.data.data;
  },

  updateActivity: async (activityId: string, data: Partial<CreateActivityFormData>): Promise<Activity> => {
    const res = await api.put<{ success: boolean; data: Activity }>(
      `/activities/${activityId}`,
      data
    );
    return res.data.data;
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    await api.delete(`/activities/${activityId}`);
  },

  uploadPhoto: async (activityId: string, file: File, caption?: string): Promise<ActivityPhotoItem> => {
    const formData = new FormData();
    formData.append("photo", file);
    if (caption) formData.append("caption", caption);

    const res = await api.post<{ success: boolean; data: ActivityPhotoItem }>(
      `/activities/${activityId}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.data;
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/photos/${photoId}`);
  },
};
