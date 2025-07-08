/**
 * Portfolio feature - API services
 */

import { internalApiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { 
  DhanHolding, 
  DhanPosition, 
  ConvertPositionRequest, 
  ConvertPositionResponse 
} from './types';

export class PortfolioService {
  static async getHoldings(): Promise<DhanHolding[]> {
    const response = await internalApiClient.get<DhanHolding[]>(API_ENDPOINTS.PORTFOLIO.HOLDINGS);
    return response.data || [];
  }

  static async getPositions(): Promise<DhanPosition[]> {
    const response = await internalApiClient.get<DhanPosition[]>(API_ENDPOINTS.PORTFOLIO.POSITIONS);
    return response.data || [];
  }

  static async convertPosition(request: ConvertPositionRequest): Promise<ConvertPositionResponse> {
    const response = await internalApiClient.post<ConvertPositionResponse>(
      API_ENDPOINTS.PORTFOLIO.CONVERT_POSITION,
      request
    );
    
    return {
      success: response.success ?? false,
      message: response.message || 'Position conversion completed',
      data: response.data,
    };
  }

  static async getPortfolioSummary(): Promise<any> {
    // This could be a computed endpoint or calculated from holdings/positions
    const [holdings, positions] = await Promise.all([
      this.getHoldings(),
      this.getPositions(),
    ]);

    return {
      totalHoldings: holdings.length,
      activePositions: positions.filter(p => p.positionType !== 'CLOSED').length,
      totalValue: holdings.reduce((sum, h) => sum + (h.totalQty * h.lastTradedPrice), 0),
      totalPnL: positions.reduce((sum, p) => sum + p.unrealizedProfit + p.realizedProfit, 0),
      // Add more calculated metrics
    };
  }
}
