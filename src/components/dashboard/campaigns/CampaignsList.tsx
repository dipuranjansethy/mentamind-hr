'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

// Mock campaign data
const MOCK_CAMPAIGNS: Campaign[] = [
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
  onEdit: (campaign: Campaign) => void;
}

export default function CampaignsList({ onEdit }: CampaignsListProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
    return (
      <div className="flex justify-center p-12 text-black">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Loading campaigns...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass border-red-400/30 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex space-x-3 glass p-2 rounded-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-indigo-500/80 text-white backdrop-blur-sm shadow-lg' 
                : 'hover:bg-white/30 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              filter === 'active' 
                ? 'bg-green-500/80 text-white backdrop-blur-sm shadow-lg' 
                : 'hover:bg-white/30 text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              filter === 'upcoming' 
                ? 'bg-blue-500/80 text-white backdrop-blur-sm shadow-lg' 
                : 'hover:bg-white/30 text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              filter === 'completed' 
                ? 'bg-gray-500/80 text-white backdrop-blur-sm shadow-lg' 
                : 'hover:bg-white/30 text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredCampaigns.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 font-medium">No campaigns found matching your filter.</p>
            <p className="text-gray-500 mt-2">Try selecting a different filter option.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="glass-card overflow-hidden hover-lift">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{campaign.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full backdrop-blur-sm ${getStatusBadgeClass(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-5 text-sm">{campaign.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <p className="font-medium text-black">{formatDate(campaign.startDate)}</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <p className="font-medium text-black">{formatDate(campaign.endDate)}</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Participants</p>
                    <p className="font-medium text-black">{campaign.participants} / {campaign.target}</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="font-medium text-black capitalize">{campaign.type}</p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <div className="w-full glass h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (campaign.participants / campaign.target) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    {Math.round((campaign.participants / campaign.target) * 100)}% participation
                  </p>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200/30 flex justify-end">
                <button
                  onClick={() => onEdit(campaign)}
                  className="glass-button px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
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
