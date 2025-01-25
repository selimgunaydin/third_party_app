export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  company?: string;
  title?: string;
  bio?: string;
  isVerified: boolean;
  status: 'active' | 'inactive';
  preferences: {
    language: 'tr' | 'en';
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
  };
  apiKeys: Array<{
    key: string;
    isActive: boolean;
    _id: string;
  }>;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  key: string;
  isActive: boolean;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
}

export interface Component {
  _id: string;
  userId: string;
  name: string;
  selector: string;
  html: string;
  css: string;
  javascript: string;
  position: 'before' | 'after';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  company?: string;
  title?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiKeyResponse {
  apiKey: string;
} 