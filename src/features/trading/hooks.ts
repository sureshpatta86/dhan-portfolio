/**
 * Trading feature - custom hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TradingService, getOptionChain, getExpiryList } from './services';
import type { PlaceOrderRequest, ModifyOrderRequest, PlaceSuperOrderRequest, ModifySuperOrderRequest, PlaceForeverOrderRequest, ModifyForeverOrderRequest } from './types';

// Query keys for React Query
export const tradingQueryKeys = {
  all: ['trading'] as const,
  funds: () => [...tradingQueryKeys.all, 'funds'] as const,
  ledger: () => [...tradingQueryKeys.all, 'ledger'] as const,
  orders: () => [...tradingQueryKeys.all, 'orders'] as const,
  orderBook: () => [...tradingQueryKeys.orders(), 'book'] as const,
  orderDetails: (id: string) => [...tradingQueryKeys.orders(), 'details', id] as const,
  orderByCorrelation: (id: string) => [...tradingQueryKeys.orders(), 'correlation', id] as const,
  trades: () => [...tradingQueryKeys.all, 'trades'] as const,
  tradeBook: () => [...tradingQueryKeys.trades(), 'book'] as const,
  tradesByOrder: (orderId: string) => [...tradingQueryKeys.trades(), 'order', orderId] as const,
  // Super Order query keys
  superOrders: () => [...tradingQueryKeys.all, 'super-orders'] as const,
  superOrderBook: () => [...tradingQueryKeys.superOrders(), 'book'] as const,
  // Forever Order query keys
  foreverOrders: () => [...tradingQueryKeys.all, 'forever-orders'] as const,
  foreverOrderBook: () => [...tradingQueryKeys.foreverOrders(), 'book'] as const,
};

export function useFunds() {
  const result = useQuery({
    queryKey: tradingQueryKeys.funds(),
    queryFn: TradingService.getFunds,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  
  console.log('useFunds hook result:', result);
  console.log('useFunds queryKey:', tradingQueryKeys.funds());
  
  return result;
}

export function useLedger(fromDate?: string, toDate?: string) {
  console.log('useLedger hook called with:', { fromDate, toDate, enabled: !!(fromDate && toDate) });
  
  return useQuery({
    queryKey: [...tradingQueryKeys.ledger(), fromDate, toDate],
    queryFn: () => {
      console.log('useLedger queryFn executing...');
      return TradingService.getLedger(fromDate, toDate);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // enabled: !!(fromDate && toDate), // Temporarily disable this condition
  });
}

// Order Management Hooks

export function useOrderBook() {
  console.log('useOrderBook hook called');
  
  // Check if we're in a QueryClient context
  const queryClient = useQueryClient();
  console.log('useOrderBook - QueryClient exists:', !!queryClient);
  console.log('useOrderBook - QueryClient queries count:', queryClient.getQueryCache().getAll().length);
  
  const queryKey = tradingQueryKeys.orderBook();
  console.log('useOrderBook - Query key:', queryKey);
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('useOrderBook: queryFn executing - START');
      try {
        // Use direct fetch instead of the service layer for debugging
        const response = await fetch('/api/trading/orders');
        console.log('useOrderBook: Direct fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('useOrderBook: Direct fetch result:', result);
        return result.data || [];
      } catch (error) {
        console.error('useOrderBook: queryFn executing - ERROR', error);
        throw error;
      }
    },
    staleTime: 0, // Always fetch for debugging
    gcTime: 0, // Don't cache for debugging
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: typeof window !== 'undefined', // Only run on client side
  });
  
  console.log('useOrderBook hook result:', {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    status: query.status,
    dataUpdatedAt: query.dataUpdatedAt,
    errorUpdatedAt: query.errorUpdatedAt,
    fetchStatus: query.fetchStatus,
    isStale: query.isStale,
    isFetching: query.isFetching,
  });
  
  return query;
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: tradingQueryKeys.orderDetails(orderId),
    queryFn: () => TradingService.getOrderDetails(orderId),
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!orderId,
  });
}

export function useOrderByCorrelationId(correlationId: string) {
  return useQuery({
    queryKey: tradingQueryKeys.orderByCorrelation(correlationId),
    queryFn: () => TradingService.getOrderByCorrelationId(correlationId),
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!correlationId,
  });
}

export function useTradeBook() {
  return useQuery({
    queryKey: tradingQueryKeys.tradeBook(),
    queryFn: TradingService.getTradeBook,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Auto-refresh every minute
  });
}

export function useTradesByOrderId(orderId: string) {
  return useQuery({
    queryKey: tradingQueryKeys.tradesByOrder(orderId),
    queryFn: () => TradingService.getTradesByOrderId(orderId),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!orderId,
  });
}

// Order Mutation Hooks

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: PlaceOrderRequest) => TradingService.placeOrder(orderData),
    onSuccess: () => {
      // Invalidate order book and funds to refresh data
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderBook() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.funds() });
    },
  });
}

export function useModifyOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, modifyData }: { orderId: string; modifyData: ModifyOrderRequest }) => 
      TradingService.modifyOrder(orderId, modifyData),
    onSuccess: (_, { orderId }) => {
      // Invalidate specific order and order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderDetails(orderId) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderBook() });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => TradingService.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      // Invalidate specific order and order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderDetails(orderId) });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderBook() });
    },
  });
}

export function usePlaceSlicedOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: PlaceOrderRequest) => TradingService.placeSlicedOrder(orderData),
    onSuccess: () => {
      // Invalidate order book and funds to refresh data
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.orderBook() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.funds() });
    },
  });
}

// Super Order Management Hooks

export function useSuperOrderBook() {
  return useQuery({
    queryKey: tradingQueryKeys.superOrderBook(),
    queryFn: TradingService.getSuperOrderBook,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
  });
}

export function usePlaceSuperOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: PlaceSuperOrderRequest) => TradingService.placeSuperOrder(orderData),
    onSuccess: () => {
      // Invalidate super order book and funds to refresh data
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.superOrderBook() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.funds() });
    },
  });
}

export function useModifySuperOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (modifyData: ModifySuperOrderRequest) => TradingService.modifySuperOrder(modifyData),
    onSuccess: () => {
      // Invalidate super order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.superOrderBook() });
    },
  });
}

export function useCancelSuperOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, legName = 'ENTRY_LEG' }: { orderId: string; legName?: string }) => 
      TradingService.cancelSuperOrder(orderId, legName),
    onSuccess: () => {
      // Invalidate super order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.superOrderBook() });
    },
  });
}

// Forever Order Management Hooks

export function useForeverOrderBook() {
  console.log('useForeverOrderBook hook called');
  
  return useQuery({
    queryKey: tradingQueryKeys.foreverOrderBook(),
    queryFn: TradingService.getForeverOrderBook,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
  });
}

export function usePlaceForeverOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: PlaceForeverOrderRequest) => TradingService.placeForeverOrder(orderData),
    onSuccess: () => {
      // Invalidate forever order book and funds to refresh data
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.foreverOrderBook() });
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.funds() });
    },
  });
}

export function useModifyForeverOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (modifyData: ModifyForeverOrderRequest) => TradingService.modifyForeverOrder(modifyData),
    onSuccess: () => {
      // Invalidate forever order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.foreverOrderBook() });
    },
  });
}

export function useCancelForeverOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => TradingService.cancelForeverOrder(orderId),
    onSuccess: () => {
      // Invalidate forever order book
      queryClient.invalidateQueries({ queryKey: tradingQueryKeys.foreverOrderBook() });
    },
  });
}

/**
 * Hook to fetch option chain data
 */
export const useOptionChain = (
  underlyingScrip: number,
  underlyingSeg: string,
  expiry: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['optionChain', underlyingScrip, underlyingSeg, expiry],
    queryFn: () => {
      // Additional validation before making the API call
      if (!underlyingScrip || !underlyingSeg || !expiry) {
        throw new Error('UnderlyingScrip, UnderlyingSeg, and Expiry are required');
      }
      console.log('Calling getOptionChain with:', { underlyingScrip, underlyingSeg, expiry });
      return getOptionChain({
        UnderlyingScrip: underlyingScrip,
        UnderlyingSeg: underlyingSeg,
        Expiry: expiry
      });
    },
    enabled: enabled && !!underlyingScrip && !!underlyingSeg && !!expiry && expiry.trim() !== '',
    staleTime: 1000 * 30, // 30 seconds - much more conservative for rate limit
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchInterval: 1000 * 60, // Auto-refresh every 60 seconds (much slower)
    retry: (failureCount, error: any) => {
      // Don't retry on rate limit errors
      if (error?.message?.includes('429') || error?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook to fetch expiry list for an underlying
 */
export const useExpiryList = (
  underlyingScrip: number,
  underlyingSeg: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['expiryList', underlyingScrip, underlyingSeg],
    queryFn: () => {
      // Additional validation before making the API call
      if (!underlyingScrip || !underlyingSeg) {
        throw new Error('UnderlyingScrip and UnderlyingSeg are required');
      }
      console.log('Calling getExpiryList with:', { underlyingScrip, underlyingSeg });
      return getExpiryList({
        UnderlyingScrip: underlyingScrip,
        UnderlyingSeg: underlyingSeg
      });
    },
    enabled: enabled && !!underlyingScrip && !!underlyingSeg,
    staleTime: 1000 * 60 * 10, // 10 minutes (expiry dates don't change frequently)
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    retry: (failureCount, error: any) => {
      // Don't retry on rate limit errors
      if (error?.message?.includes('429') || error?.status === 429) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
