import { DhanHoldingsResponse } from '@/lib/types';
import { useDhanApi } from './useDhanApi';

// Custom hook for fetching holdings
export function useHoldings() {
  return useDhanApi<DhanHoldingsResponse['data']>('holdings');
}
