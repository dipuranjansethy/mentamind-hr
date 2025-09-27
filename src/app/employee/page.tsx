'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function EmployeeDashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [wellnessScore, setWellnessScore] = useState(78);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleMoodSelection = (score: number) => {
    setTodayMood(score);
    // In a real app, we would send this to the API
  };
  
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          {loading ? 'Loading...' : `Welcome, ${user?.name || 'User'}`}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Wellness Score */}
      <div className="mt-6">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-md">
                <HeartIconSolid className="w-6 h-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Your Wellness Score
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{wellnessScore}/100</div>
                  </dd>
                </dl>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${wellnessScore}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Mood */}
      <div className="mt-6">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">How are you feeling today?</h3>
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleMoodSelection(score)}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    todayMood === score ? 'bg-indigo-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl" role="img" aria-label={`Mood ${score}`}>
                    {score === 1 ? '😢' : 
                     score === 2 ? '😕' : 
                     score === 3 ? '😐' : 
                     score === 4 ? '🙂' : '😄'}
                  </span>
                  <span className="mt-2 text-xs text-gray-500">
                    {score === 1 ? 'Very Bad' : 
                     score === 2 ? 'Bad' : 
                     score === 3 ? 'Okay' : 
                     score === 4 ? 'Good' : 'Great'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/employee/wellness" className="block overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-md">
                  <HeartIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <h3 className="text-sm font-medium text-gray-900 truncate">Track Wellness</h3>
                  <p className="text-sm text-gray-500">Log your daily metrics</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/employee/programs" className="block overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                  <CalendarIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <h3 className="text-sm font-medium text-gray-900 truncate">Wellness Programs</h3>
                  <p className="text-sm text-gray-500">Continue your journey</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/employee/journal" className="block overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                  <BookOpenIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <h3 className="text-sm font-medium text-gray-900 truncate">Journal</h3>
                  <p className="text-sm text-gray-500">Write your thoughts</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/employee/community" className="block overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="flex-1 w-0 ml-5">
                  <h3 className="text-sm font-medium text-gray-900 truncate">Community</h3>
                  <p className="text-sm text-gray-500">Connect with peers</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recommended Programs */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recommended for You</h2>
          <Link href="/employee/programs" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: 'Stress Management', 
              description: 'Learn techniques to manage workplace stress',
              progress: 25,
              image: 'bg-gradient-to-r from-blue-500 to-indigo-600'
            },
            { 
              title: 'Mindfulness Meditation', 
              description: 'Daily guided meditation practices',
              progress: 0,
              image: 'bg-gradient-to-r from-green-500 to-teal-600'
            },
            { 
              title: 'Better Sleep Habits', 
              description: 'Improve your sleep quality and routine',
              progress: 0,
              image: 'bg-gradient-to-r from-purple-500 to-pink-600'
            }
          ].map((program, idx) => (
            <div key={idx} className="overflow-hidden bg-white rounded-lg shadow">
              <div className={`h-24 ${program.image}`}></div>
              <div className="px-4 py-4">
                <h3 className="text-lg font-medium text-gray-900">{program.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{program.description}</p>
                <div className="mt-4">
                  {program.progress > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-indigo-600">{program.progress}%</span>
                      </div>
                      <div className="mt-1 relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div 
                            style={{ width: `${program.progress}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Start Program
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Daily Tip */}
      <div className="mt-6">
        <div className="overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-white">Daily Wellness Tip</h3>
            <p className="mt-2 text-white">
              Taking short breaks throughout your workday can significantly improve your focus and productivity. 
              Try the 5-minute mindfulness exercise in your wellness program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
