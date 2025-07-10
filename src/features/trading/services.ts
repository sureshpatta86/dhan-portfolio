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
  OrderResponse,
  // Super Order types
  PlaceSuperOrderRequest,
  ModifySuperOrderRequest,
  DhanSuperOrder,
  SuperOrderResponse,
  // Forever Order types
  PlaceForeverOrderRequest,
  ModifyForeverOrderRequest,
  DhanForeverOrder,
  ForeverOrderResponse,
  // Option Chain types
  OptionChainRequest,
  OptionChainResponse,
  ExpiryListRequest,
  ExpiryListResponse
} from './types';

export class TradingService {
  static async getFunds(): Promise<DhanFunds> {
    console.log('TradingService.getFunds called');
    console.log('API endpoint:', API_ENDPOINTS.TRADING.FUNDS);
    
    try {
      const response = await internalApiClient.get<{ success: boolean; data: DhanFunds; count: number }>(
        API_ENDPOINTS.TRADING.FUNDS
      );
      
      console.log('TradingService.getFunds response:', response);
      console.log('TradingService.getFunds response.data:', response.data);
      
      // The API returns the data wrapped in a success response
      const apiResponse = response as unknown as { success: boolean; data: DhanFunds; count: number };
      
      const result = apiResponse.data || {
        dhanClientId: '',
        availabelBalance: 0,
        sodLimit: 0,
        collateralAmount: 0,
        receiveableAmount: 0,
        utilizedAmount: 0,
        blockedPayoutAmount: 0,
        withdrawableBalance: 0,
      };
      
      console.log('TradingService.getFunds returning:', result);
      return result;
    } catch (error) {
      console.error('TradingService.getFunds error:', error);
      throw error;
    }
  }

  static async getLedger(fromDate?: string, toDate?: string): Promise<DhanLedger[]> {
    console.log('TradingService.getLedger called with:', { fromDate, toDate });
    
    // Default to last 30 days if no dates provided
    const defaultToDate = new Date().toISOString().split('T')[0];
    const defaultFromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const from = fromDate || defaultFromDate;
    const to = toDate || defaultToDate;
    
    console.log('Making request to:', `${API_ENDPOINTS.TRADING.LEDGER}?from-date=${from}&to-date=${to}`);
    
    const endpoint = `${API_ENDPOINTS.TRADING.LEDGER}?from-date=${from}&to-date=${to}`;
    const response = await internalApiClient.get<{ success: boolean; data: DhanLedger[]; count: number }>(endpoint);
    
    console.log('Ledger response:', response.data);
    
    return response.data?.data || [];
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
    console.log('TradingService.getOrderBook: Starting API call');
    try {
      const response = await internalApiClient.get<{ success: boolean; data: DhanOrder[]; count: number }>(
        API_ENDPOINTS.TRADING.ORDERS
      );
      console.log('TradingService.getOrderBook: Raw response:', response);
      console.log('TradingService.getOrderBook: Response data:', response.data);
      console.log('TradingService.getOrderBook: Extracted data:', response.data?.data);
      console.log('TradingService.getOrderBook: Data length:', response.data?.data?.length);
      
      const result = response.data?.data || [];
      console.log('TradingService.getOrderBook: Returning:', result);
      return result;
    } catch (error) {
      console.error('TradingService.getOrderBook: Error:', error);
      throw error;
    }
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
    const response = await internalApiClient.get<{ success: boolean; data: DhanTrade[]; count: number }>(
      API_ENDPOINTS.TRADING.TRADES_BOOK
    );
    // The API returns { success: true, data: [...trades...], count: number }
    // So we need to extract the data property from the response data
    return response.data?.data || [];
  }

  static async getTradesByOrderId(orderId: string): Promise<DhanTrade[]> {
    const response = await internalApiClient.get<{ success: boolean; data: DhanTrade[]; count: number }>(
      `${API_ENDPOINTS.TRADING.TRADES}/${orderId}`
    );
    return response.data?.data || [];
  }

  // Super Order Management Services
  static async placeSuperOrder(orderData: PlaceSuperOrderRequest): Promise<SuperOrderResponse> {
    const response = await internalApiClient.post<SuperOrderResponse>(
      API_ENDPOINTS.TRADING.SUPER_ORDERS,
      orderData
    );
    if (!response.data) {
      throw new Error('Failed to place super order - no response data');
    }
    return response.data;
  }

  static async modifySuperOrder(modifyData: ModifySuperOrderRequest): Promise<SuperOrderResponse> {
    const response = await internalApiClient.put<SuperOrderResponse>(
      `${API_ENDPOINTS.TRADING.SUPER_ORDERS}/${modifyData.orderId}`,
      modifyData
    );
    if (!response.data) {
      throw new Error('Failed to modify super order - no response data');
    }
    return response.data;
  }

  static async cancelSuperOrder(orderId: string, legName: string = 'ENTRY_LEG'): Promise<SuperOrderResponse> {
    const response = await internalApiClient.delete<SuperOrderResponse>(
      `${API_ENDPOINTS.TRADING.SUPER_ORDERS}/${orderId}/${legName}`
    );
    if (!response.data) {
      throw new Error('Failed to cancel super order - no response data');
    }
    return response.data;
  }

  static async getSuperOrderBook(): Promise<DhanSuperOrder[]> {
    const response = await internalApiClient.get<{ success: boolean; data: DhanSuperOrder[]; count: number }>(
      API_ENDPOINTS.TRADING.SUPER_ORDERS
    );
    return response.data?.data || [];
  }

  // Forever Order Management Services
  static async placeForeverOrder(orderData: PlaceForeverOrderRequest): Promise<ForeverOrderResponse> {
    const response = await internalApiClient.post<ForeverOrderResponse>(
      API_ENDPOINTS.TRADING.FOREVER_ORDERS,
      orderData
    );
    if (!response.data) {
      throw new Error('Failed to place forever order - no response data');
    }
    return response.data;
  }

  static async modifyForeverOrder(modifyData: ModifyForeverOrderRequest): Promise<ForeverOrderResponse> {
    const response = await internalApiClient.put<ForeverOrderResponse>(
      `${API_ENDPOINTS.TRADING.FOREVER_ORDERS}/${modifyData.orderId}`,
      modifyData
    );
    if (!response.data) {
      throw new Error('Failed to modify forever order - no response data');
    }
    return response.data;
  }

  static async cancelForeverOrder(orderId: string): Promise<ForeverOrderResponse> {
    const response = await internalApiClient.delete<ForeverOrderResponse>(
      `${API_ENDPOINTS.TRADING.FOREVER_ORDERS}/${orderId}`
    );
    if (!response.data) {
      throw new Error('Failed to cancel forever order - no response data');
    }
    return response.data;
  }

  static async getForeverOrderBook(): Promise<DhanForeverOrder[]> {
    const response = await internalApiClient.get<{ success: boolean; data: DhanForeverOrder[]; count: number }>(
      API_ENDPOINTS.TRADING.FOREVER_ORDERS
    );
    return response.data?.data || [];
  }

  /**
   * Get Option Chain data for a specific underlying and expiry
   */
  static async getOptionChain(request: OptionChainRequest): Promise<OptionChainResponse> {
    try {
      const response = await internalApiClient.post<OptionChainResponse>('/api/trading/option-chain', request);
      return response.data!;
    } catch (error) {
      console.error('Error fetching option chain:', error);
      throw error;
    }
  }

  /**
   * Get expiry list for a specific underlying
   */
  static async getExpiryList(request: ExpiryListRequest): Promise<ExpiryListResponse> {
    try {
      const response = await internalApiClient.post<ExpiryListResponse>('/api/trading/option-chain/expiry-list', request);
      return response.data!;
    } catch (error) {
      console.error('Error fetching expiry list:', error);
      throw error;
    }
  }
}

// Export standalone functions for convenience
export const getOptionChain = (request: OptionChainRequest) => TradingService.getOptionChain(request);
export const getExpiryList = (request: ExpiryListRequest) => TradingService.getExpiryList(request);
