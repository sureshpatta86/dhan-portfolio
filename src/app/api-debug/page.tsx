/**
 * Debug component to test API client configuration
 */
'use client';

import { useEffect, useState } from 'react';
import { internalApiClient } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/config/app';

export default function ApiDebugTest() {
  const [apiConfig, setApiConfig] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    // Test API configuration
    setApiConfig({
      baseUrl: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
      windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A',
    });

    // Test API call
    const testApi = async () => {
      try {
        const response = await internalApiClient.get('/portfolio/positions');
        setApiTest({
          success: true,
          data: response.data ? `${Array.isArray(response.data) ? response.data.length : 'Unknown'} positions found` : 'No data',
          fullResponse: response,
        });
      } catch (error) {
        setApiTest({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error,
        });
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Debug Test</h1>
      
      <div className="bg-white rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">API Configuration</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(apiConfig, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">API Test Result</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(apiTest, null, 2)}
        </pre>
      </div>
    </div>
  );
}
