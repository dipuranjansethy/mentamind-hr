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
    return <div className="flex justify-center p-8 text-black">Loading reviews...<span className="ml-2 pulse">⟳</span></div>;
  }
  
  // Only show error if not hidden by parent component
  if (error && !hideError) {
    return (
      <div className={`${useMockData ? 'glass border-blue-400/30 text-blue-700' : 'glass border-red-400/30 text-red-700'} border px-6 py-4 rounded-xl mb-6 shadow-lg`}>
        {useMockData ? (
          <div>
            {/* <p className="font-bold">Using Demo Data</p> */}
            {/* <p>The application is currently displaying demo data. {error}</p> */}
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Error: {error}
          </div>
        )}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center glass-card">
        <div className="py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-600 font-medium">No reviews found matching your filters.</p>
          <p className="text-gray-500 mt-2">Try adjusting your filter criteria.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/30 glass rounded-xl overflow-hidden">
          <thead className="backdrop-blur-md bg-white/30">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Review
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30">
            {reviews.map((review) => (
              <tr key={review._id} className={`transition-all duration-200 hover:bg-white/40 ${review.isArchived ? 'bg-gray-50/50' : ''}`}>
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
                    className="text-indigo-600 hover:text-indigo-900 mr-3 px-3 py-1 rounded-md hover:bg-indigo-50/50 transition-all duration-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleArchiveToggle(review._id, review.isArchived)}
                    className={`px-3 py-1 rounded-md transition-all duration-200 ${
                      review.isArchived 
                        ? 'text-green-600 hover:text-green-900 hover:bg-green-50/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
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
        <div className="p-6 border-t border-gray-200/30 flex justify-center">
          <div className="flex space-x-2 glass px-2 py-1 rounded-full">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full glass-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="px-4 py-2 flex items-center justify-center text-black font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full glass-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {isModalOpen && selectedReviewId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="glass-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-5 border-b border-gray-200/30 flex justify-between items-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Review Details</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReviewId(null);
                }}
                className="text-gray-700 hover:text-black hover:bg-gray-100/30 p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 text-black">
              <ReviewDetailClient reviewId={selectedReviewId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
