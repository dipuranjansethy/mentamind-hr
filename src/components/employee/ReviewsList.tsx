
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Review {
  _id: string;
  title: string;
  content: string;
  rating: number;
  type: 'workplace' | 'self';
  createdAt: string;
  updatedAt: string;
}

interface ReviewsListProps {
  type?: 'workplace' | 'self';
}

const ReviewsList: React.FC<ReviewsListProps> = ({ type }) => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (type) {
        queryParams.append('type', type);
      }
      queryParams.append('page', page.toString());
      
      const response = await fetch(`/api/employee/reviews?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
      
      setReviews(data.data.reviews);
      setTotalPages(data.data.pagination.pages);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [page, type]);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/employee/reviews/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete review');
      }
      
      // Refresh the list
      fetchReviews();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading reviews...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error: {error}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 mb-4">No reviews found.</p>
        <Link 
          href={`/employee/reviews/new?type=${type || 'workplace'}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create a New Review
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {type ? (type === 'workplace' ? 'Workplace Reviews' : 'Self-Reviews') : 'All Reviews'}
        </h2>
        <Link 
          href={`/employee/reviews/new?type=${type || 'workplace'}`}
          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
        >
          New Review
        </Link>
      </div>
      
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{review.title}</h3>
                <p className="text-sm text-gray-500">
                  {review.type === 'workplace' ? 'Workplace Review' : 'Self-Review'} • 
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <div className="text-yellow-500 text-lg">
                {getRatingStars(review.rating)}
              </div>
            </div>
            
            <p className="mt-2 text-gray-600 line-clamp-2">{review.content}</p>
            
            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => router.push(`/employee/reviews/${review._id}`)}
                className="px-3 py-1 text-xs text-indigo-600 hover:text-indigo-800"
              >
                View
              </button>
              <button
                onClick={() => router.push(`/employee/reviews/edit/${review._id}`)}
                className="px-3 py-1 text-xs text-green-600 hover:text-green-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="px-3 py-1 text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className="flex space-x-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
