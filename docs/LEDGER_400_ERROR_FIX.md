# HTTP 400 Error Fix - Ledger API

## Issue Description
The ledger API was returning a 400 error with the message "from-date and to-date parameters are required" when accessed from the Statements component.

## Root Cause
The issue was in the `useLedger` hook implementation in `/src/features/trading/hooks.ts`. The hook was configured with `enabled: true`, which meant it would always execute the query immediately when the component mounted, but without the required date parameters.

## Fix Applied

### 1. Updated useLedger Hook
**File:** `/src/features/trading/hooks.ts`

**Before:**
```typescript
export function useLedger(fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: [...tradingQueryKeys.ledger(), fromDate, toDate],
    queryFn: () => TradingService.getLedger(fromDate, toDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true, // Always enabled, will use defaults if no dates provided
  });
}
```

**After:**
```typescript
export function useLedger(fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: [...tradingQueryKeys.ledger(), fromDate, toDate],
    queryFn: () => TradingService.getLedger(fromDate, toDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!(fromDate && toDate), // Only enabled when both dates are provided
  });
}
```

**Key Changes:**
- Changed `enabled: true` to `enabled: !!(fromDate && toDate)`
- This ensures the query only runs when both `fromDate` and `toDate` are provided
- Prevents the 400 error by not making API calls without required parameters

### 2. Created Missing Route
**File:** `/src/app/reports/statements/page.tsx` (New)

Created the missing route for the Statements component that was referenced in the navigation but didn't exist.

## Verification
1. ✅ API endpoint works correctly with proper date parameters
2. ✅ API endpoint correctly returns 400 error when dates are missing
3. ✅ Statements component loads without errors
4. ✅ TypeScript compilation passes without errors
5. ✅ React Query hook only executes when date parameters are available

## API Test Results
```bash
# Without dates - Returns 400 (Expected)
curl "http://localhost:3002/api/trading/ledger"
# {"error":"from-date and to-date parameters are required"}

# With dates - Returns 200 (Success)
curl "http://localhost:3002/api/trading/ledger?from-date=2024-01-01&to-date=2024-01-31"
# {"success":true,"endpoint":"ledger","data":[...],"count":34}
```

## Resolution Status
✅ **RESOLVED** - The HTTP 400 error has been fixed. The ledger API now works correctly with the Statements component.
