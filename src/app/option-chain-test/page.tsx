'use client';

import React, { useState } from 'react';

export default function OptionChainTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOptionChainAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with NIFTY option chain
      const response = await fetch('/api/trading/option-chain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UnderlyingScrip: 13,
          UnderlyingSeg: 'IDX_I',
          Expiry: '2024-12-26' // Use a future date
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(`API Error: ${data.message || data.error || response.statusText}`);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testExpiryListAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with NIFTY expiry list
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

      const data = await response.json();
      
      if (!response.ok) {
        setError(`API Error: ${data.message || data.error || response.statusText}`);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Option Chain API Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testExpiryListAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
        >
          {loading ? 'Testing...' : 'Test Expiry List API'}
        </button>
        
        <button
          onClick={testOptionChainAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Option Chain API'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Success!</strong> API response received.
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">View Response</summary>
            <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
