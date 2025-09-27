
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { get } from '@/lib/api';

interface FilterBarProps {
  filters: {
    type: string;
    department: string;
    dateRange: string;
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
  useMockData?: boolean;
  setError?: (error: string) => void;
  hideError?: boolean;
}

export default function FilterBar({ 
  filters, 
  onFilterChange,
  useMockData: externalUseMockData,
  setError: externalSetError,
  hideError = false
}: FilterBarProps) {
  const { user, loading: authLoading } = useAuth();
  const [departments, setDepartments] = useState<string[]>([]);
  const [error, setInternalError] = useState('');
  const [internalUseMockData, setInternalUseMockData] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const useMockData = externalUseMockData !== undefined ? externalUseMockData : internalUseMockData;
  
  // Function to set error that updates both internal and external state if available
  const setError = (errorMessage: string) => {
    setInternalError(errorMessage);
    if (externalSetError) {
      externalSetError(errorMessage);
    }
  };
  
  // Function to set mock data flag that updates internal state
  const setUseMockData = (value: boolean) => {
    setInternalUseMockData(value);
  };
  
  useEffect(() => {
    // Don't fetch data if still authenticating
    if (authLoading) {
      return;
    }
    
    // If authentication is complete but no user, show error
    if (!user) {
      setError('Authentication required');
      return;
    }
    
    // Fetch departments from the API
    const fetchDepartments = async () => {
      try {
        // Use our API client instead of fetch
        const data = await get('/api/admin/departments');
        setDepartments(data.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback departments
        setDepartments(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Design']);
      }
    };
    
    fetchDepartments();
  }, [user, authLoading]);
  
  // Only show error if not hidden by parent component
  if (error && !hideError) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className={`${useMockData ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded`}>
          {useMockData ? (
            <div>
              {/* <p className="font-bold">Using Demo Data</p> */}
              {/* <p>The application is currently displaying demo data. {error}</p> */}
            </div>
          ) : (
            <div>Error: {error}</div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {authLoading ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">Loading filters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Review Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Reviews</option>
            <option value="workplace">Workplace Reviews</option>
            <option value="self">Self-Reviews</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>
      )}
    </div>
  );
}
