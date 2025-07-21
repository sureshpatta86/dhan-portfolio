'use client';

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing direct fetch...');
      const response = await fetch('/api/trading/option-chain/expiry-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UnderlyingScrip: 13,
          UnderlyingSeg: 'IDX_I'
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Direct fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testApiClient = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing API client...');
      const { internalApiClient } = await import('@/lib/api/client');
      
      const response = await internalApiClient.post('/api/trading/option-chain/expiry-list', {
        UnderlyingScrip: 13,
        UnderlyingSeg: 'IDX_I'
      });

      console.log('API client response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('API client error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testTradingService = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing trading service...');
      const { getExpiryList } = await import('@/features/trading/services');
      
      const response = await getExpiryList({
        UnderlyingScrip: 13,
        UnderlyingSeg: 'IDX_I'
      });

      console.log('Trading service response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Trading service error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Direct Fetch
        </button>
        
        <button
          onClick={testApiClient}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test API Client
        </button>
        
        <button
          onClick={testTradingService}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Trading Service
        </button>
      </div>

      {loading && (
        <div className="bg-blue-100 p-4 rounded">
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold text-red-800">Error:</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold text-green-800">Result:</h2>
          <pre className="text-green-600 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
