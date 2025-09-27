import React from 'react';
import { Metadata } from 'next';
import ReportsOverview from '@/components/dashboard/reports/ReportsOverview';

export const metadata: Metadata = {
  title: 'Reports & Insights | Mentamind HR Dashboard',
  description: 'View employee reviews, feedback, and workplace insights',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports & Insights</h1>
        <p className="text-gray-600">
          View employee feedback, workplace reviews, and self-assessments to improve your organization.
        </p>
      </div>
      
      <ReportsOverview />
    </div>
  );
}
