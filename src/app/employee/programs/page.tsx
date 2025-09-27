'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: number;
  modules: number;
  progress: number;
  image: string;
  category: string;
}

const programs: Program[] = [
  {
    id: '1',
    title: 'Stress Management',
    description: 'Learn techniques to manage workplace stress and build resilience.',
    duration: 4,
    modules: 12,
    progress: 25,
    image: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    category: 'Mental Health'
  },
  {
    id: '2',
    title: 'Mindfulness Meditation',
    description: 'Daily guided meditation practices to improve focus and reduce anxiety.',
    duration: 6,
    modules: 18,
    progress: 0,
    image: 'bg-gradient-to-r from-green-500 to-teal-600',
    category: 'Mindfulness'
  },
  {
    id: '3',
    title: 'Better Sleep Habits',
    description: 'Improve your sleep quality and establish healthy sleep routines.',
    duration: 3,
    modules: 9,
    progress: 0,
    image: 'bg-gradient-to-r from-purple-500 to-pink-600',
    category: 'Physical Health'
  },
  {
    id: '4',
    title: 'Work-Life Balance',
    description: 'Strategies for maintaining a healthy balance between work and personal life.',
    duration: 4,
    modules: 12,
    progress: 0,
    image: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    category: 'Work-Life'
  },
  {
    id: '5',
    title: 'Emotional Intelligence',
    description: 'Develop your emotional intelligence to improve relationships and communication.',
    duration: 5,
    modules: 15,
    progress: 0,
    image: 'bg-gradient-to-r from-red-500 to-pink-600',
    category: 'Mental Health'
  },
  {
    id: '6',
    title: 'Digital Detox',
    description: 'Learn how to establish healthy boundaries with technology.',
    duration: 2,
    modules: 6,
    progress: 0,
    image: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    category: 'Work-Life'
  }
];

export default function WellnessPrograms() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['All', 'Mental Health', 'Mindfulness', 'Physical Health', 'Work-Life'];
  
  const filteredPrograms = programs.filter(program => {
    const matchesCategory = filter === 'All' || program.category === filter;
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Wellness Programs
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Structured programs to help you improve your well-being.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col mt-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search Programs</label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select
            id="category"
            name="category"
            className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="overflow-hidden bg-white rounded-lg shadow">
            <div className={`h-24 ${program.image}`}></div>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{program.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {program.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{program.description}</p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                <span>{program.duration} weeks • {program.modules} modules</span>
              </div>
              
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
                    <div className="flex justify-between mt-4">
                      <Link
                        href={`/employee/programs/${program.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Continue
                      </Link>
                      <button className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        View Details
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between mt-4">
                    <Link
                      href={`/employee/programs/${program.id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Start Program
                    </Link>
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* In Progress Section */}
      <div className="mt-10">
        <h2 className="text-xl font-medium text-gray-900">Your Progress</h2>
        <div className="overflow-hidden bg-white rounded-lg shadow mt-4">
          <div className="px-4 py-5 sm:p-6">
            {programs.some(p => p.progress > 0) ? (
              <div className="space-y-4">
                {programs
                  .filter(p => p.progress > 0)
                  .map(program => (
                    <div key={program.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg ${program.image} flex items-center justify-center`}>
                          <span className="text-white font-bold">{program.progress}%</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{program.title}</h3>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <CheckCircleIcon className="flex-shrink-0 mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span>{Math.round(program.modules * program.progress / 100)} of {program.modules} modules completed</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/employee/programs/${program.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                      >
                        Continue
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">You haven't started any programs yet.</p>
                <p className="mt-2 text-sm text-gray-500">Select a program above to begin your wellness journey.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Section */}
      <div className="mt-10">
        <h2 className="text-xl font-medium text-gray-900">Recommended For You</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
          <div className="overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-white">Stress Management</h3>
              <p className="mt-2 text-indigo-100">
                Based on your recent wellness data, this program could help you manage stress more effectively.
              </p>
              <div className="mt-4">
                <Link
                  href="/employee/programs/1"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-indigo-700 bg-white border border-transparent rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  View Program
                </Link>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-white">Mindfulness Meditation</h3>
              <p className="mt-2 text-green-100">
                Regular meditation can help improve your focus and reduce anxiety levels.
              </p>
              <div className="mt-4">
                <Link
                  href="/employee/programs/2"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-green-700 bg-white border border-transparent rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  View Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
