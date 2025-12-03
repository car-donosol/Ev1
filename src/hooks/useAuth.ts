import { useEffect, useState } from 'react';
import type { User } from '@/types/user.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('usuario');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading user from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
  };

  return { user, isLoading, logout };
}

// Export User type for backward compatibility
export type { User };