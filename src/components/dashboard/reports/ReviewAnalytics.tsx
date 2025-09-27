'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { get } from '@/lib/api';
import { MOCK_ANALYTICS } from './MockAnalytics';

interface ReviewAnalyticsProps {
  filters: {
    type: string;
    department: string;
    dateRange: string;
    sortBy: string;
  };
  useMockData?: boolean;
  setError?: (error: string) => void;
  hideError?: boolean;
}

interface AnalyticsData {
  overview: {
    totalReviews: number;
    workplaceReviews: number;
    selfReviews: number;
  };
  avgRatingsByType: {
    workplace?: {
      avgRating: number;
      count: number;
    };
    self?: {
      avgRating: number;
      count: number;
    };
  };
  departmentAnalytics: Record<string, {
    workplace?: {
      avgRating: number;
      count: number;
    };
    self?: {
      avgRating: number;
      count: number;
    };
  }>;
  ratingDistribution: {
    workplace?: Record<string, number>;
    self?: Record<string, number>;
  };
  monthlyTrend: Record<string, {
    workplace?: {
      avgRating: number;
      count: number;
    };
    self?: {
      avgRating: number;
      count: number;
    };
  }>;
}

export default function ReviewAnalytics({ 
  filters,
  useMockData: externalUseMockData,
  setError: externalSetError,
  hideError = false
}: ReviewAnalyticsProps) {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
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
    // If we're already using mock data, just set it
    if (useMockData) {
      setAnalytics(MOCK_ANALYTICS);
      setLoading(false);
      return;
    }
    
    // Don't fetch data if still authenticating
    if (authLoading) {
      return;
    }
    
    // If authentication is complete but no user, use mock data
    if (!user) {
      setError('Authentication required - Using demo data');
      setUseMockData(true);
      setAnalytics(MOCK_ANALYTICS);
      setLoading(false);
      return;
    }
    
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (filters.type !== 'all') {
          queryParams.append('type', filters.type);
        }
        
        if (filters.department) {
          queryParams.append('department', filters.department);
        }
        
        if (filters.dateRange !== 'all') {
          const endDate = new Date().toISOString();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - parseInt(filters.dateRange));
          
          queryParams.append('startDate', startDate.toISOString());
          queryParams.append('endDate', endDate);
        }
        
        try {
          // Use our API client instead of fetch
          const data = await get(`/api/admin/reviews?${queryParams.toString()}`);
          setAnalytics(data.data.analytics);
          setUseMockData(false); // We got real data, don't use mock data
        } catch (apiError) {
          console.error('API error, falling back to mock data:', apiError);
          setError('API error - Using demo data');
          setUseMockData(true);
          setAnalytics(MOCK_ANALYTICS);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        // Fall back to mock data
        setUseMockData(true);
        setAnalytics(MOCK_ANALYTICS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [filters, user, authLoading, useMockData]);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  // Only show error if not hidden by parent component
  if (error && !hideError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className={`${useMockData ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded`}>
          {useMockData ? (
            <div>
              {/* <p className="font-bold">Using Demo Data</p> */}
              {/* <p>The application is currently displaying demo analytics. {error}</p> */}
            </div>
          ) : (
            <div>Error: {error}</div>
          )}
        </div>
      </div>
    );
  }
  
  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    );
  }
  
  // Format rating for display with stars
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };
  
  // Get departments sorted by workplace review rating
  const sortedDepartments = Object.entries(analytics.departmentAnalytics || {})
    .sort(([, a], [, b]) => {
      const aRating = a.workplace?.avgRating || 0;
      const bRating = b.workplace?.avgRating || 0;
      return bRating - aRating;
    })
    .slice(0, 5); // Top 5 departments
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Review Analytics</h2>
      </div>
      
      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Total Reviews</h3>
            <p className="text-2xl font-bold text-blue-900">{analytics.overview.totalReviews}</p>
            <div className="mt-2 text-sm text-blue-700">
              <span className="font-medium">{analytics.overview.workplaceReviews}</span> workplace,{' '}
              <span className="font-medium">{analytics.overview.selfReviews}</span> self-reviews
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Avg. Workplace Rating</h3>
            <p className="text-2xl font-bold text-green-900">
              {formatRating(analytics.avgRatingsByType.workplace?.avgRating || 0)}
              <span className="text-lg"> / 5</span>
            </p>
            <div className="mt-2 text-sm text-green-700">
              From <span className="font-medium">{analytics.avgRatingsByType.workplace?.count || 0}</span> reviews
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Avg. Self-Review Rating</h3>
            <p className="text-2xl font-bold text-purple-900">
              {formatRating(analytics.avgRatingsByType.self?.avgRating || 0)}
              <span className="text-lg"> / 5</span>
            </p>
            <div className="mt-2 text-sm text-purple-700">
              From <span className="font-medium">{analytics.avgRatingsByType.self?.count || 0}</span> reviews
            </div>
          </div>
        </div>
        
        {/* Department Ratings */}
        <div className="mb-8">
          <h3 className="text-md font-medium mb-3">Department Ratings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workplace Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Self-Review Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Reviews
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDepartments.map(([dept, data]) => (
                  <tr key={dept}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRating(data.workplace?.avgRating || 0)} / 5
                      <span className="text-xs text-gray-400 ml-1">
                        ({data.workplace?.count || 0})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRating(data.self?.avgRating || 0)} / 5
                      <span className="text-xs text-gray-400 ml-1">
                        ({data.self?.count || 0})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(data.workplace?.count || 0) + (data.self?.count || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Rating Distribution */}
        <div className="mb-8">
          <h3 className="text-md font-medium mb-3">Rating Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">Workplace Reviews</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = analytics.ratingDistribution.workplace?.[rating] || 0;
                  const total = analytics.avgRatingsByType.workplace?.count || 1;
                  const percentage = Math.round((count / total) * 100) || 0;
                  
                  return (
                    <div key={rating} className="flex items-center">
                      <span className="text-sm w-6">{rating}</span>
                      <div className="flex-1 mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-10 text-right">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700">Self-Reviews</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = analytics.ratingDistribution.self?.[rating] || 0;
                  const total = analytics.avgRatingsByType.self?.count || 1;
                  const percentage = Math.round((count / total) * 100) || 0;
                  
                  return (
                    <div key={rating} className="flex items-center">
                      <span className="text-sm w-6">{rating}</span>
                      <div className="flex-1 mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-10 text-right">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Trend */}
        <div>
          <h3 className="text-md font-medium mb-3">Monthly Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <p className="text-gray-500">
              Chart visualization would be implemented here with a charting library like Chart.js or Recharts
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Monthly average ratings over time
          </p>
        </div>
      </div>
    </div>
  );
}
