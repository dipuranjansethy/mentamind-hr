'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface Module {
  id: number;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

interface ProgramDetails {
  id: string;
  title: string;
  description: string;
  duration: number;
  progress: number;
  image: string;
  category: string;
  modules: Module[];
}

// Mock data for program details
const programsData: Record<string, ProgramDetails> = {
  '1': {
    id: '1',
    title: 'Stress Management',
    description: 'Learn techniques to manage workplace stress and build resilience. This program will help you identify stress triggers and develop effective coping strategies.',
    duration: 4,
    progress: 25,
    image: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    category: 'Mental Health',
    modules: [
      {
        id: 1,
        title: 'Understanding Stress',
        description: 'Learn about the science of stress and how it affects your body and mind.',
        duration: 15,
        completed: true,
        locked: false
      },
      {
        id: 2,
        title: 'Identifying Stress Triggers',
        description: 'Techniques to recognize what causes stress in your work environment.',
        duration: 20,
        completed: true,
        locked: false
      },
      {
        id: 3,
        title: 'Quick Stress Relief Techniques',
        description: 'Fast and effective methods to reduce stress in the moment.',
        duration: 25,
        completed: true,
        locked: false
      },
      {
        id: 4,
        title: 'Building Resilience',
        description: 'Develop long-term strategies to build your stress resilience.',
        duration: 30,
        completed: false,
        locked: false
      },
      {
        id: 5,
        title: 'Mindfulness for Stress',
        description: 'Using mindfulness practices to manage stress responses.',
        duration: 20,
        completed: false,
        locked: true
      },
      {
        id: 6,
        title: 'Cognitive Restructuring',
        description: 'Change stress-inducing thought patterns.',
        duration: 25,
        completed: false,
        locked: true
      },
      {
        id: 7,
        title: 'Healthy Boundaries',
        description: 'Setting boundaries to prevent stress at work.',
        duration: 20,
        completed: false,
        locked: true
      },
      {
        id: 8,
        title: 'Time Management',
        description: 'Techniques to manage your time effectively and reduce stress.',
        duration: 25,
        completed: false,
        locked: true
      },
      {
        id: 9,
        title: 'Stress and Sleep',
        description: 'Understanding the relationship between stress and sleep quality.',
        duration: 20,
        completed: false,
        locked: true
      },
      {
        id: 10,
        title: 'Physical Activity for Stress Relief',
        description: 'Using exercise and movement to combat stress.',
        duration: 15,
        completed: false,
        locked: true
      },
      {
        id: 11,
        title: 'Nutrition and Stress',
        description: 'How diet affects your stress levels and what to eat for better stress management.',
        duration: 20,
        completed: false,
        locked: true
      },
      {
        id: 12,
        title: 'Creating Your Stress Management Plan',
        description: 'Develop a personalized plan to manage stress long-term.',
        duration: 30,
        completed: false,
        locked: true
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Mindfulness Meditation',
    description: 'Daily guided meditation practices to improve focus and reduce anxiety. Learn techniques from basic to advanced mindfulness.',
    duration: 6,
    progress: 0,
    image: 'bg-gradient-to-r from-green-500 to-teal-600',
    category: 'Mindfulness',
    modules: [
      {
        id: 1,
        title: 'Introduction to Mindfulness',
        description: 'Learn the basics of mindfulness meditation and its benefits.',
        duration: 15,
        completed: false,
        locked: false
      },
      {
        id: 2,
        title: 'Breath Awareness',
        description: 'Focus on your breath as an anchor for mindfulness practice.',
        duration: 10,
        completed: false,
        locked: true
      },
      // More modules would be listed here
    ]
  }
};

export default function ProgramDetails() {
  const params = useParams();
  const programId = params.id as string;
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch this data from the API
    setProgram(programsData[programId]);
    setLoading(false);
  }, [programId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
      </div>
    );
  }
  
  if (!program) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Program Not Found</h2>
          <p className="mt-2 text-gray-600">The program you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              href="/employee/programs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/employee/programs"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Back to Programs
        </Link>
      </div>
      
      <div className={`h-32 ${program.image} rounded-lg flex items-center justify-center`}>
        <h1 className="text-3xl font-bold text-white">{program.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-medium text-gray-900">Program Modules</h2>
              <p className="mt-1 text-sm text-gray-500">
                Complete each module to progress through the program.
              </p>
              
              <div className="mt-6 space-y-4">
                {program.modules.map((module) => (
                  <div 
                    key={module.id} 
                    className={`p-4 border rounded-lg ${
                      module.completed 
                        ? 'bg-green-50 border-green-200' 
                        : module.locked 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          module.completed 
                            ? 'bg-green-100 text-green-600' 
                            : module.locked 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {module.completed ? (
                            <CheckCircleIcon className="w-6 h-6" />
                          ) : module.locked ? (
                            <LockClosedIcon className="w-6 h-6" />
                          ) : (
                            <PlayIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-sm font-medium ${
                            module.locked ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {module.title}
                          </h3>
                          <p className={`mt-1 text-xs ${
                            module.locked ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4 text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>{module.duration} min</span>
                        </div>
                        
                        {!module.locked && !module.completed && (
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Start
                          </button>
                        )}
                        
                        {module.completed && (
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Program Details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{program.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1 text-sm text-gray-900">{program.duration} weeks</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-sm text-gray-900">{program.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        {program.modules.filter(m => m.completed).length} of {program.modules.length} modules completed
                      </span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Resources</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Stress Management Workbook (PDF)
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Guided Meditation Audio
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Additional Reading Materials
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
