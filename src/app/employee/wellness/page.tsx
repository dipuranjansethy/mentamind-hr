'use client';

import { useState } from 'react';
import { 
  HeartIcon, 
  MoonIcon, 
  BoltIcon, 
  FaceSmileIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
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

export default function WellnessTracker() {
  const [formData, setFormData] = useState({
    moodScore: 7,
    stressLevel: 5,
    sleepHours: 7,
    focusScore: 6,
    journalEntry: '',
    meditationMinutes: 10,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In a real app, we would send this data to the API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };
  
  // Mock data for charts
  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood Score',
        data: [6, 7, 5, 8, 6, 7, formData.moodScore],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const stressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Stress Level',
        data: [7, 6, 8, 5, 7, 6, formData.stressLevel],
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const sleepData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Hours',
        data: [6, 7.5, 6.5, 8, 7, 8, formData.sleepHours],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
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
  
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Wellness Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your daily wellness metrics to monitor your well-being over time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Form */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Today's Check-in</h2>
            <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
              {/* Mood Score */}
              <div>
                <label htmlFor="moodScore" className="flex items-center text-sm font-medium text-gray-700">
                  <FaceSmileIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Mood Score: {formData.moodScore}/10
                </label>
                <input
                  type="range"
                  name="moodScore"
                  id="moodScore"
                  min="1"
                  max="10"
                  value={formData.moodScore}
                  onChange={handleRangeChange}
                  className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very Bad</span>
                  <span>Great</span>
                </div>
              </div>
              
              {/* Stress Level */}
              <div>
                <label htmlFor="stressLevel" className="flex items-center text-sm font-medium text-gray-700">
                  <HeartIcon className="w-5 h-5 mr-2 text-red-500" />
                  Stress Level: {formData.stressLevel}/10
                </label>
                <input
                  type="range"
                  name="stressLevel"
                  id="stressLevel"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={handleRangeChange}
                  className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low Stress</span>
                  <span>High Stress</span>
                </div>
              </div>
              
              {/* Sleep Hours */}
              <div>
                <label htmlFor="sleepHours" className="flex items-center text-sm font-medium text-gray-700">
                  <MoonIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Sleep Hours: {formData.sleepHours} hours
                </label>
                <input
                  type="range"
                  name="sleepHours"
                  id="sleepHours"
                  min="0"
                  max="12"
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={handleRangeChange}
                  className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0h</span>
                  <span>12h</span>
                </div>
              </div>
              
              {/* Focus Score */}
              <div>
                <label htmlFor="focusScore" className="flex items-center text-sm font-medium text-gray-700">
                  <BoltIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Focus Score: {formData.focusScore}/10
                </label>
                <input
                  type="range"
                  name="focusScore"
                  id="focusScore"
                  min="1"
                  max="10"
                  value={formData.focusScore}
                  onChange={handleRangeChange}
                  className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Unfocused</span>
                  <span>Very Focused</span>
                </div>
              </div>
              
              {/* Meditation Minutes */}
              <div>
                <label htmlFor="meditationMinutes" className="block text-sm font-medium text-gray-700">
                  Meditation Minutes
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="number"
                    name="meditationMinutes"
                    id="meditationMinutes"
                    className="block w-full pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0"
                    value={formData.meditationMinutes}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">min</span>
                  </div>
                </div>
              </div>
              
              {/* Journal Entry */}
              <div>
                <label htmlFor="journalEntry" className="block text-sm font-medium text-gray-700">
                  Journal Entry (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="journalEntry"
                    name="journalEntry"
                    rows={3}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="How are you feeling today? Any thoughts you'd like to share?"
                    value={formData.journalEntry}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${
                    submitted
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {submitting ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                      Submitting...
                    </>
                  ) : submitted ? (
                    'Submitted Successfully!'
                  ) : (
                    'Submit Today\'s Check-in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Charts */}
        <div className="space-y-6">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Mood Trend</h2>
              <div className="h-64 mt-4">
                <Line options={chartOptions} data={moodData} />
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Stress Trend</h2>
              <div className="h-64 mt-4">
                <Line options={chartOptions} data={stressData} />
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Sleep Trend</h2>
              <div className="h-64 mt-4">
                <Line options={chartOptions} data={sleepData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wellness Tips */}
      <div className="mt-6">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Wellness Tips</h2>
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MoonIcon className="w-5 h-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Sleep Tip</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Try to maintain a consistent sleep schedule, even on weekends. This helps regulate your body's internal clock.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <HeartIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Stress Management</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Practice deep breathing for 5 minutes when feeling stressed. Inhale for 4 counts, hold for 4, and exhale for 6.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <BoltIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Focus Enhancement</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Try the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer break.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
