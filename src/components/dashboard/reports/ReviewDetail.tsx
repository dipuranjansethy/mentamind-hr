'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { get, put } from '@/lib/api';

export interface ReviewDetailProps {
  id: string;
}

interface Review {
  _id: string;
  title: string;
  content: string;
  rating: number;
  type: 'workplace' | 'self';
  suggestions: string;
  anonymous: boolean;
  department: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: {
    name: string;
    email: string;
    department: string;
    position: string;
  };
}

export default function ReviewDetail({ id }: ReviewDetailProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);
  
  useEffect(() => {
    // Don't fetch data if still authenticating
    if (authLoading) {
      return;
    }
    
    // If authentication is complete but no user, show error
    if (!user) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use our API client instead of fetch
        const data = await get(`/api/admin/reviews/${id}`);
        setReview(data.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [id, user, authLoading]);
  
  const handleArchiveToggle = async () => {
    if (!review) return;
    
    try {
      setIsArchiving(true);
      
      // Use our API client instead of fetch
      const data = await put(`/api/admin/reviews/${id}`, {
        isArchived: !review.isArchived
      });
      
      setReview(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
          <p className="text-gray-500">Loading review...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Review not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{review.title}</h2>
            <p className="text-gray-500 mt-1">
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
      
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Review Content</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {review.content}
          </div>
        </div>
        
        {review.suggestions && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Suggestions for Improvement</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {review.suggestions}
            </div>
          </div>
        )}
        
        {!review.anonymous && review.userId && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Employee Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{review.userId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{review.userId.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{review.userId.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{review.userId.position}</p>
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
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Reviews
          </button>
          
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
}
