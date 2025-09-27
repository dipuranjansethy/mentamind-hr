'use client';

import React, { useState } from 'react';
import { get } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuth() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await get('/api/test');
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Authentication Test</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Current User</h3>
        {user ? (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No user authenticated</p>
        )}
      </div>
      
      <div className="mb-4">
        <button
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Testing...' : 'Test API Authentication'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {testResult && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Test Result</h3>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
