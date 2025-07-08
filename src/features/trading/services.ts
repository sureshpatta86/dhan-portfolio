/**
 * Trading feature - API services
 */

import { internalApiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { DhanFunds, DhanLedger } from './types';

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
}
