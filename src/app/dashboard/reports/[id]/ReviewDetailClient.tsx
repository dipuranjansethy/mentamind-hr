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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-black font-medium">Loading review...</p>
        </div>
      </div>
    );
  }
  
  if (error && !useMockData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }
  
  // Function to render the review content
  const renderReviewContent = () => {
    if (!review) return null;
    
    return (
      <div className="bg-white rounded-lg">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-black">{review.title}</h2>
              <p className="text-gray-800 mt-1">
                {review.type === 'workplace' ? 'Workplace Review' : 'Self-Review'} • 
                {review.department} • 
                {formatDate(review.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                review.isArchived ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
              }`}>
                {review.isArchived ? 'Archived' : 'Active'}
              </span>
              <span className="text-yellow-500 text-xl">
                {getRatingStars(review.rating)}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2 text-black">Review Content</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-black">
              {review.content}
            </div>
          </div>
          
          {review.suggestions && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2 text-black">Suggestions for Improvement</h3>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-black">
                {review.suggestions}
              </div>
            </div>
          )}
          
          {!review.anonymous && review.userId && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2 text-black">Employee Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-700">Name</p>
                    <p className="font-medium text-black">{review.userId.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Email</p>
                    <p className="font-medium text-black">{review.userId.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Department</p>
                    <p className="font-medium text-black">{review.userId.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Position</p>
                    <p className="font-medium text-black">{review.userId.position}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {review.anonymous && (
            <div className="mb-8">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-700">
                  <span className="font-medium">Note:</span> This review was submitted anonymously.
                  Employee information is not available.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end items-center">
            <button
              onClick={handleArchiveToggle}
              disabled={isArchiving}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                review.isArchived
                  ? 'border-green-300 text-green-700 hover:bg-green-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isArchiving ? 'Processing...' : review.isArchived ? 'Unarchive Review' : 'Archive Review'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  if (error && useMockData) {
    // Just show a small info banner when using mock data
    return (
      <div className="bg-white rounded-lg">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="text-sm font-medium text-blue-800">Preview mode</p>
        </div>
        {renderReviewContent()}
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-black font-medium">Review not found</p>
        </div>
      </div>
    );
  }
  
  // For regular rendering (no errors or using real data)
  return renderReviewContent();
}
