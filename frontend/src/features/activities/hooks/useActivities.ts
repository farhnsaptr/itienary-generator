import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesService } from "../services/activitiesService";
import type { CreateActivityFormData } from "../types/activities.types";

export function useActivities(tripId: string, filterDate?: string) {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: ["activities", tripId, filterDate],
    queryFn: () => activitiesService.getTripActivities(tripId, filterDate),
    enabled: !!tripId,
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: CreateActivityFormData) => activitiesService.createActivity(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ activityId, data }: { activityId: string; data: Partial<CreateActivityFormData> }) =>
      activitiesService.updateActivity(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: string) => activitiesService.deleteActivity(activityId),
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ["activities", tripId] });

      const previousActivities = queryClient.getQueryData(["activities", tripId, filterDate]);

      queryClient.setQueryData(["activities", tripId, filterDate], (old: any) =>
        Array.isArray(old) ? old.filter((item: any) => item.id !== activityId) : []
      );

      return { previousActivities };
    },
    onError: (_err, _activityId, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(["activities", tripId, filterDate], context.previousActivities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ activityId, files, caption }: { activityId: string; files: File[] | File; caption?: string }) =>
      activitiesService.uploadPhoto(activityId, files, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => activitiesService.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
    },
  });

  return {
    activitiesQuery,
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
    uploadPhotoMutation,
    deletePhotoMutation,
  };
}
