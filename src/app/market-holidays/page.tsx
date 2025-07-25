'use client';

import React from 'react';
import MarketHolidayCalendar from '@/components/features/market/MarketHolidayCalendar';

export default function HolidaysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketHolidayCalendar />
      </div>
    </div>
  );
}
