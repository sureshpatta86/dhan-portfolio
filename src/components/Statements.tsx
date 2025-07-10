import React, { useState } from 'react';
import { useLedger } from '@/lib/hooks/useStatements';
import { useTradeHistory } from '@/lib/hooks';
import { LoadingSpinner } from '@/lib/components/ui/LoadingStates';
import type { LedgerEntry, TradeHistoryEntry } from '@/lib/types';

interface DateRangeProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onFetch: () => void;
  isLoading?: boolean;
}

function DateRangeSelector({ 
  fromDate, 
  toDate, 
  onFromDateChange, 
  onToDateChange, 
  onFetch,
  isLoading = false 
}: DateRangeProps) {
  // Get today's date for max validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-[140px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          max={today}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          max={today}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={onFetch}
        disabled={isLoading || !fromDate || !toDate}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
}

interface LedgerTableProps {
  data: LedgerEntry[];
  isLoading: boolean;
  error: string | null;
}

function LedgerTable({ data, isLoading, error }: LedgerTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Loading ledger data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No ledger entries found for the selected date range.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Voucher
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exchange
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Debit
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Credit
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((entry, index) => (
            <tr key={`${entry.vouchernumber}-${index}`} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {entry.voucherdate}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <div>
                  <div className="font-medium">{entry.narration}</div>
                  <div className="text-gray-500 text-xs">{entry.voucherdesc}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {entry.vouchernumber}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {entry.exchange}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                {entry.debit !== "0.00" && (
                  <span className="text-red-600 font-medium">
                    ₹{parseFloat(entry.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                {entry.credit !== "0.00" && (
                  <span className="text-green-600 font-medium">
                    ₹{parseFloat(entry.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                ₹{parseFloat(entry.runbal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TradeTableProps {
  data: TradeHistoryEntry[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

function TradeTable({ 
  data, 
  isLoading, 
  error, 
  currentPage, 
  hasNextPage, 
  onPrevPage, 
  onNextPage 
}: TradeTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Loading trade history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No trades found for the selected date range.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date/Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charges
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((trade, index) => (
              <tr key={`${trade.orderId}-${trade.exchangeTradeId}-${index}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{trade.exchangeTime}</div>
                    <div className="text-gray-500 text-xs">{trade.exchangeSegment}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{trade.customSymbol}</div>
                    <div className="text-gray-500 text-xs">{trade.tradingSymbol}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      trade.transactionType === 'BUY' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.transactionType}
                    </span>
                    <div className="text-gray-500 text-xs mt-1">{trade.productType}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  {trade.tradedQuantity.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  ₹{trade.tradedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  ₹{(trade.tradedQuantity * trade.tradedPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="text-xs">
                    <div>Brokerage: ₹{trade.brokerageCharges.toFixed(2)}</div>
                    <div>STT: ₹{trade.stt.toFixed(2)}</div>
                    <div>Others: ₹{(trade.sebiTax + trade.serviceTax + trade.exchangeTransactionCharges + trade.stampDuty).toFixed(2)}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage + 1}</span>
              {data.length > 0 && (
                <span> - Showing {data.length} trades</span>
              )}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={onNextPage}
                disabled={!hasNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Statements() {
  // Get default dates
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [activeTab, setActiveTab] = useState<'ledger' | 'trades'>('ledger');
  const [ledgerFromDate, setLedgerFromDate] = useState(thirtyDaysAgo);
  const [ledgerToDate, setLedgerToDate] = useState(today);
  const [tradesFromDate, setTradesFromDate] = useState(thirtyDaysAgo);
  const [tradesToDate, setTradesToDate] = useState(today);

  const {
    ledgerData,
    isLoading: ledgerLoading,
    error: ledgerError,
    fetchLedger,
    refetch,
  } = useLedger({ fromDate: ledgerFromDate, toDate: ledgerToDate, autoFetch: true });

  const {
    tradeData,
    isLoading: tradesLoading,
    error: tradesError,
    currentPage,
    hasNextPage,
    fetchTrades,
    nextPage,
    prevPage,
  } = useTradeHistory();

  const handleLedgerFetch = () => {
    // Refetch with current date parameters
    fetchLedger();
  };

  const handleTradesFetch = () => {
    if (tradesFromDate && tradesToDate) {
      fetchTrades(tradesFromDate, tradesToDate, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Statements</h1>
        <p className="text-gray-600">View your account ledger and trade history</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ledger'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Account Ledger
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trade History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ledger' && (
        <div>
          <DateRangeSelector
            fromDate={ledgerFromDate}
            toDate={ledgerToDate}
            onFromDateChange={setLedgerFromDate}
            onToDateChange={setLedgerToDate}
            onFetch={handleLedgerFetch}
            isLoading={ledgerLoading}
          />
          <div className="bg-white rounded-lg shadow">
            <LedgerTable
              data={ledgerData || []}
              isLoading={ledgerLoading}
              error={ledgerError || null}
            />
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <div>
          <DateRangeSelector
            fromDate={tradesFromDate}
            toDate={tradesToDate}
            onFromDateChange={setTradesFromDate}
            onToDateChange={setTradesToDate}
            onFetch={handleTradesFetch}
            isLoading={tradesLoading}
          />
          <div className="bg-white rounded-lg shadow">
            <TradeTable
              data={tradeData}
              isLoading={tradesLoading}
              error={tradesError}
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              onPrevPage={prevPage}
              onNextPage={nextPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
