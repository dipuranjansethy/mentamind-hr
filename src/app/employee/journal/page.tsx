'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  CalendarIcon, 
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: number;
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Reflecting on today\'s challenges',
    content: 'Today was quite challenging with the project deadline approaching. I felt overwhelmed at times, but managed to break down tasks into smaller chunks which helped me stay focused. I\'m proud of how I handled the pressure.',
    date: '2025-09-26',
    mood: 4
  },
  {
    id: '2',
    title: 'Team collaboration success',
    content: 'Had a great collaborative session with the team today. We resolved several blockers and made significant progress on the project. It reminded me how valuable good teamwork can be.',
    date: '2025-09-24',
    mood: 5
  },
  {
    id: '3',
    title: 'Stress management techniques',
    content: 'Tried the breathing exercises from the stress management program today when I felt overwhelmed. They really helped calm my mind and refocus. Need to make this a regular practice.',
    date: '2025-09-22',
    mood: 3
  }
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: 3
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMoodChange = (mood: number) => {
    setNewEntry(prev => ({ ...prev, mood }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In a real app, we would send this to the API
    setTimeout(() => {
      const newEntryWithId: JournalEntry = {
        ...newEntry,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setEntries([newEntryWithId, ...entries]);
      setNewEntry({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        mood: 3
      });
      setShowNewEntryForm(false);
      setSubmitting(false);
    }, 1000);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '😐';
    }
  };
  
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Journal
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Reflect on your thoughts, feelings, and experiences.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewEntryForm(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            New Entry
          </button>
        </div>
      </div>
      
      {showNewEntryForm && (
        <div className="mt-6">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">New Journal Entry</h2>
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={newEntry.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={newEntry.date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      How are you feeling today?
                    </label>
                    <div className="flex justify-between mt-2">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => handleMoodChange(mood)}
                          className={`flex flex-col items-center p-2 rounded-lg ${
                            newEntry.mood === mood ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-2xl" role="img" aria-label={`Mood ${mood}`}>
                            {mood === 1 ? '😢' : 
                             mood === 2 ? '😕' : 
                             mood === 3 ? '😐' : 
                             mood === 4 ? '🙂' : '😄'}
                          </span>
                          <span className="mt-1 text-xs text-gray-500">
                            {mood === 1 ? 'Very Bad' : 
                             mood === 2 ? 'Bad' : 
                             mood === 3 ? 'Okay' : 
                             mood === 4 ? 'Good' : 'Great'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Journal Entry
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="content"
                        name="content"
                        rows={6}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Write your thoughts here..."
                        value={newEntry.content}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Your journal entries are private and encrypted.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewEntryForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {submitting ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Entry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-xl font-medium text-gray-900">Your Journal Entries</h2>
        
        {entries.length > 0 ? (
          <div className="mt-4 space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="overflow-hidden bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl" role="img" aria-label={`Mood ${entry.mood}`}>
                        {getMoodEmoji(entry.mood)}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 whitespace-pre-line">{entry.content}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 mt-4 bg-white rounded-lg shadow">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No journal entries</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new journal entry.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowNewEntryForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                New Entry
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Journal Prompts */}
      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-900">Journal Prompts</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "What made you feel proud today?",
            "What challenges did you face and how did you overcome them?",
            "What are three things you're grateful for today?",
            "What did you learn about yourself today?",
            "What's something that brought you joy today?",
            "What's one thing you could have done better today?"
          ].map((prompt, idx) => (
            <div key={idx} className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700">{prompt}</p>
              <button
                type="button"
                onClick={() => {
                  setNewEntry(prev => ({
                    ...prev,
                    content: prev.content ? `${prev.content}\n\n${prompt}\n` : `${prompt}\n`
                  }));
                  if (!showNewEntryForm) {
                    setShowNewEntryForm(true);
                  }
                }}
                className="inline-flex items-center mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Use this prompt
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
