import { useMutation, useQuery } from '@tanstack/react-query';
import { components } from '@/lib/api';
import { Component } from '@/types';

export const useComponents = () => {
  return useQuery({
    queryKey: ['components'],
    queryFn: () => components.getAll(),
  });
};

export const useComponent = (id: string) => {
  return useQuery({
    queryKey: ['components', id],
    queryFn: () => components.getOne(id),
    enabled: !!id,
  });
};

export const useCreateComponent = () => {
  return useMutation({
    mutationFn: (data: Omit<Component, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => 
      components.create(data),
  });
};

export const useUpdateComponent = () => {
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string, 
      data: Partial<Omit<Component, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
    }) => components.update(id, data),
  });
};

export const useDeleteComponent = () => {
  return useMutation({
    mutationFn: (id: string) => components.delete(id),
  });
};

export const useCheckSelector = () => {
  return useMutation({
    mutationFn: (selector: string) => components.checkSelector(selector),
  });
}; 