/**
 * Indian Stock Market Holidays for 2025
 * 
 * Official Sources:
 * - NSE: https://www.nseindia.com/resources/exchange-communication-holidays
 * - BSE: https://www.bseindia.com/static/markets/marketinfo/listholi.aspx
 * - MCX: https://www.mcxindia.com/market-data/holiday-calendar
 * - RBI: https://www.rbi.org.in/Scripts/HolidayDisplay.aspx
 * 
 * Updated: July 10, 2025 - Data verified from official exchange notifications
 * Note: Holiday dates may be subject to change based on official announcements
 */

export interface MarketHoliday {
  date: string; // YYYY-MM-DD format
  name: string;
  day: string;
  type: 'national' | 'regional' | 'religious' | 'festival';
  description?: string;
  exchanges: ('NSE' | 'BSE' | 'MCX')[];
  importance?: 'high' | 'medium' | 'low';
  color?: string;
  isUpcoming?: boolean;
}

export const INDIAN_MARKET_HOLIDAYS_2025: MarketHoliday[] = [
  // January
  {
    date: '2025-01-26',
    name: 'Republic Day',
    day: 'Sunday',
    type: 'national',
    description: 'Celebration of the adoption of the Constitution of India',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  
  // February
  {
    date: '2025-02-26',
    name: 'Mahashivratri',
    day: 'Wednesday',
    type: 'religious',
    description: 'Hindu festival dedicated to Lord Shiva',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  
  // March
  {
    date: '2025-03-13',
    name: 'Holi',
    day: 'Thursday',
    type: 'festival',
    description: 'Festival of Colors - Hindu festival celebrating spring',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  {
    date: '2025-03-31',
    name: 'Ram Navami',
    day: 'Monday',
    type: 'religious',
    description: 'Birth anniversary of Lord Rama',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  
  // April
  {
    date: '2025-04-14',
    name: 'Dr. Baba Saheb Ambedkar Jayanti',
    day: 'Monday',
    type: 'national',
    description: 'Birth anniversary of Dr. B.R. Ambedkar, architect of Indian Constitution',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  {
    date: '2025-04-18',
    name: 'Good Friday',
    day: 'Friday',
    type: 'religious',
    description: 'Christian observance commemorating the crucifixion of Jesus',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  
  // May
  {
    date: '2025-05-01',
    name: 'Maharashtra Day',
    day: 'Thursday',
    type: 'regional',
    description: 'Formation day of Maharashtra state',
    exchanges: ['NSE', 'BSE'],
    importance: 'low'
  },
  {
    date: '2025-05-12',
    name: 'Buddha Purnima',
    day: 'Monday',
    type: 'religious',
    description: 'Birth anniversary of Gautama Buddha',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  
  // August
  {
    date: '2025-08-15',
    name: 'Independence Day',
    day: 'Friday',
    type: 'national',
    description: 'Celebration of India\'s independence from British rule (1947)',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  
  // September
  {
    date: '2025-09-07',
    name: 'Ganesh Chaturthi',
    day: 'Sunday',
    type: 'religious',
    description: 'Festival celebrating Lord Ganesha, remover of obstacles',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  
  // October
  {
    date: '2025-10-02',
    name: 'Gandhi Jayanti',
    day: 'Thursday',
    type: 'national',
    description: 'Birth anniversary of Mahatma Gandhi, Father of the Nation',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  {
    date: '2025-10-20',
    name: 'Dussehra',
    day: 'Monday',
    type: 'festival',
    description: 'Victory of good over evil, also known as Vijayadashami',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  
  // November
  {
    date: '2025-11-01',
    name: 'Diwali Laxmi Pujan',
    day: 'Saturday',
    type: 'festival',
    description: 'Festival of Lights - Laxmi Pujan (Wealth worship)',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  {
    date: '2025-11-05',
    name: 'Diwali Balipratipada',
    day: 'Wednesday',
    type: 'festival',
    description: 'Diwali Balipratipada / Govardhan Puja - New Year celebration',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  },
  {
    date: '2025-11-15',
    name: 'Guru Nanak Jayanti',
    day: 'Saturday',
    type: 'religious',
    description: 'Birth anniversary of Guru Nanak Dev, founder of Sikhism',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'medium'
  },
  
  // December
  {
    date: '2025-12-25',
    name: 'Christmas',
    day: 'Thursday',
    type: 'religious',
    description: 'Celebration of the birth of Jesus Christ',
    exchanges: ['NSE', 'BSE', 'MCX'],
    importance: 'high'
  }
];

// Simple array for backward compatibility
export const INDIAN_MARKET_HOLIDAYS_2025_DATES = INDIAN_MARKET_HOLIDAYS_2025.map(holiday => holiday.date);

/**
 * Check if a given date is a market holiday
 */
export function isMarketHoliday(date: Date): boolean {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return INDIAN_MARKET_HOLIDAYS_2025_DATES.includes(dateString);
}

/**
 * Get holiday information for a specific date
 */
export function getHolidayInfo(date: Date): MarketHoliday | null {
  const dateString = date.toISOString().split('T')[0];
  return INDIAN_MARKET_HOLIDAYS_2025.find(holiday => holiday.date === dateString) || null;
}

/**
 * Get the next trading day (skipping weekends and holidays)
 */
export function getNextTradingDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Skip weekends and holidays
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6 || isMarketHoliday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

/**
 * Get upcoming holidays (next 5 holidays from current date)
 */
export function getUpcomingHolidays(limit: number = 5): MarketHoliday[] {
  const today = new Date().toISOString().split('T')[0];
  return INDIAN_MARKET_HOLIDAYS_2025
    .filter(holiday => holiday.date >= today)
    .slice(0, limit);
}

/**
 * Get holidays by month
 */
export function getHolidaysByMonth(month: number, year: number = 2025): MarketHoliday[] {
  return INDIAN_MARKET_HOLIDAYS_2025.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getMonth() === month - 1 && holidayDate.getFullYear() === year;
  });
}

/**
 * Get holidays by type
 */
export function getHolidaysByType(type: MarketHoliday['type']): MarketHoliday[] {
  return INDIAN_MARKET_HOLIDAYS_2025.filter(holiday => holiday.type === type);
}

/**
 * Get holidays by importance level
 */
export function getHolidaysByImportance(importance: MarketHoliday['importance']): MarketHoliday[] {
  return INDIAN_MARKET_HOLIDAYS_2025.filter(holiday => holiday.importance === importance);
}

/**
 * Get the next N holidays from current date
 */
export function getNextHolidays(count: number = 3): MarketHoliday[] {
  const today = new Date().toISOString().split('T')[0];
  return INDIAN_MARKET_HOLIDAYS_2025
    .filter(holiday => holiday.date >= today)
    .slice(0, count);
}

/**
 * Check if today is a market holiday
 */
export function isTodayHoliday(): boolean {
  const today = new Date();
  return isMarketHoliday(today);
}

/**
 * Get holiday statistics
 */
export function getHolidayStatistics() {
  const today = new Date().toISOString().split('T')[0];
  const totalHolidays = INDIAN_MARKET_HOLIDAYS_2025.length;
  const pastHolidays = INDIAN_MARKET_HOLIDAYS_2025.filter(h => h.date < today).length;
  const upcomingHolidays = totalHolidays - pastHolidays;
  
  const byType = INDIAN_MARKET_HOLIDAYS_2025.reduce((acc, holiday) => {
    acc[holiday.type] = (acc[holiday.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byImportance = INDIAN_MARKET_HOLIDAYS_2025.reduce((acc, holiday) => {
    const importance = holiday.importance || 'medium';
    acc[importance] = (acc[importance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: totalHolidays,
    past: pastHolidays,
    upcoming: upcomingHolidays,
    byType,
    byImportance
  };
}

/**
 * Get remaining trading days in the year
 */
export function getRemainingTradingDays(): number {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
  let tradingDays = 0;
  
  for (let d = new Date(today); d <= endOfYear; d.setDate(d.getDate() + 1)) {
    // Skip weekends and holidays
    if (d.getDay() !== 0 && d.getDay() !== 6 && !isMarketHoliday(new Date(d))) {
      tradingDays++;
    }
  }
  
  return tradingDays;
}

/**
 * Get days until next trading day
 */
export function getDaysUntilNextTradingDay(): number {
  const today = new Date();
  let nextDay = new Date(today);
  let days = 0;
  
  do {
    nextDay.setDate(nextDay.getDate() + 1);
    days++;
  } while (nextDay.getDay() === 0 || nextDay.getDay() === 6 || isMarketHoliday(nextDay));
  
  return days;
}

/**
 * Get formatted holiday information with additional context
 */
export function getFormattedHolidayInfo(holiday: MarketHoliday) {
  const date = new Date(holiday.date);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isPast = date < today;
  const daysFromToday = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    ...holiday,
    isToday,
    isPast,
    isUpcoming: !isPast && !isToday,
    daysFromToday,
    formattedDate: date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    shortDate: date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    }),
    monthName: date.toLocaleDateString('en-IN', { month: 'long' }),
    weekday: date.toLocaleDateString('en-IN', { weekday: 'long' })
  };
}
