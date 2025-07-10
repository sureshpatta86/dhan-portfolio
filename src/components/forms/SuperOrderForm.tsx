/**
 * Super Order Form Component
 * 
 * Provides a form interface for placing super orders with entry, target, and stop loss legs
 */

'use client';

import React, { useState } from 'react';
import { usePlaceSuperOrder } from '@/features/trading/hooks';
import { DHAN_CONFIG } from '@/lib/config/app';
import type { 
  PlaceSuperOrderRequest, 
  TransactionType, 
  ExchangeSegment, 
  ProductType, 
  OrderType 
} from '@/features/trading/types';

interface SuperOrderFormProps {
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export const SuperOrderForm: React.FC<SuperOrderFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<PlaceSuperOrderRequest>({
    dhanClientId: DHAN_CONFIG.publicClientId || '',
    transactionType: 'BUY' as TransactionType,
    exchangeSegment: 'NSE_EQ' as ExchangeSegment,
    productType: 'CNC' as ProductType,
    orderType: 'LIMIT' as OrderType,
    securityId: '',
    quantity: 1,
    price: 0,
    targetPrice: 0,
    stopLossPrice: 0,
    trailingJump: 0,
    correlationId: `super_${Date.now()}`,
  });

  const placeSuperOrderMutation = usePlaceSuperOrder();

  // Show a message if client ID is not configured
  if (!DHAN_CONFIG.publicClientId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Configuration Required</h3>
          <p className="text-gray-600 mb-4">
            Super Order functionality requires proper Dhan API configuration.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h4 className="font-medium text-gray-900 mb-2">Required Environment Variables:</h4>
            <code className="text-sm text-gray-700 block space-y-1">
              <div>DHAN_ACCESS_TOKEN=your_token</div>
              <div>DHAN_CLIENT_ID=your_client_id</div>
            </code>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof PlaceSuperOrderRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await placeSuperOrderMutation.mutateAsync(formData);
      if (onSuccess) {
        onSuccess(result.orderId);
      }
    } catch (error) {
      console.error('Failed to place super order:', error);
    }
  };

  const calculateProfitLoss = () => {
    const { price, targetPrice, stopLossPrice, quantity } = formData;
    if (!price || !targetPrice || !stopLossPrice || !quantity) return { profit: 0, loss: 0 };
    
    const profit = (targetPrice - price) * quantity;
    const loss = (price - stopLossPrice) * quantity;
    return { profit, loss };
  };

  const { profit, loss } = calculateProfitLoss();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Place Super Order</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security ID
            </label>
            <input
              type="text"
              required
              value={formData.securityId}
              onChange={(e) => handleInputChange('securityId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter security ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={formData.transactionType}
              onChange={(e) => handleInputChange('transactionType', e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exchange Segment
            </label>
            <select
              value={formData.exchangeSegment}
              onChange={(e) => handleInputChange('exchangeSegment', e.target.value as ExchangeSegment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NSE_EQ">NSE Equity</option>
              <option value="NSE_FNO">NSE F&O</option>
              <option value="BSE_EQ">BSE Equity</option>
              <option value="BSE_FNO">BSE F&O</option>
              <option value="MCX_COMM">MCX Commodity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              value={formData.productType}
              onChange={(e) => handleInputChange('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CNC">CNC</option>
              <option value="INTRADAY">Intraday</option>
              <option value="MARGIN">Margin</option>
              <option value="MTF">MTF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              value={formData.orderType}
              onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LIMIT">Limit</option>
              <option value="MARKET">Market</option>
            </select>
          </div>
        </div>

        {/* Price Configuration */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.stopLossPrice}
                onChange={(e) => handleInputChange('stopLossPrice', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trailing Jump
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.trailingJump}
                onChange={(e) => handleInputChange('trailingJump', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Profit/Loss Preview */}
        {(profit > 0 || loss > 0) && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">P&L Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-600 text-sm font-medium">Potential Profit</div>
                  <div className="ml-auto text-green-800 font-semibold">
                    ₹{profit.toFixed(2)}
                  </div>
                </div>
                <div className="text-green-600 text-xs mt-1">
                  If target price is achieved
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-600 text-sm font-medium">Potential Loss</div>
                  <div className="ml-auto text-red-800 font-semibold">
                    ₹{loss.toFixed(2)}
                  </div>
                </div>
                <div className="text-red-600 text-xs mt-1">
                  If stop loss is triggered
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={placeSuperOrderMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {placeSuperOrderMutation.isPending ? 'Placing Order...' : 'Place Super Order'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {placeSuperOrderMutation.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 text-sm">
            {placeSuperOrderMutation.error instanceof Error 
              ? placeSuperOrderMutation.error.message 
              : 'An error occurred while placing the super order'}
          </div>
        </div>
      )}
    </div>
  );
};
