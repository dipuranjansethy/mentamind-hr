import React from 'react';
import { Metadata } from 'next';
import CampaignsClient from '@/components/dashboard/campaigns/CampaignsClient';

export const metadata: Metadata = {
  title: 'Campaigns | Mentamind HR Dashboard',
  description: 'Manage and track HR campaigns and initiatives',
};

export default function CampaignsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Campaigns</h1>
        <p className="text-gray-600">
          Manage and track your HR campaigns and initiatives
        </p>
      </div>
      
      <CampaignsClient />
    </div>
  );
}
