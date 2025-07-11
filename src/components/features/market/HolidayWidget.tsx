'use client';

import React, { useMemo } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { 
  getUpcomingHolidays, 
  getFormattedHolidayInfo,
  getHolidayStatistics 
} from '@/lib/utils/marketHolidays';
import HolidaySources from '@/components/features/market/HolidaySources';
import Link from 'next/link';

interface HolidayWidgetProps {
  showLink?: boolean;
  compact?: boolean;
}

export default function HolidayWidget({ showLink = true, compact = false }: HolidayWidgetProps) {
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(3), []);
  const stats = useMemo(() => getHolidayStatistics(), []);

  if (upcomingHolidays.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Market Holidays</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No upcoming holidays for the rest of 2025
        </p>
        {showLink && (
          <Link 
            href="/market-holidays"
            className="inline-flex items-center mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all holidays →
          </Link>
        )}
      </div>
    );
  }

  const nextHoliday = getFormattedHolidayInfo(upcomingHolidays[0]);

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Next Holiday
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-orange-900 dark:text-orange-100">
              {upcomingHolidays[0].name}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">
              {nextHoliday.daysFromToday === 1 ? 'Tomorrow' : `${nextHoliday.daysFromToday} days`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Market Holidays
          </h3>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">
          {stats.upcoming} remaining
        </span>
      </div>

      {/* Next Holiday Highlight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-lg p-2">
              <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
              {upcomingHolidays[0].name}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {nextHoliday.formattedDate}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {nextHoliday.daysFromToday === 1 
                ? 'Tomorrow - Markets closed' 
                : `In ${nextHoliday.daysFromToday} days`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Other Upcoming Holidays */}
      {upcomingHolidays.slice(1).length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Also Coming Up
          </h5>
          {upcomingHolidays.slice(1).map((holiday) => {
            const info = getFormattedHolidayInfo(holiday);
            return (
              <div key={holiday.date} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {holiday.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {info.shortDate}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {info.daysFromToday} days
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showLink && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <Link 
            href="/market-holidays"
            className="inline-flex items-center w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            View Complete Holiday Calendar
          </Link>
          
          <HolidaySources compact={true} showLastUpdated={false} />
        </div>
      )}
    </div>
  );
}
