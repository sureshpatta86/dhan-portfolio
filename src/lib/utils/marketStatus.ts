/**
 * Market Status Utility
 * Determines if Indian stock markets (NSE/BSE) are currently open
 */

import React from 'react';
import { isMarketHoliday, getNextTradingDay, INDIAN_MARKET_HOLIDAYS_2025_DATES } from './marketHolidays';

export interface MarketStatus {
  isOpen: boolean;
  isPreMarket: boolean;
  isPostMarket: boolean;
  isHoliday: boolean;
  status: 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET' | 'HOLIDAY';
  statusMessage: string;
  nextEvent: string;
  timeUntilNextEvent: string;
}

/**
 * Get current Indian market status
 * Market timings (IST):
 * - Pre-market: 9:00 AM - 9:15 AM (Monday to Friday)
 * - Regular market: 9:15 AM - 3:30 PM (Monday to Friday)
 * - Post-market: Closed
 * - Weekends: Closed
 * - Holidays: Closed
 */
export function getMarketStatus(): MarketStatus {
  // Get current time in IST
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const currentDay = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentHour = istTime.getHours();
  const currentMinute = istTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Market timings in minutes from midnight
  const preMarketStart = 9 * 60; // 9:00 AM
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  // Check if it's a weekend
  const isWeekend = currentDay === 0 || currentDay === 6;
  
  // Check if it's a holiday
  const isHoliday = isMarketHoliday(istTime);
  
  if (isWeekend || isHoliday) {
    const nextTradingDay = getNextTradingDay(istTime);
    const daysUntilNext = Math.ceil((nextTradingDay.getTime() - istTime.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isOpen: false,
      isPreMarket: false,
      isPostMarket: false,
      isHoliday: isHoliday,
      status: isHoliday ? 'HOLIDAY' : 'CLOSED',
      statusMessage: isHoliday ? 'Markets are closed for holiday' : 'Markets are closed on weekends',
      nextEvent: 'Market opens on next trading day at 9:15 AM IST',
      timeUntilNextEvent: `${daysUntilNext} day${daysUntilNext > 1 ? 's' : ''} remaining`
    };
  }
  
  // Weekday logic
  if (currentTimeInMinutes >= preMarketStart && currentTimeInMinutes < marketOpen) {
    // Pre-market session
    const minutesUntilOpen = marketOpen - currentTimeInMinutes;
    return {
      isOpen: false,
      isPreMarket: true,
      isPostMarket: false,
      isHoliday: false,
      status: 'PRE_MARKET',
      statusMessage: 'Pre-market session is active',
      nextEvent: 'Market opens at 9:15 AM IST',
      timeUntilNextEvent: `${minutesUntilOpen} minute${minutesUntilOpen > 1 ? 's' : ''} remaining`
    };
  }
  
  if (currentTimeInMinutes >= marketOpen && currentTimeInMinutes < marketClose) {
    // Market is open
    const minutesUntilClose = marketClose - currentTimeInMinutes;
    const hoursUntilClose = Math.floor(minutesUntilClose / 60);
    const remainingMinutes = minutesUntilClose % 60;
    
    let timeUntilClose = '';
    if (hoursUntilClose > 0) {
      timeUntilClose = `${hoursUntilClose}h ${remainingMinutes}m remaining`;
    } else {
      timeUntilClose = `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} remaining`;
    }
    
    return {
      isOpen: true,
      isPreMarket: false,
      isPostMarket: false,
      isHoliday: false,
      status: 'OPEN',
      statusMessage: 'Markets are open for trading',
      nextEvent: 'Market closes at 3:30 PM IST',
      timeUntilNextEvent: timeUntilClose
    };
  }
  
  // Market is closed (after hours or before pre-market)
  if (currentTimeInMinutes >= marketClose) {
    // After market hours - calculate time until next trading day
    const nextTradingDay = getNextTradingDay(istTime);
    nextTradingDay.setHours(9, 15, 0, 0);
    
    const hoursUntilOpen = Math.floor((nextTradingDay.getTime() - istTime.getTime()) / (1000 * 60 * 60));
    
    return {
      isOpen: false,
      isPreMarket: false,
      isPostMarket: true,
      isHoliday: false,
      status: 'CLOSED',
      statusMessage: 'Markets are closed for the day',
      nextEvent: 'Market opens on next trading day at 9:15 AM IST',
      timeUntilNextEvent: `${hoursUntilOpen} hour${hoursUntilOpen > 1 ? 's' : ''} remaining`
    };
  }
  
  // Before pre-market (early morning)
  const minutesUntilPreMarket = preMarketStart - currentTimeInMinutes;
  return {
    isOpen: false,
    isPreMarket: false,
    isPostMarket: false,
    isHoliday: false,
    status: 'CLOSED',
    statusMessage: 'Markets are closed',
    nextEvent: 'Pre-market starts at 9:00 AM IST',
    timeUntilNextEvent: `${minutesUntilPreMarket} minute${minutesUntilPreMarket > 1 ? 's' : ''} remaining`
  };
}

/**
 * Hook to get real-time market status with auto-updates
 */
export function useMarketStatus() {
  const [marketStatus, setMarketStatus] = React.useState<MarketStatus>(getMarketStatus());
  
  React.useEffect(() => {
    // Update immediately
    setMarketStatus(getMarketStatus());
    
    // Set up interval to update every minute
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return marketStatus;
}

/**
 * Get market status color based on current state
 */
export function getMarketStatusColor(status: MarketStatus['status']) {
  switch (status) {
    case 'OPEN':
      return {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        subtext: 'text-green-600',
        dot: 'bg-green-500'
      };
    case 'PRE_MARKET':
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        subtext: 'text-yellow-600',
        dot: 'bg-yellow-500'
      };
    case 'HOLIDAY':
      return {
        bg: 'bg-purple-50 border-purple-200',
        text: 'text-purple-800',
        subtext: 'text-purple-600',
        dot: 'bg-purple-500'
      };
    case 'CLOSED':
    case 'POST_MARKET':
      return {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        subtext: 'text-red-600',
        dot: 'bg-red-500'
      };
    default:
      return {
        bg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-800',
        subtext: 'text-gray-600',
        dot: 'bg-gray-500'
      };
  }
}
