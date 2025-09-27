import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  type: 'workplace' | 'self';
  onSuccess?: () => void;
  existingReview?: any;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ type, onSuccess, existingReview }) => {
  const router = useRouter();
  const isEdit = !!existingReview;
  
  const [formData, setFormData] = useState({
    title: existingReview?.title || '',
    content: existingReview?.content || '',
    rating: existingReview?.rating || 3,
    suggestions: existingReview?.suggestions || '',
    anonymous: existingReview?.anonymous || false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const endpoint = isEdit 
        ? `/api/employee/reviews/${existingReview._id}` 
        : '/api/employee/reviews';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      setSuccess(isEdit ? 'Review updated successfully!' : 'Review submitted successfully!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Reset form if not editing
        if (!isEdit) {
          setFormData({
            title: '',
            content: '',
            rating: 3,
            suggestions: '',
            anonymous: false
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit' : 'Submit'} {type === 'workplace' ? 'Workplace' : 'Self'} Review
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Enter a title for your ${type === 'workplace' ? 'workplace' : 'self'} review`}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'workplace' ? 'Workplace Feedback' : 'Self-Reflection'}
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={type === 'workplace' 
              ? 'Share your thoughts on how the workplace environment can be improved...' 
              : 'Reflect on your performance, achievements, and areas for improvement...'}
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5)
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Below Average</option>
            <option value="3">3 - Average</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 mb-1">
            Suggestions for Improvement
          </label>
          <textarea
            id="suggestions"
            name="suggestions"
            rows={3}
            value={formData.suggestions}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Provide specific suggestions for improvement..."
          ></textarea>
        </div>
        
        {type === 'workplace' && (
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
              Submit anonymously (HR will not see your name)
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : isEdit ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
