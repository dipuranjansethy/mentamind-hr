'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import Header from '@/components/dashboard/Header';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import TestAuth from '@/components/dashboard/TestAuth';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration
  const wellnessData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Wellness Score',
        data: [65, 68, 72, 70, 75, 78],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const stressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Stress Level',
        data: [7.2, 6.8, 6.5, 6.2, 5.8, 5.5],
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Header title="Wellness Analytics Dashboard" />
      
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Overall Wellness Index" 
            value="78/100"
            icon={<ChartBarIcon className="w-6 h-6 text-indigo-600" />}
            change={{ value: '5%', positive: true }}
          />
          <StatCard 
            title="Active Employees" 
            value="85%"
            icon={<UserGroupIcon className="w-6 h-6 text-green-600" />}
            change={{ value: '3%', positive: true }}
          />
          <StatCard 
            title="Program Completion Rate" 
            value="72%"
            icon={<ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />}
            change={{ value: '2%', positive: true }}
          />
          <StatCard 
            title="Burnout Risk" 
            value="12%"
            icon={<ExclamationCircleIcon className="w-6 h-6 text-red-600" />}
            change={{ value: '4%', positive: false }}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
          <Card title="Wellness Score Trend">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <Line options={chartOptions} data={wellnessData} />
              </div>
            )}
          </Card>
          
          <Card title="Stress Level Trend">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <Line options={chartOptions} data={stressData} />
              </div>
            )}
          </Card>
        </div>
        
        {/* Department Wellness */}
        <div className="mt-8">
          <Card title="Department Wellness Overview">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Wellness Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Stress Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Engagement
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Burnout Risk
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'Engineering', score: 82, stress: 5.2, engagement: '88%', risk: 'Low' },
                      { name: 'Marketing', score: 75, stress: 6.1, engagement: '79%', risk: 'Medium' },
                      { name: 'Sales', score: 70, stress: 6.8, engagement: '75%', risk: 'High' },
                      { name: 'Customer Support', score: 73, stress: 6.5, engagement: '82%', risk: 'Medium' },
                      { name: 'Product', score: 80, stress: 5.5, engagement: '85%', risk: 'Low' },
                    ].map((dept, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.score}/100</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.stress}/10</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.engagement}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dept.risk === 'Low' 
                              ? 'bg-green-100 text-green-800' 
                              : dept.risk === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {dept.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
        
        {/* Authentication Test */}
        <div className="mt-8">
          <TestAuth />
        </div>
        
        {/* Recent Activities */}
        <div className="mt-8">
          <Card title="Recent Activities">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {[
                  { action: 'New wellness program started', department: 'Engineering', time: '2 hours ago' },
                  { action: 'Stress management workshop completed', department: 'Marketing', time: '5 hours ago' },
                  { action: 'Wellness challenge achieved', department: 'All Departments', time: '1 day ago' },
                  { action: 'Mental health webinar scheduled', department: 'Company-wide', time: '2 days ago' },
                  { action: 'Burnout risk alert triggered', department: 'Sales', time: '3 days ago' },
                ].map((activity, idx) => (
                  <li key={idx} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{activity.action}</h3>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Department: {activity.department}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
