'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Import the components from the correct path
import CampaignsList from '@/components/dashboard/campaigns/CampaignsList';
import CampaignForm from '@/components/dashboard/campaigns/CampaignForm';

// Define the Campaign interface
interface Campaign {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
  target: number;
  type: string;
}

export default function CampaignsClient() {
  const { user } = useAuth();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Active Campaigns</h2>
          <p className="text-gray-600 mt-2">
            View and manage your ongoing HR campaigns and initiatives
          </p>
        </div>
        
        <button
          onClick={() => {
            setIsCreatingCampaign(true);
            setSelectedCampaign(null);
          }}
          className="glass-button px-5 py-2.5 rounded-xl text-white hover:bg-indigo-700/90 transition-all duration-200 flex items-center shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Campaign
        </button>
      </div>
      
      {isCreatingCampaign ? (
        <CampaignForm 
          campaign={selectedCampaign}
          onCancel={() => {
            setIsCreatingCampaign(false);
            setSelectedCampaign(null);
          }}
          onSave={(campaign: Campaign) => {
            setIsCreatingCampaign(false);
            setSelectedCampaign(null);
            // Here you would refresh the campaigns list
          }}
        />
      ) : (
        <CampaignsList 
          onEdit={(campaign: Campaign) => {
            setSelectedCampaign(campaign);
            setIsCreatingCampaign(true);
          }}
        />
      )}
    </div>
  );
}
