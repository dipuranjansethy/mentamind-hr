'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Employee Management', href: '/dashboard/employees', icon: UsersIcon },
  { name: 'Reports & Insights', href: '/dashboard/reports', icon: DocumentTextIcon },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: BellIcon },
  // { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, loading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 flex items-center p-4 md:hidden">
        <button
          type="button"
          className="p-2 text-white glass-button hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex flex-col flex-1 w-full max-w-xs glass-sidebar">
          <div className="absolute top-0 right-0 pt-2 -mr-12">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4 py-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">Mentamind</span>
            </div>
            <nav className="px-3 mt-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                      ? 'bg-indigo-600/80 text-white backdrop-blur-sm'
                      : 'text-indigo-100 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      pathname === item.href ? 'text-white' : 'text-indigo-200'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 p-4 border-t border-indigo-100/20">
            <button
              onClick={handleLogout}
              className="flex items-center w-full group transition-all duration-200 hover:bg-white/10 rounded-xl p-2"
            >
              <div className="flex items-center justify-center w-10 h-10 text-white bg-gradient-to-r from-rose-400 to-red-500 rounded-lg shadow-lg">
                <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">Logout</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 glass-sidebar">
          <div className="flex items-center justify-center flex-shrink-0 h-20 px-4 border-b border-indigo-100/20">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">Mentamind</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-3 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover-lift ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                      ? 'bg-indigo-600/80 text-white backdrop-blur-sm'
                      : 'text-indigo-100 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href ? 'text-white' : 'text-indigo-200'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 p-4 border-t border-indigo-100/20">
            <button
              onClick={handleLogout}
              className="flex items-center w-full group transition-all duration-200 hover:bg-white/10 rounded-xl p-2"
            >
              <div className="flex items-center justify-center w-8 h-8 text-white bg-gradient-to-r from-rose-400 to-red-500 rounded-lg shadow-lg">
                <ArrowRightOnRectangleIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Logout</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
