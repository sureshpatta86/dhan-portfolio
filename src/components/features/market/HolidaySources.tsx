'use client';

import React from 'react';
import { 
  LinkIcon, 
  CheckBadgeIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SourceReference {
  name: string;
  url: string;
  description: string;
  color: string;
  verified: boolean;
}

const OFFICIAL_SOURCES: SourceReference[] = [
  {
    name: 'NSE India',
    url: 'https://www.nseindia.com/resources/exchange-communication-holidays',
    description: 'National Stock Exchange official holiday calendar',
    color: 'blue',
    verified: true
  },
  {
    name: 'BSE India',
    url: 'https://www.bseindia.com/static/markets/marketinfo/listholi.aspx',
    description: 'Bombay Stock Exchange holiday listing',
    color: 'green',
    verified: true
  },
  {
    name: 'MCX India',
    url: 'https://www.mcxindia.com/market-data/holiday-calendar',
    description: 'Multi Commodity Exchange holiday calendar',
    color: 'orange',
    verified: true
  },
  {
    name: 'RBI',
    url: 'https://www.rbi.org.in/Scripts/HolidayDisplay.aspx',
    description: 'Reserve Bank of India bank holidays',
    color: 'purple',
    verified: true
  }
];

interface HolidaySourcesProps {
  compact?: boolean;
  showLastUpdated?: boolean;
}

export default function HolidaySources({ compact = false, showLastUpdated = true }: HolidaySourcesProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-300 hover:border-blue-400 text-blue-600 bg-blue-50 hover:bg-blue-100',
      green: 'border-green-300 hover:border-green-400 text-green-600 bg-green-50 hover:bg-green-100',
      orange: 'border-orange-300 hover:border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100',
      purple: 'border-purple-300 hover:border-purple-400 text-purple-600 bg-purple-50 hover:bg-purple-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <CheckBadgeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">Verified Sources</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {OFFICIAL_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full transition-colors ${getColorClasses(source.color)}`}
            >
              {source.name}
              <LinkIcon className="h-3 w-3 ml-1" />
            </a>
          ))}
        </div>
        {showLastUpdated && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3 mr-1" />
              Last verified: July 10, 2025
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Official Data Sources
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Holiday information verified from exchange websites
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {OFFICIAL_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-start p-4 border rounded-lg transition-all hover:shadow-md ${getColorClasses(source.color)}`}
            >
              <div className="flex-shrink-0 mr-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${source.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50' :
                  source.color === 'green' ? 'bg-green-100 dark:bg-green-900/50' :
                  source.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/50' :
                  'bg-purple-100 dark:bg-purple-900/50'
                  }`}>
                  <span className={`text-sm font-bold ${source.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    source.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    source.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    'text-purple-600 dark:text-purple-400'
                    }`}>
                    {source.name.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:underline">
                    {source.name}
                  </h4>
                  {source.verified && (
                    <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {source.description}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  <span className="truncate">{source.url.replace('https://', '')}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {showLastUpdated && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Data last verified: <strong>July 10, 2025</strong></span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Always check official sources for latest updates
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
