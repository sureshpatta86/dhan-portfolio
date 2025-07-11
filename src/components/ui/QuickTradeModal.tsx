/**
 * Quick Trade Modal Component
 * 
 * Modal for quickly placing buy/sell orders from holdings page
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
  OrderValidity 
} from '@/features/trading/types';
import type { DhanHolding } from '@/features/portfolio/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QuickTradeModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  holding: DhanHolding;
  defaultTransactionType: TransactionType;
  onOrderPlacedAction?: () => void;
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({
  isOpen,
  onCloseAction,
  holding,
  defaultTransactionType,
  onOrderPlacedAction
}) => {
  const { addToast } = useToast();
  const placeOrderMutation = usePlaceOrder();

  const [orderData, setOrderData] = useState<Partial<PlaceOrderRequest>>({
    dhanClientId: DHAN_CONFIG.publicClientId || '',
    transactionType: defaultTransactionType,
    exchangeSegment: holding.exchange as any,
    productType: 'CNC',
    orderType: 'MARKET',
    validity: 'DAY',
    securityId: holding.securityId,
    quantity: defaultTransactionType === 'SELL' ? holding.availableQty : 1,
    disclosedQuantity: 0,
    afterMarketOrder: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or transaction type changes
  useEffect(() => {
    if (isOpen) {
      setOrderData({
        dhanClientId: DHAN_CONFIG.publicClientId || '',
        transactionType: defaultTransactionType,
        exchangeSegment: holding.exchange as any,
        productType: 'CNC',
        orderType: 'MARKET',
        validity: 'DAY',
        securityId: holding.securityId,
        quantity: defaultTransactionType === 'SELL' ? holding.availableQty : 1,
        disclosedQuantity: 0,
        afterMarketOrder: false,
      });
      setValidationErrors({});
    }
  }, [isOpen, defaultTransactionType, holding]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!orderData.quantity || orderData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (defaultTransactionType === 'SELL' && orderData.quantity! > holding.availableQty) {
      errors.quantity = `Cannot sell more than available quantity (${holding.availableQty})`;
    }

    if (orderData.orderType === 'LIMIT') {
      if (!orderData.price || orderData.price <= 0) {
        errors.price = 'Price is required for limit orders';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await placeOrderMutation.mutateAsync(orderData as PlaceOrderRequest);
      
      addToast({
        type: 'success',
        title: 'Order Placed Successfully',
        message: `${defaultTransactionType} order for ${orderData.quantity} shares of ${holding.tradingSymbol} has been placed. Order ID: ${result.orderId}`,
      });

      onOrderPlacedAction?.();
      onCloseAction();
    } catch (error) {
      console.error('Failed to place order:', error);
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: error instanceof Error ? error.message : 'Failed to place order. Please try again.',
      });
    }
  };

  const handleInputChange = (field: keyof PlaceOrderRequest, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const isSelling = defaultTransactionType === 'SELL';
  const modalTitle = isSelling ? `Sell ${holding.tradingSymbol}` : `Buy More ${holding.tradingSymbol}`;
  const submitButtonText = isSelling ? 'Place Sell Order' : 'Place Buy Order';
  const submitButtonColor = isSelling ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Holding Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{holding.tradingSymbol}</span>
            <span className="text-sm text-gray-600">{holding.exchange}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Avg Price: </span>
              <span className="font-medium">₹{holding.avgCostPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Available: </span>
              <span className="font-medium">{holding.availableQty}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              value={orderData.productType}
              onChange={(e) => handleInputChange('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CNC">CNC (Delivery)</option>
              <option value="INTRADAY">Intraday</option>
              <option value="MARGIN">Margin</option>
            </select>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              value={orderData.orderType}
              onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
              {isSelling && (
                <span className="text-xs text-gray-500 ml-1">
                  (Max: {holding.availableQty})
                </span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max={isSelling ? holding.availableQty : undefined}
              value={orderData.quantity || ''}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter quantity"
            />
            {validationErrors.quantity && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.quantity}</p>
            )}
          </div>

          {/* Price (for limit orders) */}
          {orderData.orderType === 'LIMIT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={orderData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
              />
              {validationErrors.price && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>
              )}
            </div>
          )}

          {/* Order Summary */}
          {orderData.quantity && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{orderData.quantity} shares</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{orderData.orderType}</span>
                </div>
                {orderData.orderType === 'LIMIT' && orderData.price && (
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>₹{orderData.price.toFixed(2)}</span>
                  </div>
                )}
                {orderData.orderType === 'LIMIT' && orderData.price && (
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Est. Total:</span>
                    <span>₹{(orderData.quantity * orderData.price).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCloseAction}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={placeOrderMutation.isPending}
              className={`flex-1 px-4 py-2 text-white rounded-md transition-colors ${submitButtonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {placeOrderMutation.isPending ? 'Placing...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
