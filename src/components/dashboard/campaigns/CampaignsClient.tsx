'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CampaignsList from './CampaignsList';
import CampaignForm from './CampaignForm';

export default function CampaignsClient() {
  const { user } = useAuth();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-black">Active Campaigns</h2>
          <p className="text-gray-600">
            View and manage your ongoing HR campaigns
          </p>
        </div>
        
        <button
          onClick={() => {
            setIsCreatingCampaign(true);
            setSelectedCampaign(null);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
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
          onSave={() => {
            setIsCreatingCampaign(false);
            setSelectedCampaign(null);
            // Here you would refresh the campaigns list
          }}
        />
      ) : (
        <CampaignsList 
          onEdit={(campaign) => {
            setSelectedCampaign(campaign);
            setIsCreatingCampaign(true);
          }}
        />
      )}
    </div>
  );
}
