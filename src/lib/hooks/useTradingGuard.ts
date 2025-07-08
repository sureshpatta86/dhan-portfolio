'use client';

import { useTradersControlStore } from '@/store/tradersControl';
import { useToast } from '@/lib/components/ui/ToastProvider';

export interface TradingOperation {
  type: 'BUY' | 'SELL' | 'MODIFY' | 'CANCEL';
  symbol: string;
  quantity: number;
  price?: number;
}

export const useTradingGuard = () => {
  const { killSwitchStatus, settings } = useTradersControlStore();
  const { addToast } = useToast();

  const checkTradingAllowed = (operation?: TradingOperation): boolean => {
    if (killSwitchStatus.isActive) {
      addToast({
        type: 'error',
        title: 'Trading Blocked',
        message: 'Kill switch is active. Trading operations are disabled.',
      });
      return false;
    }

    // Additional checks can be added here
    // For example: market hours, position limits, etc.

    return true;
  };

  const executeTrade = async (
    operation: TradingOperation,
    tradeFunction: () => Promise<any>
  ): Promise<any> => {
    if (!checkTradingAllowed(operation)) {
      throw new Error('Trading operation blocked by kill switch');
    }

    try {
      const result = await tradeFunction();
      
      // Log the trade for monitoring
      console.log('Trade executed:', {
        operation,
        timestamp: new Date().toISOString(),
        killSwitchStatus: killSwitchStatus.isActive
      });

      return result;
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Trade Execution Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      throw error;
    }
  };

  return {
    checkTradingAllowed,
    executeTrade,
    isKillSwitchActive: killSwitchStatus.isActive,
    killSwitchReason: killSwitchStatus.reason,
    dailyLossLimit: settings.dailyLossLimit,
  };
};
