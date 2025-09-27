'use client';

import { BellIcon, MagnifyingGlassIcon, SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';


export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Determine page title based on pathname
  useEffect(() => {
    const path = pathname?.split('/');
    if (path) {
      if (path.length <= 2) {
        setPageTitle('Dashboard Overview');
      } else {
        // Capitalize the path segment
        const segment = path[2];
        setPageTitle(segment.charAt(0).toUpperCase() + segment.slice(1));
      }
    }
  }, [pathname]);
  
  return (
    <header className="sticky top-0 z-10 px-6 py-3">
      <div className="glass rounded-xl flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
          <div className="hidden md:block ml-4 text-sm text-gray-500">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-500">Dashboard</span>
                  </div>
                </li>
                {pathname && pathname.split('/').length > 2 && (
                  <li>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="ml-2 text-gray-500 capitalize">{pathname.split('/')[2]}</span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="glass-input w-64 py-2 pl-10 pr-3 text-sm"
                placeholder="Search anything..."
              />
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 glass hover:bg-white/20 rounded-full transition-all duration-200 tooltip"
          >
            <span className="tooltip-text">Toggle theme</span>
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-indigo-500" />
            )}
          </button>
          
          {/* Settings */}
          <button className="p-2 glass hover:bg-white/20 rounded-full transition-all duration-200 tooltip">
            <span className="tooltip-text">Settings</span>
            <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Notifications */}
          <button className="p-2 glass hover:bg-white/20 rounded-full transition-all duration-200 tooltip relative">
            <span className="tooltip-text">Notifications</span>
            <BellIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          {/* Profile */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                {!loading && user && user.name ? (
                  <>
                    <p className="text-sm font-medium text-black">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role || 'User'}</p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-black">{loading ? 'Loading...' : 'Guest'}</p>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden glass bg-gradient-to-br from-indigo-500 to-purple-600">
                {!loading && user && user.name ? (
                  <span className="text-sm font-medium text-white">{user.name.charAt(0)}</span>
                ) : (
                  <span className="text-sm font-medium text-white">G</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
