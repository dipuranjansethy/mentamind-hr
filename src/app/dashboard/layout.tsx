
'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/dashboard/Header';
import { useState, useEffect } from 'react';

export const metadata = {
  title: 'Dashboard | Mentamind Corporate Wellness Suite',
  description: 'HR/Admin Dashboard for Mentamind Corporate Wellness Suite',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Add fade-in effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr']}>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className={`flex flex-col flex-1 md:pl-64 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <Header />
          
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="fade-in">
                {children}
              </div>
            </div>
          </main>
          
          <footer className="p-4 text-center text-sm text-gray-500">
            <div className="divider mb-4"></div>
            <p>© {new Date().getFullYear()} Mentamind HR Panel. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
