/**
 * Trading Trades Page - Trade Book
 */

'use client';

import React from 'react';
import { useTradeBook } from '@/features/trading/hooks';
import { LoadingSpinner, LoadingSkeleton } from '@/lib/components/ui/LoadingStates';
import type { DhanTrade } from '@/features/trading/types';

// Error Message Component
const ErrorMessage: React.FC<{ title: string; message: string; error?: any }> = ({ 
  title, 
  message 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trade Status Badge Component
const TradeStatusBadge: React.FC<{ type: string }> = ({ type }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
      {type}
    </span>
  );
};

// Trade Item Component
const TradeItem: React.FC<{ trade: DhanTrade }> = ({ trade }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TradeStatusBadge type={trade.transactionType} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{trade.tradingSymbol}</h3>
            <p className="text-sm text-gray-500">Security ID: {trade.securityId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            ₹{trade.tradedPrice.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-500">{trade.productType}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Quantity</p>
          <p className="text-lg font-semibold text-gray-900">{trade.tradedQuantity}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Exchange</p>
          <p className="text-lg font-semibold text-gray-900">{trade.exchangeSegment}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Order Type</p>
          <p className="text-lg font-semibold text-gray-900">{trade.orderType}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Trade Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(trade.exchangeTime).toLocaleTimeString('en-IN')}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Order ID: {trade.orderId}</span>
          <span>Exchange Order ID: {trade.exchangeOrderId}</span>
          <span>Trade ID: {trade.exchangeTradeId}</span>
        </div>
      </div>

      {(trade.drvExpiryDate || trade.drvOptionType || trade.drvStrikePrice) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {trade.drvExpiryDate && (
              <div>
                <p className="font-medium text-gray-700">Expiry Date</p>
                <p className="text-gray-900">{trade.drvExpiryDate}</p>
              </div>
            )}
            {trade.drvOptionType && (
              <div>
                <p className="font-medium text-gray-700">Option Type</p>
                <p className="text-gray-900">{trade.drvOptionType}</p>
              </div>
            )}
            {trade.drvStrikePrice && (
              <div>
                <p className="font-medium text-gray-700">Strike Price</p>
                <p className="text-gray-900">₹{trade.drvStrikePrice}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TradingTradesPage() {
  const { data: trades = [], isLoading, error } = useTradeBook();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trade Book</h1>
          <p className="text-gray-600 mt-2">Your executed trades and transaction history</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your trade book...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trade Book</h1>
          <p className="text-gray-600 mt-2">Your executed trades and transaction history</p>
        </div>
        <ErrorMessage
          title="Failed to load trade book"
          message="Unable to fetch your trade history. Please try again."
          error={error}
        />
      </div>
    );
  }

  // Calculate total trade value and count
  const totalTradeValue = trades.reduce((sum, trade) => 
    sum + (trade.tradedQuantity * trade.tradedPrice), 0
  );
  const buyTrades = trades.filter(trade => trade.transactionType === 'BUY');
  const sellTrades = trades.filter(trade => trade.transactionType === 'SELL');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trade Book</h1>
        <p className="text-gray-600 mt-2">Your executed trades and transaction history</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700">Total Trades</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{trades.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700">Buy Orders</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{buyTrades.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700">Sell Orders</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{sellTrades.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700">Total Value</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{totalTradeValue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Trades List */}
      {trades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
          <p className="text-gray-600">
            Your executed trades will appear here once you start trading.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {trades.map((trade, index) => (
            <TradeItem key={`${trade.exchangeTradeId}-${index}`} trade={trade} />
          ))}
        </div>
      )}
    </div>
  );
}
