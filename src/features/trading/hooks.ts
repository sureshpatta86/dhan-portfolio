/**
 * Trading feature - custom hooks
 */

import { useQuery } from '@tanstack/react-query';
import { TradingService } from './services';

// Query keys for React Query
export const tradingQueryKeys = {
  all: ['trading'] as const,
  funds: () => [...tradingQueryKeys.all, 'funds'] as const,
  ledger: () => [...tradingQueryKeys.all, 'ledger'] as const,
};

export function useFunds() {
  return useQuery({
    queryKey: tradingQueryKeys.funds(),
    queryFn: TradingService.getFunds,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useLedger(fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: [...tradingQueryKeys.ledger(), fromDate, toDate],
    queryFn: () => TradingService.getLedger(fromDate, toDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!(fromDate && toDate), // Only enabled when both dates are provided
  });
}
