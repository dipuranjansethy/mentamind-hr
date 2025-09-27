'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Mock campaign data
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    title: 'Employee Wellness Program',
    description: 'A 3-month program focused on improving employee mental and physical health',
    status: 'active',
    startDate: '2025-08-01',
    endDate: '2025-10-31',
    participants: 45,
    target: 60,
    type: 'wellness'
  },
  {
    id: '2',
    title: 'Leadership Training Initiative',
    description: 'Training program for mid-level managers to develop leadership skills',
    status: 'active',
    startDate: '2025-09-15',
    endDate: '2025-12-15',
    participants: 12,
    target: 15,
    type: 'training'
  },
  {
    id: '3',
    title: 'Diversity & Inclusion Workshop Series',
    description: 'A series of workshops promoting diversity and inclusion in the workplace',
    status: 'upcoming',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    participants: 0,
    target: 100,
    type: 'workshop'
  },
  {
    id: '4',
    title: 'Annual Employee Satisfaction Survey',
    description: 'Yearly survey to gather feedback on employee satisfaction and engagement',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    participants: 78,
    target: 80,
    type: 'survey'
  },
  {
    id: '5',
    title: 'Remote Work Policy Update',
    description: 'Campaign to inform employees about updates to the remote work policy',
    status: 'active',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    participants: 65,
    target: 100,
    type: 'policy'
  }
];

interface CampaignsListProps {
  onEdit: (campaign: any) => void;
}

export default function CampaignsList({ onEdit }: CampaignsListProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // In a real app, you would fetch campaigns from an API
    // For now, we'll use mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCampaigns(MOCK_CAMPAIGNS);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.status === filter;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
  
  if (loading) {
    return <div className="flex justify-center p-8 text-black">Loading campaigns...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${
              filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md ${
              filter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded-md ${
              filter === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${
              filter === 'completed' ? 'bg-gray-100 text-gray-800 border border-gray-300' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No campaigns found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-black">{campaign.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{campaign.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium text-black">{formatDate(campaign.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium text-black">{formatDate(campaign.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-medium text-black">{campaign.participants} / {campaign.target}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium text-black capitalize">{campaign.type}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (campaign.participants / campaign.target) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((campaign.participants / campaign.target) * 100)}% participation
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 flex justify-end">
                <button
                  onClick={() => onEdit(campaign)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Edit Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
