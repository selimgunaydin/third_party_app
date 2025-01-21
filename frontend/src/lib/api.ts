import axios from 'axios';
import { AuthResponse, Component, LoginData, RegisterData, ApiKeyResponse, User } from '@/types';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('access_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  generateApiKey: async (): Promise<ApiKeyResponse> => {
    const response = await api.post<ApiKeyResponse>('/api/auth/generate-api-key');
    return response.data;
  },

  deleteApiKey: async (apiKey: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/auth/api-key/${apiKey}`);
    return response.data;
  },
};

export const components = {
  getAll: async (): Promise<Component[]> => {
    const response = await api.get<Component[]>('/api/components');
    return response.data;
  },

  getOne: async (id: string): Promise<Component> => {
    const response = await api.get<Component>(`/api/components/${id}`);
    return response.data;
  },

  create: async (data: Omit<Component, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Component> => {
    const response = await api.post<Component>('/api/components', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Component, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Component> => {
    const response = await api.patch<Component>(`/api/components/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/components/${id}`);
  },
};

export default api; 