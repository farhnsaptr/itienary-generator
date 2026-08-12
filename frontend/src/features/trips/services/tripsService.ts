import { api } from "../../../lib/axios";
import type { Trip, CreateTripFormData } from "../types/trips.types";

export interface InviteMemberInput {
  userCode: string;
  can_manage_activities?: boolean;
  can_manage_photos?: boolean;
}

export const tripsService = {
  getTrips: async (): Promise<Trip[]> => {
    const res = await api.get<{ success: boolean; data: Trip[] }>("/trips");
    return res.data.data;
  },

  createTrip: async (data: CreateTripFormData): Promise<Trip> => {
    const res = await api.post<{ success: boolean; data: Trip }>("/trips", data);
    return res.data.data;
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}`);
  },

  inviteMember: async (tripId: string, data: InviteMemberInput) => {
    const res = await api.post<{ success: boolean; message: string }>(`/trips/${tripId}/members`, data);
    return res.data;
  },
};
