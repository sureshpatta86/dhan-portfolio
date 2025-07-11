'use client';

import { useState } from 'react';
import { usePositions } from '@/features/portfolio/hooks';
import { DhanPosition } from '@/features/portfolio/types';
import { LoadingSkeleton } from '@/lib/components/ui';
import { useToast } from '@/lib/components/ui/ToastProvider';
import { QuickTradeModal } from '@/components/ui/QuickTradeModal';
import { MagnifyingGlassIcon, PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { isActivePosition, calculatePositionMetrics, calculatePortfolioSummary } from '@/features/portfolio/utils';
import type { TransactionType } from '@/features/trading/types';

const PositionCard = ({ position, onTradeAction }: { 
  position: DhanPosition; 
  onTradeAction: (position: DhanPosition, action: 'BUY' | 'SELL' | 'RE_ENTER') => void;
}) => {
  const { totalValue, profitPercentage, isProfit, isActive } = calculatePositionMetrics(position);
  
  // Smart button logic based on position type and status
  const getTradeButtons = () => {
    if (!isActive) {
      // Closed positions - show re-enter button
      return (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onTradeAction(position, 'RE_ENTER')}
            className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Re-enter Position
          </button>
        </div>
      );
    }

    // Active positions - show position management buttons
    if (position.positionType === 'LONG') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
          <button
            onClick={() => onTradeAction(position, 'BUY')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add More
          </button>
          <button
            onClick={() => onTradeAction(position, 'SELL')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <MinusIcon className="w-4 h-4 mr-1" />
            Square Off
          </button>
        </div>
      );
    } else if (position.positionType === 'SHORT') {
      return (
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
          <button
            onClick={() => onTradeAction(position, 'BUY')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Buy to Cover
          </button>
          <button
            onClick={() => onTradeAction(position, 'SELL')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <MinusIcon className="w-4 h-4 mr-1" />
            Sell More
          </button>
        </div>
      );
    }

    return null;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in ${
      isActive 
        ? 'border-green-300 bg-green-50/30 hover:border-green-400 hover:bg-green-50/50' 
        : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {position.tradingSymbol}
            </h3>
            {isActive && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white animate-pulse">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{position.exchangeSegment}</p>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 ${
              position.positionType === 'LONG' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
              position.positionType === 'SHORT' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
              'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}>
              {position.positionType}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all hover:scale-105">
              {position.productType}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold transition-colors ${isProfit ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}>
            ₹{position.unrealizedProfit.toFixed(2)}
          </p>
          <p className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Net Qty</p>
          <p className="font-medium text-gray-900">{position.netQty}</p>
        </div>
        <div>
          <p className="text-gray-600">Avg Buy Price</p>
          <p className="font-medium text-gray-900">₹{position.buyAvg.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Buy Qty</p>
          <p className="font-medium text-gray-900">{position.buyQty}</p>
        </div>
        <div>
          <p className="text-gray-600">Sell Qty</p>
          <p className="font-medium text-gray-900">{position.sellQty}</p>
        </div>
      </div>
      
      {position.realizedProfit !== 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Realized P&L</span>
            <span className={`font-medium ${position.realizedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{position.realizedProfit.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Position Value</span>
          <span className="text-lg font-bold text-gray-900">₹{totalValue.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Day Trading Info */}
      {(position.dayBuyQty > 0 || position.daySellQty > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Day Trading</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Day Buy Qty</p>
              <p className="font-medium text-gray-900">{position.dayBuyQty}</p>
            </div>
            <div>
              <p className="text-gray-600">Day Sell Qty</p>
              <p className="font-medium text-gray-900">{position.daySellQty}</p>
            </div>
            <div>
              <p className="text-gray-600">Day Buy Value</p>
              <p className="font-medium text-gray-900">₹{position.dayBuyValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Day Sell Value</p>
              <p className="font-medium text-gray-900">₹{position.daySellValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Carry Forward Info for F&O */}
      {(position.carryForwardBuyQty > 0 || position.carryForwardSellQty > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Carry Forward</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">CF Buy Qty</p>
              <p className="font-medium text-gray-900">{position.carryForwardBuyQty}</p>
            </div>
            <div>
              <p className="text-gray-600">CF Sell Qty</p>
              <p className="font-medium text-gray-900">{position.carryForwardSellQty}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Derivatives Info */}
      {position.drvExpiryDate && position.drvExpiryDate !== "0001-01-01" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Derivatives Info</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Expiry Date</p>
              <p className="font-medium text-gray-900">{new Date(position.drvExpiryDate).toLocaleDateString()}</p>
            </div>
            {position.drvOptionType && (
              <div>
                <p className="text-gray-600">Option Type</p>
                <p className="font-medium text-gray-900">{position.drvOptionType}</p>
              </div>
            )}
            {position.drvStrikePrice > 0 && (
              <div>
                <p className="text-gray-600">Strike Price</p>
                <p className="font-medium text-gray-900">₹{position.drvStrikePrice}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Trade Actions */}
      {getTradeButtons()}
    </div>
  );
};

const PositionsSummary = ({ positions }: { positions: DhanPosition[] }) => {
  const summary = calculatePortfolioSummary(positions);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Positions Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{summary.totalPositions}</p>
          <p className="text-sm text-gray-600">Total Positions</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${summary.totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{summary.totalUnrealizedPnL.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Unrealized P&L</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${summary.totalRealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{summary.totalRealizedPnL.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Realized P&L</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">₹{summary.totalValue.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Total Value</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600">{summary.activePositions}</p>
          <p className="text-sm text-gray-600">Active Positions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">{summary.closedPositions}</p>
          <p className="text-sm text-gray-600">Closed Positions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600">{summary.longPositions}</p>
          <p className="text-sm text-gray-600">Long Positions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{summary.shortPositions}</p>
          <p className="text-sm text-gray-600">Short Positions</p>
        </div>
      </div>
    </div>
  );
};

export default function Positions() {
  const { data: positions = [], isLoading, error, refetch } = usePositions();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Quick Trade Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<DhanPosition | null>(null);
  const [tradeType, setTradeType] = useState<TransactionType>('BUY');

  // Convert DhanPosition to DhanHolding format for the modal
  const createMockHoldingFromPosition = (position: DhanPosition) => ({
    exchange: position.exchangeSegment.includes('NSE') ? 'NSE' as const : 'BSE' as const,
    tradingSymbol: position.tradingSymbol,
    securityId: position.securityId,
    isin: '', // Not available in position data
    totalQty: Math.abs(position.netQty),
    dpQty: 0,
    t1Qty: 0,
    mtf_t1_qty: 0,
    mtf_qty: 0,
    availableQty: Math.abs(position.netQty),
    collateralQty: 0,
    avgCostPrice: position.positionType === 'LONG' ? position.buyAvg : position.sellAvg,
    lastTradedPrice: position.costPrice,
  });

  // Handle trade actions
  const handleTradeAction = (position: DhanPosition, action: 'BUY' | 'SELL' | 'RE_ENTER') => {
    setSelectedPosition(position);
    
    if (action === 'RE_ENTER') {
      // For closed positions, default to BUY to re-enter
      setTradeType('BUY');
    } else {
      setTradeType(action);
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  const handleOrderPlaced = () => {
    // Refresh positions data after order is placed
    refetch();
    addToast({
      type: 'success',
      title: 'Order Placed',
      message: 'Your order has been placed successfully.',
    });
  };

  // Filter positions based on search term and active filter
  const filteredPositions = positions
    .filter((position: DhanPosition) => {
      const matchesSearch = position.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.exchangeSegment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.positionType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isActive = isActivePosition(position);
      const matchesActiveFilter = showActiveOnly ? isActive : true;
      
      return matchesSearch && matchesActiveFilter;
    });

  const handleRefresh = async () => {
    try {
      await refetch();
      addToast({
        type: 'success',
        title: 'Positions Refreshed',
        message: 'Your positions data has been updated successfully.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh positions data. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        
        {/* Loading skeleton for summary */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <LoadingSkeleton type="cards" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Positions</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to load positions data'}
          </p>
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">No Positions Found</h2>
          <p className="text-blue-600">
            You currently have no open positions in your portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Active Positions</h1>
          <p className="text-gray-600">Your current trading positions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
            />
          </div>
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-4 py-2 rounded-md transition-colors flex items-center whitespace-nowrap ${
              showActiveOnly 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${showActiveOnly ? 'bg-green-300' : 'bg-gray-500'}`}></span>
            {showActiveOnly ? 'Active Only' : 'Show All'}
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <PositionsSummary positions={filteredPositions} />

      {(searchTerm || showActiveOnly) && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredPositions.length} position(s)
          {searchTerm && ` matching "${searchTerm}"`}
          {showActiveOnly && ` (active only)`}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPositions.map((position: DhanPosition, index: number) => (
          <PositionCard 
            key={`${position.securityId}-${position.productType}-${index}`} 
            position={position} 
            onTradeAction={handleTradeAction}
          />
        ))}
      </div>

      {filteredPositions.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
          <p className="text-gray-500">
            No positions match your search for "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}

      {/* Quick Trade Modal */}
      {selectedPosition && (
        <QuickTradeModal
          isOpen={isModalOpen}
          onCloseAction={handleCloseModal}
          holding={createMockHoldingFromPosition(selectedPosition)}
          defaultTransactionType={tradeType}
          onOrderPlacedAction={handleOrderPlaced}
        />
      )}
    </div>
  );
}
