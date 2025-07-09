/**
 * Trading feature - custom hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TradingService } from './services';
import type { PlaceOrderRequest, ModifyOrderRequest } from './types';

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

// Order Management Hooks

export function useOrderBook() {
  return useQuery({
    queryKey: tradingQueryKeys.orderBook(),
    queryFn: TradingService.getOrderBook,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
  });
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
