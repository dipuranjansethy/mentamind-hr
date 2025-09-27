import React from 'react';
import ReviewsList from '@/components/employee/ReviewsList';

export const metadata = {
  title: 'My Reviews | Mentamind',
  description: 'View and manage your workplace and self reviews',
};

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <ReviewsList />
      </div>
    </div>
  );
}
