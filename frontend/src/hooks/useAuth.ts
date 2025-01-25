import { useState, useEffect } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/api';
import Cookies from 'js-cookie';
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = Cookies.get('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          const updatedUser = await auth.getProfile();
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        auth.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
} 