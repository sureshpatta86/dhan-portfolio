/**
 * Option Order Modal Component
 * 
 * Modal for placing buy/sell orders on options from option chain
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePlaceOrder } from '@/features/trading/hooks';
import { DHAN_CONFIG } from '@/lib/config/app';
import { useToast } from '@/lib/components/ui/ToastProvider';
import type { 
  PlaceOrderRequest, 
  TransactionType, 
  ProductType, 
  OrderType, 
  OrderValidity,
  OptionData 
} from '@/features/trading/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface OptionOrderModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  optionData: OptionData | null;
  optionType: 'CE' | 'PE';
  strike: number;
  expiry: string;
  underlying: string;
  onOrderPlacedAction?: () => void;
}

export const OptionOrderModal: React.FC<OptionOrderModalProps> = ({
  isOpen,
  onCloseAction,
  optionData,
  optionType,
  strike,
  expiry,
  underlying,
  onOrderPlacedAction
}) => {
  const { addToast } = useToast();
  const placeOrderMutation = usePlaceOrder();

  const [orderData, setOrderData] = useState<Partial<PlaceOrderRequest>>({
    dhanClientId: DHAN_CONFIG.publicClientId || '',
    transactionType: 'BUY',
    exchangeSegment: 'NSE_FNO', // Options are traded on F&O segment
    productType: 'CNC',
    orderType: 'MARKET',
    validity: 'DAY',
    quantity: 1,
    disclosedQuantity: 0,
    afterMarketOrder: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && optionData) {
      setOrderData({
        dhanClientId: DHAN_CONFIG.publicClientId || '',
        transactionType: 'BUY',
        exchangeSegment: 'NSE_FNO',
        productType: 'CNC',
        orderType: 'MARKET',
        validity: 'DAY',
        quantity: 1,
        price: optionData.last_price, // Set default price to LTP
        disclosedQuantity: 0,
        afterMarketOrder: false,
      });
      setValidationErrors({});
    }
  }, [isOpen, optionData]);

  const handleInputChange = (field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!orderData.quantity || orderData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') {
      if (!orderData.price || orderData.price <= 0) {
        errors.price = 'Price is required for limit/SL orders';
      }
    }

    if (orderData.orderType === 'STOP_LOSS' || orderData.orderType === 'STOP_LOSS_MARKET') {
      if (!orderData.triggerPrice || orderData.triggerPrice <= 0) {
        errors.triggerPrice = 'Trigger price is required for SL orders';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !optionData) {
      return;
    }

    try {
      const orderRequest: PlaceOrderRequest = {
        ...orderData as PlaceOrderRequest,
        // Note: In a real implementation, you would need the actual securityId for the option
        // This is a placeholder - you'd need to map strike + expiry + type to actual security ID
        securityId: `${underlying}_${strike}${optionType}_${expiry}`, 
      };

      await placeOrderMutation.mutateAsync(orderRequest);
      
      addToast({
        title: 'Order Placed Successfully',
        message: `${orderData.transactionType} order for ${underlying} ${strike} ${optionType} placed`,
        type: 'success'
      });

      onOrderPlacedAction?.();
      onCloseAction();
    } catch (error: any) {
      addToast({
        title: 'Order Failed',
        message: error.message || 'Failed to place order',
        type: 'error'
      });
    }
  };

  if (!isOpen || !optionData) return null;

  const isSelling = orderData.transactionType === 'SELL';
  const optionSymbol = `${underlying} ${strike} ${optionType}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isSelling ? 'Sell' : 'Buy'} Option
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Option Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 m-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900 dark:text-white">{optionSymbol}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Expiry: {new Date(expiry).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">LTP: </span>
              <span className="font-medium">₹{optionData.last_price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">IV: </span>
              <span className="font-medium">{(optionData.implied_volatility * 100).toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Bid: </span>
              <span className="font-medium">₹{optionData.top_bid_price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Ask: </span>
              <span className="font-medium">₹{optionData.top_ask_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type
            </label>
            <select
              value={orderData.transactionType}
              onChange={(e) => handleInputChange('transactionType', e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Type
            </label>
            <select
              value={orderData.productType}
              onChange={(e) => handleInputChange('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="CNC">CNC (Delivery)</option>
              <option value="INTRADAY">Intraday</option>
              <option value="MARGIN">Margin</option>
            </select>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Type
            </label>
            <select
              value={orderData.orderType}
              onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="STOP_LOSS">Stop Loss (SL)</option>
              <option value="STOP_LOSS_MARKET">Stop Loss Market (SL-M)</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={orderData.quantity || ''}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                validationErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter quantity"
            />
            {validationErrors.quantity && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.quantity}</p>
            )}
          </div>

          {/* Price (for Limit orders) */}
          {(orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={orderData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
              />
              {validationErrors.price && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>
              )}
            </div>
          )}

          {/* Trigger Price (for SL orders) */}
          {(orderData.orderType === 'STOP_LOSS' || orderData.orderType === 'STOP_LOSS_MARKET') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trigger Price
              </label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={orderData.triggerPrice || ''}
                onChange={(e) => handleInputChange('triggerPrice', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  validationErrors.triggerPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter trigger price"
              />
              {validationErrors.triggerPrice && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.triggerPrice}</p>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Option:</span>
                <span>{optionSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{orderData.quantity} lots</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{orderData.orderType}</span>
              </div>
              {(orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') && orderData.price && (
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>₹{orderData.price.toFixed(2)}</span>
                </div>
              )}
              {(orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') && orderData.price && (
                <div className="flex justify-between font-medium border-t border-blue-200 dark:border-blue-700 pt-1">
                  <span>Est. Total:</span>
                  <span>₹{(orderData.quantity! * orderData.price).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCloseAction}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={placeOrderMutation.isPending}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelling 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              {placeOrderMutation.isPending 
                ? 'Placing...' 
                : `${isSelling ? 'Sell' : 'Buy'} Option`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OptionOrderModal;
