import { DhanPositionsResponse } from '@/lib/types';
import { useDhanApi } from './useDhanApi';

// Custom hook for fetching positions
export function usePositions() {
  return useDhanApi<DhanPositionsResponse['data']>('positions');
}
