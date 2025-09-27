'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for a single review when authentication fails
const MOCK_REVIEW = {
  _id: '1',
  title: 'Annual Workplace Environment Review',
  content: 'The office environment is conducive to productivity. The open floor plan promotes collaboration, though it can sometimes be noisy.',
  rating: 4,
  type: 'workplace',
  suggestions: 'Consider adding more quiet spaces for focused work.',
  anonymous: false,
  department: 'Engineering',
  isArchived: false,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  userId: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    department: 'Engineering',
    position: 'Senior Developer'
  }
};

export default function ReviewDetailClient({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [review, setReview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  
  useEffect(() => {
    // Don't fetch data if still authenticating
    if (authLoading) {
      return;
    }
    
    // If authentication is complete but no user, use mock data
    if (!user) {
      setError('Authentication required - Using demo data');
      setUseMockData(true);
      // Use mock data with the requested ID
      setReview({...MOCK_REVIEW, _id: reviewId});
      setLoading(false);
      return;
    }
    
    const fetchReview = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/admin/reviews/${reviewId}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch review');
        }
        
        setReview(data.data);
        setUseMockData(false);
      } catch (err: any) {
        console.error('API error, falling back to mock data:', err);
        setError('API error - Using demo data');
        setUseMockData(true);
        // Use mock data with the requested ID
        setReview({...MOCK_REVIEW, _id: reviewId});
      } finally {
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId, user, authLoading]);
  
  const handleArchiveToggle = async () => {
    if (!review) return;
    
    // If using mock data, just update the UI without API call
    if (useMockData) {
      setIsArchiving(true);
      // Simulate a delay
      setTimeout(() => {
        setReview((prev: any) => prev ? {...prev, isArchived: !prev.isArchived} : null);
        setIsArchiving(false);
      }, 500);
      return;
    }
    
    try {
      setIsArchiving(true);
      
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isArchived: !review.isArchived
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update review');
      }
      
      setReview(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // If API call fails, just update the UI
      setReview((prev: any) => prev ? {...prev, isArchived: !prev.isArchived} : null);
    } finally {
      setIsArchiving(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  
  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-black font-medium">Loading review...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && !useMockData) {
    return (
      <div className="glass-card p-6">
        <div className="glass border-red-400/30 text-red-700 px-6 py-4 rounded-xl shadow-lg flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Error: {error}
        </div>
      </div>
    );
  }
  
  // Function to render the review content
  const renderReviewContent = () => {
    if (!review) return null;
    
    return (
      <div className="glass-card p-6">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{review.title}</h2>
              <p className="text-gray-800 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                  {review.type === 'workplace' ? 'Workplace Review' : 'Self-Review'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {review.department}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(review.createdAt)}
                </span>
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full backdrop-blur-sm ${
                review.isArchived ? 'bg-gray-100/70 text-gray-800' : 'bg-green-100/70 text-green-800'
              }`}>
                {review.isArchived ? 'Archived' : 'Active'}
              </span>
              <span className="text-yellow-500 text-xl bg-yellow-50/50 px-3 py-1 rounded-full backdrop-blur-sm">
                {getRatingStars(review.rating)}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 text-black flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Review Content
            </h3>
            <div className="glass p-5 rounded-xl whitespace-pre-wrap text-black">
              {review.content}
            </div>
          </div>
          
          {review.suggestions && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3 text-black flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Suggestions for Improvement
              </h3>
              <div className="glass p-5 rounded-xl whitespace-pre-wrap text-black">
                {review.suggestions}
              </div>
            </div>
          )}
          
          {!review.anonymous && review.userId && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3 text-black flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Employee Information
              </h3>
              <div className="glass p-5 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-4 rounded-lg hover-lift">
                    <p className="text-sm text-gray-700 mb-1">Name</p>
                    <p className="font-medium text-black text-lg">{review.userId.name}</p>
                  </div>
                  <div className="glass p-4 rounded-lg hover-lift">
                    <p className="text-sm text-gray-700 mb-1">Email</p>
                    <p className="font-medium text-black text-lg">{review.userId.email}</p>
                  </div>
                  <div className="glass p-4 rounded-lg hover-lift">
                    <p className="text-sm text-gray-700 mb-1">Department</p>
                    <p className="font-medium text-black text-lg">{review.userId.department}</p>
                  </div>
                  <div className="glass p-4 rounded-lg hover-lift">
                    <p className="text-sm text-gray-700 mb-1">Position</p>
                    <p className="font-medium text-black text-lg">{review.userId.position}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {review.anonymous && (
            <div className="mb-8">
              <div className="glass bg-yellow-50/30 p-5 rounded-xl border border-yellow-200/30 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-700">
                    <span className="font-medium">Note:</span> This review was submitted anonymously.
                    Employee information is not available.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end items-center">
            <button
              onClick={handleArchiveToggle}
              disabled={isArchiving}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center ${
                review.isArchived
                  ? 'glass-button bg-green-500/80 text-white hover:bg-green-600/80'
                  : 'glass-button bg-gray-500/80 text-white hover:bg-gray-600/80'
              }`}
            >
              {isArchiving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : review.isArchived ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Unarchive Review
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Archive Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  if (error && useMockData) {
    // Just show a small info banner when using mock data
    return (
      <div className="glass-card">
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20 text-blue-700 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-blue-800">Preview mode</p>
          </div>
        </div>
        {renderReviewContent()}
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className="glass-card p-6">
        <div className="flex justify-center items-center h-64 flex-col">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-black font-medium">Review not found</p>
          <p className="text-gray-500 mt-2">The requested review could not be found.</p>
        </div>
      </div>
    );
  }
  
  // For regular rendering (no errors or using real data)
  return renderReviewContent();
}
