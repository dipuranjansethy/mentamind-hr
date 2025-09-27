'use client';
import React, { useState } from 'react';
import ReviewAnalytics from './ReviewAnalytics';
import ReviewsList from './ReviewsList';
import FilterBar from './FilterBar';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsOverview() {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState({
    type: 'all',
    department: '',
    dateRange: '30',
    sortBy: 'recent'
  });
  const [useMockData, setUseMockData] = useState(false);
  const [error, setError] = useState('');
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Check authentication status when component loads
  React.useEffect(() => {
    if (!authLoading && !user) {
      setError('Authentication required - Using demo data');
      setUseMockData(true);
    }
  }, [user, authLoading]);

  return (
    <div className="space-y-8 stagger-show">
      <div className="stagger-item">
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          useMockData={useMockData}
          setError={setError}
          hideError={true}
        />
      </div>
      
      {/* Centralized error message */}
      {error && (
        <div className="glass border-blue-400/30 text-blue-700 px-6 py-4 rounded-xl mb-6 shadow-lg fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>Using demo data for preview purposes</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        <div className="stagger-item">
          <div className="card-gradient p-1">
            <div className="glass-card p-0 overflow-hidden">
              <ReviewAnalytics 
                filters={filters} 
                useMockData={useMockData} 
                setError={setError} 
                hideError={true} 
              />
            </div>
          </div>
        </div>
        
        <div className="stagger-item card-3d">
          <div className="card-3d-inner">
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-gray-200/30 flex justify-between items-center">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  {filters.type === 'workplace' ? 'Workplace Reviews' : 
                  filters.type === 'self' ? 'Self-Reviews' : 'All Reviews'}
                </h2>
                <div className="flex space-x-2">
                  <div className="badge badge-primary">
                    {filters.dateRange === 'all' ? 'All Time' : `Last ${filters.dateRange} Days`}
                  </div>
                  {filters.department && (
                    <div className="badge badge-secondary">
                      {filters.department}
                    </div>
                  )}
                </div>
              </div>
              
              <ReviewsList 
                filters={filters} 
                useMockData={useMockData} 
                setError={setError} 
                hideError={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
