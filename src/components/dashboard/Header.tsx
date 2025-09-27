'use client';

import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';


export default function Header({ title }: { title: string }) {
  const { user, loading } = useAuth();
  
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search"
            />
          </div>
        </div>
        
        {/* Notifications */}
        <button
          type="button"
          className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        
        {/* Profile dropdown */}
        <div className="relative ml-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
              {!loading && user && user.name ? (
                <span className="text-sm font-medium">{user.name.charAt(0)}</span>
              ) : (
                <span className="text-sm font-medium">U</span>
              )}
            </div>
            <div className="hidden ml-3 md:block">
              {!loading && user && user.name ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role || 'User'}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{loading ? 'Loading...' : 'Guest'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
