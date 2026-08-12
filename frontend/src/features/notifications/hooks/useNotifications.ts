import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notificationsService";

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsService.getNotifications,
    refetchInterval: 15000, // auto poll every 15s
  });

  const respondMutation = useMutation({
    mutationFn: ({ notificationId, status }: { notificationId: string; status: "accepted" | "rejected" }) =>
      notificationsService.respondInvitation(notificationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  return {
    notificationsQuery,
    respondMutation,
  };
}
