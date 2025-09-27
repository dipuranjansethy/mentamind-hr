'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  HeartIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/employee', icon: HomeIcon },
  { name: 'Wellness Tracker', href: '/employee/wellness', icon: HeartIcon },
  { name: 'Programs', href: '/employee/programs', icon: CalendarIcon },
  { name: 'Journal', href: '/employee/journal', icon: BookOpenIcon },
  { name: 'Community', href: '/employee/community', icon: ChatBubbleLeftRightIcon },
  { name: 'Profile', href: '/employee/profile', icon: UserCircleIcon },
];

export default function EmployeeNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.location.href = '/auth/login';
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
          className="p-2 text-gray-400 bg-indigo-600 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="relative flex flex-col w-full max-w-xs h-full bg-indigo-700 pt-5 pb-4 overflow-y-auto">
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-shrink-0 px-4 flex items-center">
            <span className="text-xl font-bold text-white">Mentamind</span>
          </div>
          
          <div className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon
                  className="mr-4 h-6 w-6 text-indigo-300"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
            >
              <svg
                className="mr-4 h-6 w-6 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-indigo-700 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 h-16">
            <span className="text-xl font-bold text-white">Mentamind</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 text-indigo-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Loading...'}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-indigo-200 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
