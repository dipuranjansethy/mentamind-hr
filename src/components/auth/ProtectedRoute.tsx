'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'hr' | 'employee')[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'hr', 'employee'] 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      // Still loading, wait for authentication check to complete
      return;
    }
    
    // If no user, redirect to login
    if (!user) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname || '')}`);
      return;
    }

    // If user exists but doesn't have the required role
    if (user && allowedRoles.length > 0) {
      const userRole = user.role || '';
      
      if (!allowedRoles.includes(userRole as any)) {
        // Redirect based on role
        if (userRole === 'employee') {
          router.push('/employee');
        } else if (['admin', 'hr'].includes(userRole)) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      }
    }
  }, [user, loading, router, pathname, allowedRoles]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role as any))) {
    return null;
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
}
