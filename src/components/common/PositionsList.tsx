import React from 'react';
import type { DhanPosition } from '@/features/portfolio/types';

interface PositionCardProps {
  position: DhanPosition;
  onConvert?: (position: DhanPosition) => void;
}

export function PositionCard({ position, onConvert }: PositionCardProps) {
  const totalValue = position.netQty * position.costPrice;
  const pnlClass = position.unrealizedProfit >= 0 ? 'text-green-600' : 'text-red-600';
  const positionTypeClass = position.positionType === 'LONG' ? 'text-blue-600' : 'text-orange-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{position.tradingSymbol}</h3>
          <span className={`text-sm font-medium ${positionTypeClass}`}>
            {position.positionType}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">₹{position.costPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Cost Price</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-600">Net Qty</p>
          <p className="font-medium text-gray-900">{position.netQty}</p>
        </div>
        <div>
          <p className="text-gray-600">Product Type</p>
          <p className="font-medium text-gray-900">{position.productType}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Value</p>
          <p className="font-medium text-gray-900">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-gray-600">Unrealized P&L</p>
          <p className={`font-medium ${pnlClass}`}>
            ₹{position.unrealizedProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {onConvert && position.positionType !== 'CLOSED' && position.netQty !== 0 && (
        <button
          onClick={() => onConvert(position)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Convert Position
        </button>
      )}
    </div>
  );
}

interface PositionsListProps {
  positions: DhanPosition[];
  onConvert?: (position: DhanPosition) => void;
  isLoading?: boolean;
}

export function PositionsList({ positions, onConvert, isLoading }: PositionsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Positions Found</h3>
        <p className="text-gray-500">You don't have any open positions currently.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {positions.map((position, index) => (
        <PositionCard
          key={`${position.securityId}-${position.productType}-${index}`}
          position={position}
          onConvert={onConvert}
        />
      ))}
    </div>
  );
}
