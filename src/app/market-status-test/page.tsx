'use client';

import React from 'react';
import MarketStatusIndicator from '@/components/features/market/MarketStatusIndicator';
import { getMarketStatus } from '@/lib/utils/marketStatus';

export default function MarketStatusTestPage() {
  const [currentStatus, setCurrentStatus] = React.useState(getMarketStatus());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(getMarketStatus());
    }, 1000); // Update every second for testing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Market Status Test</h1>
      
      {/* Current Time */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Time (IST)</h2>
        <p className="text-lg font-mono">
          {new Date().toLocaleString("en-US", { 
            timeZone: "Asia/Kolkata",
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>
      </div>

      {/* Market Status Details */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Market Status Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Status:</strong> {currentStatus.status}
          </div>
          <div>
            <strong>Is Open:</strong> {currentStatus.isOpen ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Pre-Market:</strong> {currentStatus.isPreMarket ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Post-Market:</strong> {currentStatus.isPostMarket ? 'Yes' : 'No'}
          </div>
          <div className="col-span-2">
            <strong>Message:</strong> {currentStatus.statusMessage}
          </div>
          <div className="col-span-2">
            <strong>Next Event:</strong> {currentStatus.nextEvent}
          </div>
          <div className="col-span-2">
            <strong>Time Until Next Event:</strong> {currentStatus.timeUntilNextEvent}
          </div>
        </div>
      </div>

      {/* Market Status Components */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Market Status Components</h2>
        
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium mb-2">Full Status Banner</h3>
          <MarketStatusIndicator />
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium mb-2">Compact Status</h3>
          <MarketStatusIndicator compact={true} />
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-4">
          <h3 className="font-medium mb-2">Hero Mode (White text)</h3>
          <MarketStatusIndicator compact={true} heroMode={true} />
        </div>
      </div>

      {/* Market Timings Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Indian Market Timings (IST)</h2>
        <ul className="text-blue-700 text-sm space-y-1">
          <li><strong>Pre-Market:</strong> 9:00 AM - 9:15 AM (Monday to Friday)</li>
          <li><strong>Regular Trading:</strong> 9:15 AM - 3:30 PM (Monday to Friday)</li>
          <li><strong>Weekends:</strong> Closed</li>
          <li><strong>Holidays:</strong> Closed (not currently handled)</li>
        </ul>
      </div>
    </div>
  );
}
