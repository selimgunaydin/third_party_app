import axios from 'axios';
import { AuthResponse, Component, LoginData, RegisterData, ApiKeyResponse, User, UserPreferences } from '@/types';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Public endpoints that don't require authentication
const publicEndpoints = ['/api/auth/login', '/api/auth/register'];

// Request interceptor
api.interceptors.request.use((config) => {
  // Don't add token for public endpoints
  if (publicEndpoints.includes(config.url || '')) {
    return config;
  }

  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !publicEndpoints.includes(error.config?.url)) {
      // Token expired or invalid
      Cookies.remove('access_token');
      Cookies.remove('user');

      // Only redirect if not already on login or register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    Cookies.set('access_token', response.data.access_token);
    Cookies.set('user', JSON.stringify(response.data.user));
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    Cookies.set('access_token', response.data.access_token);
    Cookies.set('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('user');
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
    const response = await api.patch<{ message: string }>(`/api/auth/api-key/${apiKey}/delete`);
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

  checkSelector: async (selector: string): Promise<{ exists: boolean }> => {
    const response = await api.get<{ exists: boolean }>(`/api/components/check-selector`, {
      params: { selector }
    });
    return response.data;
  }
};

export const analytics = {
  getEvents: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/api/analytics/events?${params.toString()}`);
    return response.data;
  },

  getMostViewedProducts: async () => {
    const response = await api.get('/api/analytics/most-viewed-products');
    return response.data;
  },

  getMostAddedProducts: async () => {
    const response = await api.get('/api/analytics/most-added-to-cart');
    return response.data;
  },

  getOrderStatistics: async () => {
    const response = await api.get('/api/analytics/order-statistics');
    return response.data;
  },

  getTimeBasedAnalytics: async () => {
    const response = await api.get('/api/analytics/time-based');
    return response.data;
  },

  getMostSearchedProducts: async (productId: string, limit?: number) => {
    const response = await api.get(`/api/analytics/most-searched-queries?limit=${limit}`);
    return response.data;
  },

  getPageDurationStats: async (path?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (path) params.append('path', path);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/api/analytics/page-duration?${params.toString()}`);
    return response.data;
  },

  getDetailedPageDuration: async (path: string, limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/api/analytics/page-duration/${path}?${params.toString()}`);
    return response.data;
  }
};

export const convertTailwind = {
  convert: async (html: string): Promise<string> => {
    if (!html) {
      return "";
    }
    const htmlString = typeof html === "string" ? html : String(html);
    const response = await api.post<string>("/api/convert-tailwind", {
      html: htmlString,
    });
    return response.data.css;
  },
};

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>('/api/users/profile', data);
    return response.data;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<User> => {
    const response = await api.patch<User>('/api/users/preferences', preferences);
    return response.data;
  },

  updateStatus: async (status: string): Promise<User> => {
    const response = await api.patch<User>('/api/users/status', { status });
    return response.data;
  },
};

export default api; 