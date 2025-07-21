'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useOptionChain, useExpiryList } from '@/features/trading/hooks';
import { COMMON_UNDERLYINGS, UnderlyingKey, OptionStrike, OptionData } from '@/features/trading/types';
import MarketStatusIndicator from '@/components/features/market/MarketStatusIndicator';

export default function OptionChainAdvanced() {
  const [selectedUnderlying, setSelectedUnderlying] = useState<UnderlyingKey>('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [filterATM, setFilterATM] = useState(false);
  const [atmRange, setAtmRange] = useState(10); // Number of strikes to show around ATM

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
    !!selectedExpiry
  );

  // Process option chain data for table display
  const processedChain = useMemo(() => {
    if (!optionChainData?.data?.oc) return [];

    const strikes = Object.keys(optionChainData.data.oc)
      .map(strike => parseFloat(strike))
      .sort((a, b) => a - b);

    const currentPrice = optionChainData.data.last_price;
    const atTheMoneyStrike = strikes.reduce((prev, curr) => 
      Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev
    );

    let filteredStrikes = strikes;
    
    if (filterATM) {
      const atmIndex = strikes.indexOf(atTheMoneyStrike);
      const startIndex = Math.max(0, atmIndex - atmRange);
      const endIndex = Math.min(strikes.length, atmIndex + atmRange + 1);
      filteredStrikes = strikes.slice(startIndex, endIndex);
    }

    return filteredStrikes.map(strike => ({
      strike: strike,
      isATM: strike === atTheMoneyStrike,
      isITM: {
        call: strike < currentPrice,
        put: strike > currentPrice
      },
      ce: optionChainData.data.oc[strike.toString()]?.ce,
      pe: optionChainData.data.oc[strike.toString()]?.pe,
    }));
  }, [optionChainData, filterATM, atmRange]);

  // Calculate total call and put OI
  const totalOI = useMemo(() => {
    if (!processedChain.length) return { call: 0, put: 0 };
    
    return processedChain.reduce(
      (acc, item) => ({
        call: acc.call + (item.ce?.oi || 0),
        put: acc.put + (item.pe?.oi || 0),
      }),
      { call: 0, put: 0 }
    );
  }, [processedChain]);

  const handleUnderlyingChange = useCallback((key: UnderlyingKey) => {
    setSelectedUnderlying(key);
    setSelectedExpiry(''); // Reset expiry when underlying changes
  }, []);

  const handleExpiryChange = useCallback((expiry: string) => {
    setSelectedExpiry(expiry);
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

  const formatGreek = (num: number | undefined): string => {
    if (num === undefined || num === null) return '-';
    return num.toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Option Chain
        </h2>
        <div className="flex items-center space-x-4">
          <MarketStatusIndicator compact={true} showDetails={false} />
          <button
            onClick={() => refetchChain()}
            disabled={chainLoading}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 disabled:opacity-50"
          >
            {chainLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Auto-refresh: 5s
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Underlying Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Underlying
          </label>
          <select
            value={selectedUnderlying}
            onChange={(e) => handleUnderlyingChange(e.target.value as UnderlyingKey)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expiry
          </label>
          <select
            value={selectedExpiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            disabled={expiryLoading || !expiryData?.data}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
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

        {/* ATM Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="atm-filter"
              checked={filterATM}
              onChange={(e) => setFilterATM(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="atm-filter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show ATM only
            </label>
          </div>
        </div>

        {/* ATM Range */}
        {filterATM && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ATM Range: ±{atmRange}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={atmRange}
              onChange={(e) => setAtmRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        )}
      </div>

      {/* Market Summary */}
      {optionChainData?.data?.last_price && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Call OI
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatVolume(totalOI.call)}
              </p>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Put OI
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatVolume(totalOI.put)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(expiryError || chainError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            {expiryError?.message || chainError?.message || 'An error occurred'}
          </p>
        </div>
      )}

      {/* Option Chain Table */}
      {selectedExpiry && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {chainLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading option chain...</p>
            </div>
          ) : processedChain.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {/* Call Option Headers */}
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">OI</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Volume</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">IV%</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">LTP</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Bid</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Ask</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Delta</th>
                    
                    {/* Strike Price */}
                    <th className="px-4 py-3 text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider text-center bg-yellow-50 dark:bg-yellow-900/20">Strike</th>
                    
                    {/* Put Option Headers */}
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Delta</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Bid</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Ask</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">LTP</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">IV%</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Volume</th>
                    <th className="px-2 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">OI</th>
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th colSpan={7} className="px-3 py-2 text-xs font-medium text-green-600 dark:text-green-400 text-center">CALL</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-900 dark:text-white text-center"></th>
                    <th colSpan={7} className="px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 text-center">PUT</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {processedChain.map(({ strike, isATM, isITM, ce, pe }) => (
                    <tr 
                      key={strike} 
                      className={`${
                        isATM ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                      } hover:bg-gray-50 dark:hover:bg-gray-700`}
                    >
                      {/* Call Option Data */}
                      <OptionDataCell data={ce} field="oi" type="volume" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      <OptionDataCell data={ce} field="volume" type="volume" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      <OptionDataCell data={ce} field="implied_volatility" type="percentage" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      <OptionDataCell data={ce} field="last_price" type="price" className={`font-medium ${isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''}`} />
                      <OptionDataCell data={ce} field="top_bid_price" type="price" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      <OptionDataCell data={ce} field="top_ask_price" type="price" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      <OptionDataCell data={ce} field="greeks" type="greek" subField="delta" className={isITM.call ? 'bg-green-50 dark:bg-green-900/10' : ''} />
                      
                      {/* Strike Price */}
                      <td className={`px-4 py-3 text-sm font-bold text-center ${
                        isATM 
                          ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30' 
                          : 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700'
                      }`}>
                        {formatNumber(strike)}
                      </td>
                      
                      {/* Put Option Data */}
                      <OptionDataCell data={pe} field="greeks" type="greek" subField="delta" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
                      <OptionDataCell data={pe} field="top_bid_price" type="price" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
                      <OptionDataCell data={pe} field="top_ask_price" type="price" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
                      <OptionDataCell data={pe} field="last_price" type="price" className={`font-medium ${isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''}`} />
                      <OptionDataCell data={pe} field="implied_volatility" type="percentage" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
                      <OptionDataCell data={pe} field="volume" type="volume" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
                      <OptionDataCell data={pe} field="oi" type="volume" className={isITM.put ? 'bg-red-50 dark:bg-red-900/10' : ''} />
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
      )}
    </div>
  );
}

// Helper component for option data cells
interface OptionDataCellProps {
  data: OptionData | undefined;
  field: keyof OptionData | 'greeks';
  type: 'price' | 'volume' | 'percentage' | 'greek';
  subField?: string;
  className?: string;
}

function OptionDataCell({ data, field, type, subField, className = '' }: OptionDataCellProps) {
  let value: any;
  
  if (field === 'greeks' && subField && data?.greeks) {
    value = (data.greeks as any)[subField];
  } else if (field !== 'greeks') {
    value = data?.[field];
  }
  
  let formattedValue = '-';
  if (value !== undefined && value !== null) {
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
      case 'greek':
        formattedValue = formatGreek(value as number);
        break;
    }
  }

  return (
    <td className={`px-2 py-3 text-xs text-center text-gray-900 dark:text-gray-100 ${className}`}>
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

function formatGreek(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return num.toFixed(4);
}
