import { useEffect, useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

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