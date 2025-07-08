/**
 * Direct fetch test to verify API endpoints
 */
'use client';

import { useState, useEffect } from 'react';

export default function DirectFetchTest() {
  const [fetchTest, setFetchTest] = useState<any>(null);

  useEffect(() => {
    const testDirectFetch = async () => {
      try {
        const response = await fetch('/api/portfolio/positions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        setFetchTest({
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: data,
          dataLength: data.data?.length || 0,
        });
      } catch (error) {
        setFetchTest({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    testDirectFetch();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Direct Fetch Test</h1>
      
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Fetch Result</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(fetchTest, null, 2)}
        </pre>
      </div>

      {fetchTest?.success && (
        <div className="bg-white rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Sample Data</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(fetchTest.data?.data?.[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
