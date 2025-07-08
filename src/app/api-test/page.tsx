/**
 * Comprehensive API test component
 */
'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePositions, useHoldings } from '@/features/portfolio/hooks';
import { API_CONFIG } from '@/lib/config/app';

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ApiTestInner = () => {
  const [testResults, setTestResults] = useState<any>({});
  const positionsQuery = usePositions();
  const holdingsQuery = useHoldings();

  useEffect(() => {
    setTestResults({
      apiConfig: {
        baseUrl: API_CONFIG.baseUrl,
        timeout: API_CONFIG.timeout,
        windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A',
      },
      positionsQuery: {
        isLoading: positionsQuery.isLoading,
        isError: positionsQuery.isError,
        error: positionsQuery.error?.message || null,
        dataLength: positionsQuery.data?.length || 0,
        status: positionsQuery.status,
      },
      holdingsQuery: {
        isLoading: holdingsQuery.isLoading,
        isError: holdingsQuery.isError,
        error: holdingsQuery.error?.message || null,
        dataLength: holdingsQuery.data?.length || 0,
        status: holdingsQuery.status,
      },
    });
  }, [positionsQuery, holdingsQuery]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Comprehensive API Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">API Configuration</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(testResults.apiConfig, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Positions Query</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(testResults.positionsQuery, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Holdings Query</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(testResults.holdingsQuery, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="space-y-2">
            <div className={`p-2 rounded ${positionsQuery.isSuccess ? 'bg-green-100 text-green-800' : positionsQuery.isError ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              Positions: {positionsQuery.isSuccess ? `✓ ${positionsQuery.data?.length || 0} items` : positionsQuery.isError ? `✗ ${positionsQuery.error?.message}` : '⏳ Loading...'}
            </div>
            <div className={`p-2 rounded ${holdingsQuery.isSuccess ? 'bg-green-100 text-green-800' : holdingsQuery.isError ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              Holdings: {holdingsQuery.isSuccess ? `✓ ${holdingsQuery.data?.length || 0} items` : holdingsQuery.isError ? `✗ ${holdingsQuery.error?.message}` : '⏳ Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Raw Data Display */}
      {positionsQuery.isSuccess && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Sample Position Data</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(positionsQuery.data?.[0], null, 2)}
          </pre>
        </div>
      )}

      {holdingsQuery.isSuccess && (
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Sample Holdings Data</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(holdingsQuery.data?.[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default function ApiTestPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiTestInner />
    </QueryClientProvider>
  );
}
