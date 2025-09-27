import React from 'react';
import { Metadata } from 'next';
import ReviewDetailClient from './ReviewDetailClient';

export const metadata: Metadata = {
  title: 'Review Details | Mentamind HR Dashboard',
  description: 'View detailed employee review and feedback',
};

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review Details</h1>
        <p className="text-gray-600">
          View detailed employee feedback and insights
        </p>
      </div>
      
      <ReviewDetailClient reviewId={params.id} />
    </div>
  );
}
