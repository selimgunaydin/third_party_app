export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  apiKeys: string[];
}

export interface Component {
  _id: string;
  userId: string;
  name: string;
  selector: string;
  html: string;
  css?: string;
  javascript?: string;
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
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiKeyResponse {
  apiKey: string;
} 