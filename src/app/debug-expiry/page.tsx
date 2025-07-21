'use client';

import React from 'react';
import { useExpiryList } from '@/features/trading/hooks';

export default function DebugExpiryPage() {
  const { 
    data: expiryData, 
    isLoading: expiryLoading, 
    error: expiryError 
  } = useExpiryList(13, 'IDX_I'); // NIFTY

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Expiry List</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Loading State:</h2>
          <p>isLoading: {String(expiryLoading)}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Error State:</h2>
          <p>error: {expiryError ? JSON.stringify(expiryError, null, 2) : 'null'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Data:</h2>
          <pre>{JSON.stringify(expiryData, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Dropdown State:</h2>
          <p>Should be disabled: {String(expiryLoading || !expiryData?.data)}</p>
          <p>Has data: {String(!!expiryData?.data)}</p>
          <p>Data length: {expiryData?.data?.length || 0}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Test Dropdown:</h2>
          <select
            disabled={expiryLoading || !expiryData?.data}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            <option value="">
              {expiryLoading ? 'Loading...' : 'Select Expiry'}
            </option>
            {expiryData?.data?.map((expiry) => (
              <option key={expiry} value={expiry}>
                {expiry}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
