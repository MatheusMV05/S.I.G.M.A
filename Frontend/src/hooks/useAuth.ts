import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import type { LoginRequest, RegisterRequest, User } from '@/services/types';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hook para dados do usuário atual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // Atualiza o cache do usuário atual
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpa todo o cache
      queryClient.clear();
    },
  });
};

// Hook para registro
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
  });
};

// Hook para atualizar perfil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<User>) => authService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Atualiza o cache do usuário atual
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
};

// Hook para alterar senha
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(oldPassword, newPassword),
  });
};

// Hook para solicitar reset de senha
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
};

// Hook para confirmar reset de senha
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
  });
};