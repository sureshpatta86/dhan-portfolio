/**
 * Re-export all shared hooks
 */

// Portfolio hooks (using new feature-based architecture)
export { 
  useHoldings, 
  usePositions, 
  usePortfolioSummary, 
  useConvertPosition 
} from '@/features/portfolio/hooks';

// Trading hooks (using new feature-based architecture)
export { 
  useFunds,
  useLedger
} from '@/features/trading/hooks';

// Legacy exports for backward compatibility
export { useDhanApi } from './useDhanApi';
export { useTradeHistory } from './useStatements';

