import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/usersService";
import type { CreateUserFormData, UpdateUserFormData } from "../types/users.types";

export function useUsers(search?: string, page: number = 1) {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["adminUsers", search, page],
    queryFn: () => usersService.getUsers(search, page),
  });

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormData) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormData }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
}
