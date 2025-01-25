'use client';

import { createContext, useContext } from 'react';
import { useProfile } from '@/hooks/queries';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useProfile();

  return (
    <AuthContext.Provider value={{ user: user || null, loading: isLoading }}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
} 