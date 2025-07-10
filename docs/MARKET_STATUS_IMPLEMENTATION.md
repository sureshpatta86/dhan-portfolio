# Market Status Implementation

## Overview
The dashboard now displays accurate, real-time Indian stock market status based on actual NSE/BSE trading hours and holidays.

## Features Implemented

### 1. Market Timing Logic
**Indian Stock Market Hours (IST):**
- **Pre-Market**: 9:00 AM - 9:15 AM (Monday to Friday)
- **Regular Trading**: 9:15 AM - 3:30 PM (Monday to Friday)
- **Weekends**: Closed
- **Market Holidays**: Closed (includes 2025 holiday calendar)

### 2. Market Status States
- **OPEN**: Market is currently open for trading (9:15 AM - 3:30 PM IST)
- **PRE_MARKET**: Pre-market session is active (9:00 AM - 9:15 AM IST)
- **CLOSED**: Market is closed (after hours, before pre-market, or weekends)
- **HOLIDAY**: Market is closed due to a public holiday

### 3. Real-time Updates
- Updates every minute automatically
- Shows time remaining until next market event
- Accurate countdown to market open/close times
- Handles timezone conversion to IST

### 4. Visual Indicators
**Color Coding:**
- 🟢 **Green**: Market Open
- 🟡 **Yellow**: Pre-Market
- 🔴 **Red**: Market Closed
- 🟣 **Purple**: Market Holiday

### 5. Component Types

#### MarketStatusIndicator Component
- **Full Banner**: Complete status with detailed information
- **Compact Mode**: Minimal status indicator
- **Hero Mode**: Special styling for hero sections with white text

## Files Created/Modified

### Core Utilities
- `/src/lib/utils/marketStatus.ts` - Main market status logic
- `/src/lib/utils/marketHolidays.ts` - 2025 holiday calendar

### Components
- `/src/components/MarketStatusIndicator.tsx` - Reusable status component
- `/src/components/MarketHolidayCalendar.tsx` - Complete holiday calendar with filters
- `/src/components/HolidayWidget.tsx` - Compact holiday widget for dashboard
- `/src/components/DashboardHome.tsx` - Updated to use real market status
- `/src/components/OptionChainAdvanced.tsx` - Added market status indicator

### Test Pages
- `/src/app/market-status-test/page.tsx` - Testing and verification page

## Holiday Calendar 2025
**Enhanced with NSE/BSE Official Data:**

### Complete Holiday List:
- **Republic Day** (Jan 26) - National Holiday
- **Mahashivratri** (Feb 26) - Religious Holiday  
- **Holi** (Mar 13) - Festival of Colors
- **Ram Navami** (Mar 31) - Religious Holiday
- **Dr. Baba Saheb Ambedkar Jayanti** (Apr 14) - National Holiday
- **Good Friday** (Apr 18) - Religious Holiday
- **Maharashtra Day** (May 1) - Regional Holiday (NSE/BSE only)
- **Buddha Purnima** (May 12) - Religious Holiday
- **Independence Day** (Aug 15) - National Holiday
- **Ganesh Chaturthi** (Sep 7) - Religious Holiday
- **Gandhi Jayanti** (Oct 2) - National Holiday
- **Dussehra** (Oct 20) - Festival Holiday
- **Diwali Laxmi Pujan** (Nov 1) - Festival Holiday
- **Diwali Balipratipada** (Nov 5) - Festival Holiday
- **Guru Nanak Jayanti** (Nov 15) - Religious Holiday
- **Christmas** (Dec 25) - Religious Holiday

### Features Added:
- **Priority Levels**: High/Medium/Low importance classification
- **Real-time Status**: Days until next holiday calculation
- **Exchange Coverage**: Specific NSE/BSE/MCX applicability
- **Enhanced Descriptions**: Detailed context for each holiday
- **Trading Day Counter**: Remaining trading days in the year
- **Multiple Views**: Filter by month, type, importance, or upcoming
- **Beautiful UI**: Modern cards with gradients and animations
- **Widget Component**: Compact holiday display for dashboard integration

## Usage Examples

### In Dashboard Components
```typescript
import MarketStatusIndicator from '@/components/MarketStatusIndicator';

// Full status banner
<MarketStatusIndicator />

// Compact status
<MarketStatusIndicator compact={true} />

// Hero section styling
<MarketStatusIndicator compact={true} heroMode={true} />
```

### Using the Hook Directly
```typescript
import { useMarketStatus } from '@/lib/utils/marketStatus';

function MyComponent() {
  const marketStatus = useMarketStatus();
  
  return (
    <div>
      <p>Market is {marketStatus.isOpen ? 'Open' : 'Closed'}</p>
      <p>{marketStatus.statusMessage}</p>
      <p>{marketStatus.timeUntilNextEvent}</p>
    </div>
  );
}
```

## Technical Details

### Timezone Handling
- Uses `Asia/Kolkata` timezone for accurate IST conversion
- Handles daylight saving time automatically
- Works correctly regardless of user's local timezone

### Performance
- Updates only once per minute (not every second)
- Memoized calculations to prevent unnecessary re-renders
- Minimal impact on application performance

### Error Handling
- Graceful fallback for timezone conversion issues
- Handles edge cases around midnight transitions
- Robust holiday date checking

## Testing
Visit `/market-status-test` to:
- See current IST time
- View detailed market status information
- Test different visual components
- Verify holiday handling

## Benefits
1. **Accurate Information**: No more static "Market is Open" messages
2. **Real-time Updates**: Status changes automatically throughout the day
3. **User Awareness**: Users know exactly when they can trade
4. **Professional**: Matches industry standards for trading platforms
5. **Comprehensive**: Includes pre-market, holidays, and precise timing

The market status now accurately reflects Indian stock market conditions and provides users with reliable, real-time information about trading availability.
