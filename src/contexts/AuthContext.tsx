'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  department?: string;
  position?: string;
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create a default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => { throw new Error('AuthContext not initialized'); },
  checkAuth: async () => { throw new Error('AuthContext not initialized'); },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Checking authentication status...');
      try {
        // Use our API client instead of fetch
        const data = await get('/api/auth/me');
        console.log('Auth check response:', data);
        
        if (data.success && data.user) {
          console.log('User authenticated:', data.user);
          setUser(data.user);
        } else {
          console.log('User not authenticated');
          setUser(null);
        }
      } catch (error) {
        // If API call fails, user is not authenticated
        console.log('Authentication check failed, user not authenticated');
        setUser(null);
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use custom fetch directly here since we need to handle errors differently
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Check if user data exists in the response
      const userData = data.user || (data.data && data.data.user);
      
      if (!userData) {
        throw new Error('User data not found in response');
      }
      
      setUser(userData);
      
      // Redirect based on user role
      if (userData.role === 'admin' || userData.role === 'hr') {
        router.push('/dashboard');
      } else {
        router.push('/employee');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Use custom fetch directly here since we need to handle errors differently
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      });
      
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
