'use client';

import React from 'react';
import { useMarketStatus, getMarketStatusColor } from '@/lib/utils/marketStatus';

interface MarketStatusIndicatorProps {
  compact?: boolean;
  showDetails?: boolean;
  heroMode?: boolean; // For styling in hero section
}

export default function MarketStatusIndicator({ 
  compact = false, 
  showDetails = true,
  heroMode = false
}: MarketStatusIndicatorProps) {
  const marketStatus = useMarketStatus();
  const colors = getMarketStatusColor(marketStatus.status);

  if (compact) {
    const textClass = heroMode ? 'text-blue-100' : 'text-gray-600';
    const dotColor = heroMode ? 
      (marketStatus.isOpen ? 'bg-green-400' : 
       marketStatus.isHoliday ? 'bg-purple-400' : 'bg-red-400') : 
      colors.dot;
    
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 ${dotColor} rounded-full mr-2`}></div>
        <span className={`text-sm ${textClass}`}>
          {marketStatus.status === 'OPEN' ? 'Market is open' : 
           marketStatus.status === 'PRE_MARKET' ? 'Pre-market session' : 
           marketStatus.status === 'HOLIDAY' ? 'Market holiday' :
           'Market is closed'}
          {showDetails && ` • ${marketStatus.timeUntilNextEvent}`}
        </span>
      </div>
    );
  }

  return (
    <div className={`${colors.bg} border rounded-xl p-4`}>
      <div className="flex items-center">
        <div className={`w-2 h-2 ${colors.dot} rounded-full mr-3`}></div>
        <div>
          <p className={`${colors.text} font-medium`}>
            {marketStatus.status === 'OPEN' ? 'Market is Open' :
             marketStatus.status === 'PRE_MARKET' ? 'Pre-Market Session' :
             marketStatus.status === 'HOLIDAY' ? 'Market Holiday' :
             'Market is Closed'}
          </p>
          <p className={`${colors.subtext} text-sm`}>
            {marketStatus.statusMessage}
          </p>
          {showDetails && (
            <p className={`${colors.subtext} text-xs mt-1`}>
              {marketStatus.nextEvent} • {marketStatus.timeUntilNextEvent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
