import api from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';


interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  image: string;
  link: string;
  stock?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data),
  });
};

export const useImportProducts = () => {
  return useMutation({
    mutationFn: (xmlContent: string) =>
      api.post('/products/import', { xmlContent }).then((res) => res.data),
  });
}; 