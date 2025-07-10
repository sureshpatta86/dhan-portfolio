/**
 * Simple React Query test to debug the issue
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function SimpleQueryTest() {
  const [manualTrigger, setManualTrigger] = useState(0);
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    console.log('SimpleQueryTest mounted');
  }, []);

  const simpleQuery = useQuery({
    queryKey: ['simple-test', manualTrigger],
    queryFn: async () => {
      console.log('Simple queryFn executing - START');
      
      // Test with a simple fetch
      const response = await fetch('/api/trading/orders');
      console.log('Simple queryFn - fetch response:', response.status);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Simple queryFn - data received:', data);
      
      return data;
    },
    enabled: mounted, // Only run after component is mounted
    staleTime: 0, // Always fetch
  });

  console.log('Simple query result:', {
    data: simpleQuery.data,
    isLoading: simpleQuery.isLoading,
    error: simpleQuery.error,
    status: simpleQuery.status,
    fetchStatus: simpleQuery.fetchStatus,
    mounted,
  });

  // Manual refetch with debugging
  const handleManualRefetch = async () => {
    console.log('Manual refetch triggered');
    try {
      const result = await simpleQuery.refetch();
      console.log('Manual refetch result:', result);
    } catch (error) {
      console.error('Manual refetch error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simple React Query Test</h1>
        <p className="text-gray-600 mt-2">
          Testing if React Query works at all
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Query Status</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong>Mounted:</strong> {mounted.toString()}
          </div>
          <div>
            <strong>Status:</strong> {simpleQuery.status}
          </div>
          <div>
            <strong>Fetch Status:</strong> {simpleQuery.fetchStatus}
          </div>
          <div>
            <strong>Loading:</strong> {simpleQuery.isLoading.toString()}
          </div>
          <div>
            <strong>Error:</strong> {simpleQuery.error?.message || 'None'}
          </div>
        </div>
        
        <button
          onClick={() => setManualTrigger(prev => prev + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
        >
          Manual Trigger ({manualTrigger})
        </button>
        
        <button
          onClick={handleManualRefetch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refetch
        </button>
        
        {simpleQuery.isLoading && (
          <div className="mt-4 text-blue-600">Loading...</div>
        )}
        
        {simpleQuery.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <strong>Error:</strong> {simpleQuery.error.message}
          </div>
        )}
        
        {simpleQuery.data && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <strong>Success!</strong> Got {simpleQuery.data?.data?.length || 0} orders
            <details className="mt-2">
              <summary>Raw Data</summary>
              <pre className="text-xs overflow-auto max-h-48 mt-2">
                {JSON.stringify(simpleQuery.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <strong>QueryClient Info:</strong>
          <ul className="text-sm mt-2">
            <li>Queries in cache: {queryClient.getQueryCache().getAll().length}</li>
            <li>Window available: {typeof window !== 'undefined' ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
