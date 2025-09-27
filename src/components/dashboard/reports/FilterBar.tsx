
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
      <div className="glass-card p-6">
        <div className={`${useMockData ? 'glass border-blue-400/30 text-blue-700' : 'glass border-red-400/30 text-red-700'} border px-6 py-4 rounded-xl shadow-lg`}>
          {useMockData ? (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p>Using demo data for preview purposes</p>
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Error: {error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Filter Reviews
        </h3>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm text-gray-600">Customize your view</span>
        </div>
      </div>
      
      {authLoading ? (
        <div className="p-8 text-center">
          <div className="loader mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading filters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-4 rounded-lg hover-lift">
            <label htmlFor="type" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Review Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={(e) => onFilterChange({ type: e.target.value })}
              className="glass-input w-full px-4 py-2.5"
            >
              <option value="all">All Reviews</option>
              <option value="workplace">Workplace Reviews</option>
              <option value="self">Self-Reviews</option>
            </select>
          </div>
          
          <div className="glass p-4 rounded-lg hover-lift">
            <label htmlFor="department" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Department
            </label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="glass-input w-full px-4 py-2.5"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          <div className="glass p-4 rounded-lg hover-lift">
            <label htmlFor="dateRange" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={filters.dateRange}
              onChange={(e) => onFilterChange({ dateRange: e.target.value })}
              className="glass-input w-full px-4 py-2.5"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          
          <div className="glass p-4 rounded-lg hover-lift">
            <label htmlFor="sortBy" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="glass-input w-full px-4 py-2.5"
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
