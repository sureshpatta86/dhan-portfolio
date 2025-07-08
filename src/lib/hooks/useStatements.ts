import { useState, useEffect } from 'react';
import { useDhanApi } from './useDhanApi';
import type { LedgerEntry, TradeHistoryEntry } from '@/lib/types';

interface UseLedgerOptions {
  fromDate?: string;
  toDate?: string;
  autoFetch?: boolean;
}

export function useLedger({ fromDate, toDate, autoFetch = false }: UseLedgerOptions = {}) {
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = async (from?: string, to?: string) => {
    if (!from || !to) {
      setError('Both from-date and to-date are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/trading/ledger?from-date=${from}&to-date=${to}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ledger data');
      }

      const apiResponse = await response.json();
      // Extract the data array from the API response
      setLedgerData(Array.isArray(apiResponse.data) ? apiResponse.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ledger data');
      setLedgerData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && fromDate && toDate) {
      fetchLedger(fromDate, toDate);
    }
  }, [fromDate, toDate, autoFetch]);

  return {
    ledgerData,
    isLoading,
    error,
    fetchLedger,
    refetch: () => fetchLedger(fromDate, toDate),
  };
}

interface UseTradeHistoryOptions {
  fromDate?: string;
  toDate?: string;
  page?: number;
  autoFetch?: boolean;
}

export function useTradeHistory({ 
  fromDate, 
  toDate, 
  page = 0, 
  autoFetch = false 
}: UseTradeHistoryOptions = {}) {
  const [tradeData, setTradeData] = useState<TradeHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchTrades = async (from?: string, to?: string, pageNum = 0) => {
    if (!from || !to) {
      setError('Both from-date and to-date are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/trading/trades/${from}/${to}/${pageNum}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch trade history');
      }

      const data = await response.json();
      const trades = Array.isArray(data) ? data : [];
      
      setTradeData(trades);
      setCurrentPage(pageNum);
      
      // If we get fewer trades than a typical page size, we might be at the end
      // Note: Dhan API doesn't specify page size, so we'll assume less than 50 means end
      setHasNextPage(trades.length >= 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trade history');
      setTradeData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    if (hasNextPage && fromDate && toDate) {
      fetchTrades(fromDate, toDate, currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && fromDate && toDate) {
      fetchTrades(fromDate, toDate, currentPage - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && fromDate && toDate) {
      fetchTrades(fromDate, toDate, pageNum);
    }
  };

  useEffect(() => {
    if (autoFetch && fromDate && toDate) {
      fetchTrades(fromDate, toDate, page);
    }
  }, [fromDate, toDate, page, autoFetch]);

  return {
    tradeData,
    isLoading,
    error,
    currentPage,
    hasNextPage,
    fetchTrades,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchTrades(fromDate, toDate, currentPage),
  };
}
