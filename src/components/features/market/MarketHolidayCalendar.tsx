'use client';

import React, { useState, useMemo } from 'react';
import { 
  CalendarIcon, 
  ClockIcon,
  BuildingOffice2Icon,
  StarIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { 
  INDIAN_MARKET_HOLIDAYS_2025, 
  getUpcomingHolidays, 
  getHolidaysByMonth,
  getHolidaysByType,
  getHolidaysByImportance,
  getHolidayStatistics,
  getRemainingTradingDays,
  getFormattedHolidayInfo,
  type MarketHoliday 
} from '@/lib/utils/marketHolidays';
import HolidaySources from '@/components/features/market/HolidaySources';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HOLIDAY_TYPE_ICONS = {
  national: GlobeAsiaAustraliaIcon,
  regional: BuildingOffice2Icon,
  religious: StarIcon,
  festival: SparklesIcon
};

const HOLIDAY_TYPE_COLORS = {
  national: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: 'text-blue-700'
  },
  regional: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: 'text-green-700'
  },
  religious: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    icon: 'text-purple-700'
  },
  festival: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    icon: 'text-orange-700'
  }
};

interface HolidayCardProps {
  holiday: MarketHoliday;
  compact?: boolean;
}

function HolidayCard({ holiday, compact = false }: HolidayCardProps) {
  const colors = HOLIDAY_TYPE_COLORS[holiday.type];
  const IconComponent = HOLIDAY_TYPE_ICONS[holiday.type];
  const formattedInfo = useMemo(() => getFormattedHolidayInfo(holiday), [holiday]);

  const importanceColors = {
    high: 'bg-red-100 text-red-900',
    medium: 'bg-yellow-100 text-yellow-900',
    low: 'bg-gray-100 text-gray-900'
  };

  return (
    <div className={`
      ${colors.bg} ${colors.border} border rounded-xl p-6 
      ${formattedInfo.isToday ? 'ring-2 ring-yellow-400 shadow-xl' : ''}
      ${formattedInfo.isPast ? 'opacity-70' : ''}
      ${formattedInfo.isUpcoming ? 'shadow-lg' : ''}
      transition-all duration-300 hover:shadow-xl hover:scale-105
      relative overflow-hidden
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                <IconComponent className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${colors.text}`}>
                  {holiday.name}
                </h3>
                {formattedInfo.isToday && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-3 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full animate-pulse">
                      TODAY
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className={`h-4 w-4 ${colors.icon}`} />
                <p className={`text-sm font-medium ${colors.text}`}>
                  {formattedInfo.formattedDate}
                </p>
              </div>
              
              {!compact && holiday.description && (
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className={`h-4 w-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                  <p className={`text-sm text-gray-700`}>
                    {holiday.description}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {holiday.exchanges.map((exchange) => (
                    <span
                      key={exchange}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-800 border border-gray-300 shadow-sm"
                    >
                      {exchange}
                    </span>
                  ))}
                </div>
                
                {holiday.importance && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${importanceColors[holiday.importance]}`}>
                    {holiday.importance.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Time indicator for upcoming holidays */}
              {formattedInfo.isUpcoming && formattedInfo.daysFromToday > 0 && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {formattedInfo.daysFromToday === 1 
                        ? 'Tomorrow' 
                        : `In ${formattedInfo.daysFromToday} days`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4 text-center">
            <div className={`text-2xl font-bold ${colors.text} bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm`}>
              {formattedInfo.shortDate.split(' ')[1]}
            </div>
            <div className={`text-xs font-medium text-gray-700 mt-1`}>
              {formattedInfo.shortDate.split(' ')[0]}
            </div>
          </div>
        </div>
        
        {/* Type indicator */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
            {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)} Holiday
          </span>
          
          <div className={`text-xs text-gray-700 font-medium`}>
            {formattedInfo.weekday}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HolidayStatsProps {
  holidays: MarketHoliday[];
}

function HolidayStats({ holidays }: HolidayStatsProps) {
  const stats = useMemo(() => getHolidayStatistics(), []);
  const remainingTradingDays = useMemo(() => getRemainingTradingDays(), []);
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(1), []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Holidays */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Total Holidays</p>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            <p className="text-xs text-black mt-1 font-bold">in 2025</p>
          </div>
          <CalendarIcon className="h-10 w-10 text-blue-700 opacity-80" />
        </div>
      </div>

      {/* Upcoming Holidays */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800 mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-green-900">{stats.upcoming}</p>
            {upcomingHolidays.length > 0 && (
              <p className="text-xs text-black mt-1 font-bold">
                Next: {getFormattedHolidayInfo(upcomingHolidays[0]).shortDate}
              </p>
            )}
          </div>
          <ClockIcon className="h-10 w-10 text-green-700 opacity-80" />
        </div>
      </div>

      {/* Trading Days Left */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-800 mb-1">Trading Days</p>
            <p className="text-3xl font-bold text-purple-900">{remainingTradingDays}</p>
            <p className="text-xs text-black mt-1 font-bold">remaining in 2025</p>
          </div>
          <ChartBarIcon className="h-10 w-10 text-purple-700 opacity-80" />
        </div>
      </div>

      {/* High Importance Holidays */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-800 mb-1">Major Holidays</p>
            <p className="text-3xl font-bold text-orange-900">{stats.byImportance.high || 0}</p>
            <p className="text-xs text-black mt-1 font-bold">high importance</p>
          </div>
          <ExclamationTriangleIcon className="h-10 w-10 text-orange-700 opacity-80" />
        </div>
      </div>
    </div>
  );
}

export default function MarketHolidayCalendar() {
  const [viewMode, setViewMode] = useState<'upcoming' | 'monthly' | 'all' | 'by-type' | 'by-importance'>('upcoming');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedType, setSelectedType] = useState<MarketHoliday['type']>('national');
  const [selectedImportance, setSelectedImportance] = useState<MarketHoliday['importance']>('high');

  const upcomingHolidays = useMemo(() => getUpcomingHolidays(8), []);
  const monthlyHolidays = useMemo(() => getHolidaysByMonth(selectedMonth), [selectedMonth]);
  const typeHolidays = useMemo(() => getHolidaysByType(selectedType), [selectedType]);
  const importanceHolidays = useMemo(() => getHolidaysByImportance(selectedImportance), [selectedImportance]);

  const getDisplayHolidays = () => {
    switch (viewMode) {
      case 'upcoming':
        return upcomingHolidays;
      case 'monthly':
        return monthlyHolidays;
      case 'by-type':
        return typeHolidays;
      case 'by-importance':
        return importanceHolidays;
      case 'all':
      default:
        return INDIAN_MARKET_HOLIDAYS_2025;
    }
  };

  const displayHolidays = getDisplayHolidays();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          NSE & BSE Market Holidays 2025
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Complete list of Indian stock market trading holidays for NSE, BSE, and MCX exchanges. 
          Plan your investments and trading activities with official holiday calendar.
        </p>
      </div>

      {/* Statistics */}
      <HolidayStats holidays={INDIAN_MARKET_HOLIDAYS_2025} />

      {/* Quick Info Banner */}
      {upcomingHolidays.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Next Market Holiday</h3>
              <p className="text-blue-100 text-lg">
                {upcomingHolidays[0].name} • {getFormattedHolidayInfo(upcomingHolidays[0]).formattedDate}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                {getFormattedHolidayInfo(upcomingHolidays[0]).daysFromToday === 1 
                  ? 'Tomorrow - Markets will be closed'
                  : `In ${getFormattedHolidayInfo(upcomingHolidays[0]).daysFromToday} days`
                }
              </p>
            </div>
            <div className="hidden md:block">
              <CalendarIcon className="h-16 w-16 text-white/30" />
            </div>
          </div>
        </div>
      )}

      {/* View Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-6">
          {/* View Mode Tabs */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Mode
            </label>
            <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { id: 'upcoming', label: 'Upcoming', icon: ClockIcon },
                { id: 'monthly', label: 'By Month', icon: CalendarIcon },
                { id: 'by-type', label: 'By Type', icon: StarIcon },
                { id: 'by-importance', label: 'Priority', icon: ExclamationTriangleIcon },
                { id: 'all', label: 'All Holidays', icon: GlobeAsiaAustraliaIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      viewMode === tab.id
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            {/* Month Selector */}
            {viewMode === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type Selector */}
            {viewMode === 'by-type' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as MarketHoliday['type'])}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="national">National Holidays</option>
                  <option value="regional">Regional Holidays</option>
                  <option value="religious">Religious Holidays</option>
                  <option value="festival">Festival Holidays</option>
                </select>
              </div>
            )}

            {/* Importance Selector */}
            {viewMode === 'by-importance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={selectedImportance}
                  onChange={(e) => setSelectedImportance(e.target.value as MarketHoliday['importance'])}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Holiday Cards */}
      <div className="space-y-6">
        {displayHolidays.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayHolidays.map((holiday) => (
                <HolidayCard key={holiday.date} holiday={holiday} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No holidays found</h3>
            <p className="text-gray-500">
              No holidays match the selected criteria.
            </p>
          </div>
        )}
      </div>

      {/* Official Sources */}
      <div>
        <HolidaySources />
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <InformationCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
          Important Notes & Trading Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-3">Market Timings</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Regular Trading:</strong> 9:15 AM - 3:30 PM (Monday to Friday)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Pre-Market:</strong> 9:00 AM - 9:15 AM (Monday to Friday)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Markets are closed on all <strong>Saturdays and Sundays</strong></span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-3">Trading Notes</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Muhurat Trading:</strong> Special session may be conducted on Diwali</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Holiday dates may change based on <strong>official exchange notifications</strong></span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Different exchanges (NSE, BSE, MCX) may have <strong>slight variations</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Sources Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-blue-600" />
            Official Sources & References
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://www.nseindia.com/resources/exchange-communication-holidays"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-xs font-bold text-blue-600">NSE</span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  NSE Holidays
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Official Calendar
                </p>
              </div>
            </a>
            
            <a
              href="https://www.bseindia.com/static/markets/marketinfo/listholi.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-xs font-bold text-green-600">BSE</span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  BSE Holidays
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Market Info
                </p>
              </div>
            </a>
            
            <a
              href="https://www.mcxindia.com/market-data/holiday-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <span className="text-xs font-bold text-orange-600">MCX</span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                  MCX Calendar
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Commodity
                </p>
              </div>
            </a>
            
            <a
              href="https://www.rbi.org.in/Scripts/HolidayDisplay.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xs font-bold text-purple-600">RBI</span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  RBI Holidays
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Bank Holidays
                </p>
              </div>
            </a>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Disclaimer:</strong> Holiday information is sourced from official exchange websites. 
              Always verify with respective exchanges for the most current information as dates may be subject to change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
