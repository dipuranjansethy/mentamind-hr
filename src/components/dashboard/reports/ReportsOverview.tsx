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
    <div className="space-y-6">
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        useMockData={useMockData}
        setError={setError}
        hideError={true}
      />
      
      {/* Centralized error message */}
      {error && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <div>
            {/* <p className="font-bold">Using Demo Data</p> */}
            {/* <p>The application is currently displaying demo data. {error}</p> */}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        <ReviewAnalytics 
          filters={filters} 
          useMockData={useMockData} 
          setError={setError} 
          hideError={true} 
        />
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {filters.type === 'workplace' ? 'Workplace Reviews' : 
               filters.type === 'self' ? 'Self-Reviews' : 'All Reviews'}
            </h2>
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
  );
}
