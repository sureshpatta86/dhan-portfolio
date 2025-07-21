'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useOptionChain, useExpiryList } from '@/features/trading/hooks';
import { COMMON_UNDERLYINGS, UnderlyingKey, OptionStrike, OptionData } from '@/features/trading/types';
import OptionOrderModal from '@/components/ui/OptionOrderModal';

export default function OptionChain() {
  const [selectedUnderlying, setSelectedUnderlying] = useState<UnderlyingKey>('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [showAllStrikes, setShowAllStrikes] = useState<boolean>(false);
  const [orderModal, setOrderModal] = useState<{
    isOpen: boolean;
    optionData: OptionData | null;
    optionType: 'CE' | 'PE';
    strike: number;
  }>({
    isOpen: false,
    optionData: null,
    optionType: 'CE',
    strike: 0
  });

  const underlying = COMMON_UNDERLYINGS[selectedUnderlying];

  // Fetch expiry list
  const { 
    data: expiryData, 
    isLoading: expiryLoading, 
    error: expiryError
  } = useExpiryList(underlying.scrip, underlying.segment);

  // Set default expiry to first available expiry
  React.useEffect(() => {
    if (expiryData?.data && expiryData.data.length > 0 && !selectedExpiry) {
      setSelectedExpiry(expiryData.data[0]);
    }
  }, [expiryData, selectedExpiry]);

  // Fetch option chain
  const { 
    data: optionChainData, 
    isLoading: chainLoading, 
    error: chainError,
    refetch: refetchChain 
  } = useOptionChain(
    underlying.scrip, 
    underlying.segment, 
    selectedExpiry,
    !!selectedExpiry && selectedExpiry.trim() !== ''
  );

  // Calculate totals for call and put OI
  const optionSummary = useMemo(() => {
    if (!optionChainData?.data?.oc) return { totalCallOI: 0, totalPutOI: 0 };

    let totalCallOI = 0;
    let totalPutOI = 0;

    Object.values(optionChainData.data.oc).forEach(strike => {
      if (strike.ce?.oi) totalCallOI += strike.ce.oi;
      if (strike.pe?.oi) totalPutOI += strike.pe.oi;
    });

    return { totalCallOI, totalPutOI };
  }, [optionChainData]);

  // Process option chain data for table display
  const processedChain = useMemo(() => {
    if (!optionChainData?.data?.oc) return [];

    // Keep both the original string keys and parsed numeric values
    const strikeEntries = Object.keys(optionChainData.data.oc).map(key => ({
      originalKey: key,
      numericValue: parseFloat(key)
    })).sort((a, b) => a.numericValue - b.numericValue);

    const currentPrice = optionChainData.data.last_price;
    
    // Find the ATM strike
    const atTheMoneyEntry = strikeEntries.reduce((prev, curr) => 
      Math.abs(curr.numericValue - currentPrice) < Math.abs(prev.numericValue - currentPrice) ? curr : prev
    );

    let strikesToShow: typeof strikeEntries;

    if (showAllStrikes) {
      // Show all strikes within +/- 15% of current price for expanded view
      const priceRange = currentPrice * 0.15;
      strikesToShow = strikeEntries.filter(entry => 
        Math.abs(entry.numericValue - currentPrice) <= priceRange
      );
      
      // If no relevant strikes found, show a broader range
      if (strikesToShow.length === 0) {
        const centerIndex = strikeEntries.indexOf(atTheMoneyEntry);
        const startIndex = Math.max(0, centerIndex - 15);
        const endIndex = Math.min(strikeEntries.length, centerIndex + 16);
        strikesToShow = strikeEntries.slice(startIndex, endIndex);
      }
    } else {
      // Show only 5 strikes centered around ATM (2 above, ATM, 2 below)
      const atmIndex = strikeEntries.indexOf(atTheMoneyEntry);
      const startIndex = Math.max(0, atmIndex - 2);
      const endIndex = Math.min(strikeEntries.length, startIndex + 5);
      
      // Adjust startIndex if we hit the end of the array
      const adjustedStartIndex = Math.max(0, endIndex - 5);
      strikesToShow = strikeEntries.slice(adjustedStartIndex, endIndex);
    }

    return strikesToShow.map(entry => ({
      strike: entry.numericValue,
      isATM: entry.numericValue === atTheMoneyEntry.numericValue,
      ce: optionChainData.data.oc[entry.originalKey]?.ce,
      pe: optionChainData.data.oc[entry.originalKey]?.pe,
    }));
  }, [optionChainData, showAllStrikes]);

  const handleUnderlyingChange = useCallback((key: UnderlyingKey) => {
    setSelectedUnderlying(key);
    setSelectedExpiry(''); // Reset expiry when underlying changes
  }, []);

  const handleExpiryChange = useCallback((expiry: string) => {
    setSelectedExpiry(expiry);
  }, []);

  const handleBuyOption = useCallback((optionData: OptionData, optionType: 'CE' | 'PE', strike: number) => {
    setOrderModal({
      isOpen: true,
      optionData,
      optionType,
      strike
    });
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setOrderModal({
      isOpen: false,
      optionData: null,
      optionType: 'CE',
      strike: 0
    });
  }, []);

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '-';
    return num.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatVolume = (num: number | undefined): string => {
    if (num === undefined || num === null) return '-';
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Option Chain
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Auto-refresh: Every 60 seconds • Rate limited: 3 seconds between requests
            {!showAllStrikes && processedChain.length > 0 && (
              <span className="ml-2">• Showing 5 ATM strikes ({processedChain[0]?.strike}-{processedChain[processedChain.length-1]?.strike})</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAllStrikes(!showAllStrikes)}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            {showAllStrikes ? `Hide Extra (${processedChain.length - 5})` : `Show All`}
          </button>
          <button
            onClick={() => {
              // Clear any rate limit errors and manually refetch
              refetchChain();
            }}
            disabled={chainLoading || (chainError?.message?.includes('429') || chainError?.message?.includes('rate limit'))}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chainLoading ? 'Refreshing...' : 
             (chainError?.message?.includes('429') || chainError?.message?.includes('rate limit')) ? 'Rate Limited' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Underlying Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="underlying-select">
            Underlying
          </label>
          <select
            id="underlying-select"
            value={selectedUnderlying}
            onChange={(e) => handleUnderlyingChange(e.target.value as UnderlyingKey)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(COMMON_UNDERLYINGS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="expiry-select">
            Expiry
          </label>
          <select
            id="expiry-select"
            value={selectedExpiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            disabled={expiryLoading || !expiryData?.data}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">
              {expiryLoading ? 'Loading...' : 'Select Expiry'}
            </option>
            {expiryData?.data?.map((expiry) => (
              <option key={expiry} value={expiry}>
                {new Date(expiry).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Price Display */}
      {optionChainData?.data?.last_price && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Price */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {underlying.name} Spot Price
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{formatNumber(optionChainData.data.last_price)}
              </p>
            </div>
          </div>

          {/* Total Call OI */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Call OI
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatVolume(optionSummary.totalCallOI)}
              </p>
            </div>
          </div>

          {/* Total Put OI */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Put OI
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatVolume(optionSummary.totalPutOI)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(expiryError || chainError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {chainError?.message?.includes('429') || chainError?.message?.includes('rate limit') 
                  ? 'Rate Limit Reached' 
                  : 'Error Loading Data'}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {chainError?.message?.includes('429') || chainError?.message?.includes('rate limit')
                  ? 'API rate limit exceeded. Data will refresh automatically in 1 minute. Manual refresh is disabled to prevent further rate limit errors.'
                  : (expiryError?.message || chainError?.message || 'An error occurred')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Option Chain Table */}
      {selectedExpiry ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {chainLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading option chain...</p>
            </div>
          ) : processedChain.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Call Option Headers */}
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">OI</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Volume</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">IV</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">LTP</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Bid</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Ask</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Buy</th>
                    
                    {/* Strike Price */}
                    <th className="px-4 py-3 text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider text-center bg-yellow-50 dark:bg-yellow-900/20">Strike</th>
                    
                    {/* Put Option Headers */}
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Buy</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Bid</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Ask</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">LTP</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">IV</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Volume</th>
                    <th className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">OI</th>
                  </tr>
                  <tr className="bg-gray-100">
                    <th colSpan={7} className="px-3 py-2 text-xs font-medium text-green-600 text-center">CALL</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-900 text-center"></th>
                    <th colSpan={7} className="px-3 py-2 text-xs font-medium text-red-600 text-center">PUT</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedChain.map(({ strike, isATM, ce, pe }) => (
                    <tr 
                      key={strike} 
                      className={`${
                        isATM ? 'bg-yellow-50' : ''
                      } hover:bg-gray-50`}
                    >
                      {/* Call Option Data */}
                      <OptionDataCell data={ce} field="oi" type="volume" />
                      <OptionDataCell data={ce} field="volume" type="volume" />
                      <OptionDataCell data={ce} field="implied_volatility" type="percentage" />
                      <OptionDataCell data={ce} field="last_price" type="price" className="font-medium" />
                      <OptionDataCell data={ce} field="top_bid_price" type="price" />
                      <OptionDataCell data={ce} field="top_ask_price" type="price" />
                      
                      {/* Call Buy Button */}
                      <td className="px-2 py-3 text-center">
                        {ce ? (
                          <button
                            onClick={() => handleBuyOption(ce, 'CE', strike)}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                          >
                            Buy
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Strike Price */}
                      <td className={`px-4 py-3 text-sm font-bold text-center ${
                        isATM 
                          ? 'text-yellow-700 bg-yellow-100' 
                          : 'text-gray-900 bg-gray-50'
                      }`}>
                        {formatNumber(strike)}
                      </td>
                      
                      {/* Put Buy Button */}
                      <td className="px-2 py-3 text-center">
                        {pe ? (
                          <button
                            onClick={() => handleBuyOption(pe, 'PE', strike)}
                            className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          >
                            Buy
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Put Option Data */}
                      <OptionDataCell data={pe} field="top_bid_price" type="price" />
                      <OptionDataCell data={pe} field="top_ask_price" type="price" />
                      <OptionDataCell data={pe} field="last_price" type="price" className="font-medium" />
                      <OptionDataCell data={pe} field="implied_volatility" type="percentage" />
                      <OptionDataCell data={pe} field="volume" type="volume" />
                      <OptionDataCell data={pe} field="oi" type="volume" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No option chain data available
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {expiryLoading ? 'Loading expiry dates...' : 'Please select an expiry date to view option chain'}
          </p>
        </div>
      )}
      
      {/* Option Order Modal */}
      <OptionOrderModal
        isOpen={orderModal.isOpen}
        onCloseAction={handleCloseOrderModal}
        optionData={orderModal.optionData}
        optionType={orderModal.optionType}
        strike={orderModal.strike}
        expiry={selectedExpiry}
        underlying={underlying.name}
        onOrderPlacedAction={() => {
          // Optionally refetch option chain data after order placement
          refetchChain();
        }}
      />
    </div>
  );
}

// Helper component for option data cells
interface OptionDataCellProps {
  data: OptionData | undefined;
  field: keyof OptionData;
  type: 'price' | 'volume' | 'percentage';
  className?: string;
}

function OptionDataCell({ data, field, type, className = '' }: OptionDataCellProps) {
  const value = data?.[field];
  
  let formattedValue = '-';
  let hasData = false;
  
  if (value !== undefined && value !== null && value !== 0) {
    hasData = true;
    switch (type) {
      case 'price':
        formattedValue = formatNumber(value as number);
        break;
      case 'volume':
        formattedValue = formatVolume(value as number);
        break;
      case 'percentage':
        formattedValue = `${(value as number).toFixed(2)}%`;
        break;
    }
  }

  return (
    <td className={`px-3 py-3 text-sm text-center ${
      hasData 
        ? 'text-gray-900 font-medium' 
        : 'text-gray-400'
    } ${className}`}>
      {formattedValue}
    </td>
  );
}

// Helper functions (duplicated for component scope)
function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

function formatVolume(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
