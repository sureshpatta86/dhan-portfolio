/**
 * Trading feature - API services
 */

import { internalApiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  DhanFunds, 
  DhanLedger,
  PlaceOrderRequest,
  ModifyOrderRequest,
  DhanOrder,
  DhanTrade,
  OrderResponse
} from './types';

export class TradingService {
  static async getFunds(): Promise<DhanFunds> {
    const response = await internalApiClient.get<DhanFunds>(API_ENDPOINTS.TRADING.FUNDS);
    return response.data || {
      dhanClientId: '',
      availabelBalance: 0,
      sodLimit: 0,
      collateralAmount: 0,
      receiveableAmount: 0,
      utilizedAmount: 0,
      blockedPayoutAmount: 0,
      withdrawableBalance: 0,
    };
  }

  static async getLedger(fromDate?: string, toDate?: string): Promise<DhanLedger[]> {
    // Default to last 30 days if no dates provided
    const defaultToDate = new Date().toISOString().split('T')[0];
    const defaultFromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const from = fromDate || defaultFromDate;
    const to = toDate || defaultToDate;
    
    const endpoint = `${API_ENDPOINTS.TRADING.LEDGER}?from-date=${from}&to-date=${to}`;
    const response = await internalApiClient.get<DhanLedger[]>(endpoint);
    return response.data || [];
  }

  // Order Management Services
  static async placeOrder(orderData: PlaceOrderRequest): Promise<OrderResponse> {
    const response = await internalApiClient.post<OrderResponse>(
      API_ENDPOINTS.TRADING.ORDERS, 
      orderData
    );
    if (!response.data) {
      throw new Error('Failed to place order - no response data');
    }
    return response.data;
  }

  static async getOrderBook(): Promise<DhanOrder[]> {
    const response = await internalApiClient.get<DhanOrder[]>(
      API_ENDPOINTS.TRADING.ORDERS
    );
    return response.data || [];
  }

  static async getOrderDetails(orderId: string): Promise<DhanOrder> {
    const response = await internalApiClient.get<DhanOrder>(
      `${API_ENDPOINTS.TRADING.ORDERS}/${orderId}`
    );
    if (!response.data) {
      throw new Error('Failed to get order details - no response data');
    }
    return response.data;
  }

  static async modifyOrder(orderId: string, modifyData: ModifyOrderRequest): Promise<OrderResponse> {
    const response = await internalApiClient.put<OrderResponse>(
      `${API_ENDPOINTS.TRADING.ORDERS}/${orderId}`,
      modifyData
    );
    if (!response.data) {
      throw new Error('Failed to modify order - no response data');
    }
    return response.data;
  }

  static async cancelOrder(orderId: string): Promise<OrderResponse> {
    const response = await internalApiClient.delete<OrderResponse>(
      `${API_ENDPOINTS.TRADING.ORDERS}/${orderId}`
    );
    if (!response.data) {
      throw new Error('Failed to cancel order - no response data');
    }
    return response.data;
  }

  static async getOrderByCorrelationId(correlationId: string): Promise<DhanOrder> {
    const response = await internalApiClient.get<DhanOrder>(
      `${API_ENDPOINTS.TRADING.ORDERS}/external/${correlationId}`
    );
    if (!response.data) {
      throw new Error('Failed to get order by correlation ID - no response data');
    }
    return response.data;
  }

  static async placeSlicedOrder(orderData: PlaceOrderRequest): Promise<OrderResponse[]> {
    const response = await internalApiClient.post<OrderResponse[]>(
      `${API_ENDPOINTS.TRADING.ORDERS}/slicing`,
      orderData
    );
    return response.data || [];
  }

  // Trade Management Services
  static async getTradeBook(): Promise<DhanTrade[]> {
    const response = await internalApiClient.get<DhanTrade[]>(
      API_ENDPOINTS.TRADING.TRADES_BOOK
    );
    return response.data || [];
  }

  static async getTradesByOrderId(orderId: string): Promise<DhanTrade[]> {
    const response = await internalApiClient.get<DhanTrade[]>(
      `${API_ENDPOINTS.TRADING.TRADES}/${orderId}`
    );
    return response.data || [];
  }
}
