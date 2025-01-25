import { useMutation, useQuery } from '@tanstack/react-query';
import { auth } from '@/lib/api';
import { LoginData, RegisterData } from '@/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => auth.login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => auth.register(data),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => auth.getProfile(),
  });
};

export const useGenerateApiKey = () => {
  return useMutation({
    mutationFn: () => auth.generateApiKey(),
  });
};

export const useDeleteApiKey = () => {
  return useMutation({
    mutationFn: (apiKey: string) => auth.deleteApiKey(apiKey),
  });
}; 