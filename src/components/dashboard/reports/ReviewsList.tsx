'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { get, put } from '@/lib/api';
import ReviewDetailClient from '@/app/dashboard/reports/[id]/ReviewDetailClient';

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
  userId?: {
    name: string;
    email: string;
    department: string;
    position: string;
  };
}

interface ReviewsListProps {
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

// Mock data for demonstration purposes
const MOCK_REVIEWS: Review[] = [
  {
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
  },
  {
    _id: '2',
    title: 'Q3 Self-Review',
    content: 'I believe I have met most of my objectives for this quarter. I completed the new feature implementation ahead of schedule.',
    rating: 4,
    type: 'self',
    suggestions: 'I could improve my documentation practices.',
    anonymous: false,
    department: 'Engineering',
    isArchived: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Morgan Smith',
      email: 'morgan.smith@example.com',
      department: 'Engineering',
      position: 'Frontend Developer'
    }
  },
  {
    _id: '3',
    title: 'Workplace Wellness Feedback',
    content: 'The recent wellness initiatives have been helpful. The meditation sessions are particularly beneficial for stress management.',
    rating: 5,
    type: 'workplace',
    suggestions: 'Perhaps add some physical fitness activities as well.',
    anonymous: true,
    department: 'Marketing',
    isArchived: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '4',
    title: 'Mid-Year Self-Assessment',
    content: 'I have been working on improving my project management skills and have seen positive results in meeting deadlines.',
    rating: 3,
    type: 'self',
    suggestions: 'Need to work on better prioritization of tasks.',
    anonymous: false,
    department: 'Sales',
    isArchived: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Jamie Williams',
      email: 'jamie.williams@example.com',
      department: 'Sales',
      position: 'Account Executive'
    }
  },
  {
    _id: '5',
    title: 'Office Environment Review',
    content: 'The new office layout has improved team communication. However, the temperature control remains an issue.',
    rating: 3,
    type: 'workplace',
    suggestions: 'Better temperature regulation would improve comfort.',
    anonymous: true,
    department: 'HR',
    isArchived: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '6',
    title: 'Q2 Performance Self-Review',
    content: 'I exceeded my sales targets by 15% this quarter and improved customer retention rates.',
    rating: 5,
    type: 'self',
    suggestions: 'Could benefit from additional product training.',
    anonymous: false,
    department: 'Sales',
    isArchived: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Taylor Reed',
      email: 'taylor.reed@example.com',
      department: 'Sales',
      position: 'Sales Manager'
    }
  },
  {
    _id: '7',
    title: 'Workplace Ergonomics Feedback',
    content: 'The new ergonomic chairs are a significant improvement. My back pain has decreased considerably.',
    rating: 4,
    type: 'workplace',
    suggestions: 'Consider providing adjustable standing desks as an option.',
    anonymous: false,
    department: 'Finance',
    isArchived: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Jordan Casey',
      email: 'jordan.casey@example.com',
      department: 'Finance',
      position: 'Financial Analyst'
    }
  },
  {
    _id: '8',
    title: 'Annual Self-Evaluation',
    content: 'I have grown significantly in my role this year, taking on additional responsibilities and mentoring junior team members.',
    rating: 4,
    type: 'self',
    suggestions: 'Would like to develop more leadership skills.',
    anonymous: false,
    department: 'Product',
    isArchived: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Riley Morgan',
      email: 'riley.morgan@example.com',
      department: 'Product',
      position: 'Product Manager'
    }
  },
  {
    _id: '9',
    title: 'Remote Work Environment Review',
    content: 'The transition to hybrid work has been smooth. The tools provided for remote collaboration are effective.',
    rating: 4,
    type: 'workplace',
    suggestions: 'More regular virtual team-building activities would be beneficial.',
    anonymous: true,
    department: 'Design',
    isArchived: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '10',
    title: 'Q1 Self-Assessment',
    content: 'I successfully launched two major design projects this quarter and received positive client feedback.',
    rating: 5,
    type: 'self',
    suggestions: 'Looking to improve my UI animation skills next quarter.',
    anonymous: false,
    department: 'Design',
    isArchived: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    userId: {
      name: 'Avery Chen',
      email: 'avery.chen@example.com',
      department: 'Design',
      position: 'Senior UI/UX Designer'
    }
  }
];

export default function ReviewsList({ 
  filters, 
  useMockData: externalUseMockData, 
  setError: externalSetError,
  hideError = false
}: ReviewsListProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setInternalError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [internalUseMockData, setInternalUseMockData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  
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
  
  // Function to filter and sort mock data based on current filters
  const applyFiltersToMockData = () => {
    let filteredReviews = [...MOCK_REVIEWS];
    
    // Apply type filter
    if (filters.type !== 'all') {
      filteredReviews = filteredReviews.filter(review => review.type === filters.type);
    }
    
    // Apply department filter
    if (filters.department) {
      filteredReviews = filteredReviews.filter(review => review.department === filters.department);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(filters.dateRange));
      filteredReviews = filteredReviews.filter(review => new Date(review.createdAt) >= cutoffDate);
    }
    
    // Apply sorting
    filteredReviews.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default: // 'recent'
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    // Apply pagination
    const itemsPerPage = 5;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    setReviews(paginatedReviews);
    setTotalPages(Math.ceil(filteredReviews.length / itemsPerPage));
  };
  
  useEffect(() => {
    // If we're already using mock data, just apply filters
    if (useMockData) {
      applyFiltersToMockData();
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
      applyFiltersToMockData();
      setLoading(false);
      return;
    }
    
    const fetchReviews = async () => {
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
        
        // Add pagination
        queryParams.append('page', page.toString());
        queryParams.append('limit', '10');
        
        // Add sorting
        let sortField = 'createdAt';
        let sortOrder = -1; // descending
        
        switch (filters.sortBy) {
          case 'oldest':
            sortField = 'createdAt';
            sortOrder = 1; // ascending
            break;
          case 'highest':
            sortField = 'rating';
            sortOrder = -1; // descending
            break;
          case 'lowest':
            sortField = 'rating';
            sortOrder = 1; // ascending
            break;
          default:
            sortField = 'createdAt';
            sortOrder = -1; // descending
        }
        
        queryParams.append('sortField', sortField);
        queryParams.append('sortOrder', sortOrder.toString());
        
        try {
          // Use our API client instead of fetch
          const data = await get(`/api/admin/reviews?${queryParams.toString()}`);
          setReviews(data.data.reviews);
          setTotalPages(data.data.pagination.pages);
          setUseMockData(false); // We got real data, don't use mock data
        } catch (apiError) {
          console.error('API error, falling back to mock data:', apiError);
          setError('API error - Using demo data');
          setUseMockData(true);
          applyFiltersToMockData();
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        // Fall back to mock data
        setUseMockData(true);
        applyFiltersToMockData();
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [filters, page, user, authLoading, useMockData]);
  
  const handleArchiveToggle = async (id: string, currentStatus: boolean) => {
    // If using mock data, just update the UI without API call
    if (useMockData) {
      // Update the review in the list
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === id ? { ...review, isArchived: !currentStatus } : review
        )
      );
      return;
    }
    
    try {
      // Use our API client instead of fetch
      const data = await put(`/api/admin/reviews/${id}`, {
        isArchived: !currentStatus
      });
      
      // Update the review in the list
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === id ? { ...review, isArchived: !currentStatus } : review
        )
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // If API call fails, just update the UI
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === id ? { ...review, isArchived: !currentStatus } : review
        )
      );
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
  
  // Only show error if not hidden by parent component
  if (error && !hideError) {
    return (
      <div className={`${useMockData ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4`}>
        {useMockData ? (
          <div>
            {/* <p className="font-bold">Using Demo Data</p> */}
            {/* <p>The application is currently displaying demo data. {error}</p> */}
          </div>
        ) : (
          <div>Error: {error}</div>
        )}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No reviews found matching your filters.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review._id} className={review.isArchived ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{review.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{review.content}</div>
                    {!review.anonymous && review.userId && (
                      <div className="text-xs text-gray-400 mt-1">
                        By: {review.userId.name} ({review.userId.position})
                      </div>
                    )}
                    {review.anonymous && (
                      <div className="text-xs text-gray-400 mt-1">
                        Anonymous review
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-yellow-500">{getRatingStars(review.rating)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    review.type === 'workplace' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {review.type === 'workplace' ? 'Workplace' : 'Self'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedReviewId(review._id);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleArchiveToggle(review._id, review.isArchived)}
                    className={`${
                      review.isArchived ? 'text-green-600 hover:text-green-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {review.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Review Detail Modal */}
      {isModalOpen && selectedReviewId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Review Details</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReviewId(null);
                }}
                className="text-gray-700 hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-black">
              <ReviewDetailClient reviewId={selectedReviewId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
