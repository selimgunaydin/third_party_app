import { useMutation, useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api';
import { User, UserPreferences } from '@/types';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getProfile(),
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: Partial<User>) => userApi.updateProfile(data),
  });
};

export const useUpdatePreferences = () => {
  return useMutation({
    mutationFn: (preferences: Partial<UserPreferences>) => userApi.updatePreferences(preferences),
  });
};

export const useUpdateStatus = () => {
  return useMutation({
    mutationFn: (status: string) => userApi.updateStatus(status),
  });
}; 