import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuthStore } from "../../../store/authStore";
import type { LoginFormData, RegisterFormData } from "../types/auth.types";

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (res) => {
      if (res.data?.user) {
        setUser(res.data.user);
        queryClient.invalidateQueries({ queryKey: ["trips"] });
        navigate("/dashboard", { replace: true });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (res) => {
      if (res.data?.user) {
        setUser(res.data.user);
        queryClient.invalidateQueries({ queryKey: ["trips"] });
        navigate("/dashboard", { replace: true });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
