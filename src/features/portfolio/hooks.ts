/**
 * Portfolio feature - custom hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PortfolioService } from './services';
import type { ConvertPositionRequest } from './types';

// Query keys for React Query
export const portfolioQueryKeys = {
  all: ['portfolio'] as const,
  holdings: () => [...portfolioQueryKeys.all, 'holdings'] as const,
  positions: () => [...portfolioQueryKeys.all, 'positions'] as const,
  summary: () => [...portfolioQueryKeys.all, 'summary'] as const,
};

export function useHoldings() {
  return useQuery({
    queryKey: portfolioQueryKeys.holdings(),
    queryFn: PortfolioService.getHoldings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePositions() {
  return useQuery({
    queryKey: portfolioQueryKeys.positions(),
    queryFn: PortfolioService.getPositions,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: portfolioQueryKeys.summary(),
    queryFn: PortfolioService.getPortfolioSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useConvertPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ConvertPositionRequest) => 
      PortfolioService.convertPosition(request),
    onSuccess: () => {
      // Invalidate positions query to refetch updated data
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.positions() });
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.summary() });
    },
  });
}
