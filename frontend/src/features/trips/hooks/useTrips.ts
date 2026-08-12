import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsService, type InviteMemberInput } from "../services/tripsService";
import type { CreateTripFormData } from "../types/trips.types";

export function useTrips() {
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: ["trips"],
    queryFn: tripsService.getTrips,
  });

  const createTripMutation = useMutation({
    mutationFn: (data: CreateTripFormData) => tripsService.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: (tripId: string) => tripsService.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: InviteMemberInput }) =>
      tripsService.inviteMember(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  return {
    tripsQuery,
    createTripMutation,
    deleteTripMutation,
    inviteMemberMutation,
  };
}
