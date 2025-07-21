/**
 * Option Order Modal Component
 * 
 * Modal for placing buy/sell orders on options from option chain
 */

"use client";

import React, { useState, useEffect } from 'react';
import { usePlaceOrder } from '@/features/trading/hooks';
import { DHAN_CONFIG } from '@/lib/config/app';
import { useToast } from '@/lib/components/ui/ToastProvider';
import type { 
  PlaceOrderRequest, 
  TransactionType, 
  ProductType, 
  OrderValidity,
  OptionData 
} from '@/features/trading/types';

type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_MARKET' | 'SUPER_ORDER';
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
  // Use lot size from optionData if available, else fallback
  const getLotSize = (underlying: string) => {
    if (!underlying) return 1;
    if (underlying.toUpperCase().includes('NIFTY')) return 75;
    if (underlying.toUpperCase().includes('BANKNIFTY')) return 15;
    // Add more index/stock mappings as needed
    return 1;
  };
  const lotSize = optionData && 'lot_size' in optionData && optionData.lot_size ? optionData.lot_size : getLotSize(underlying);
  const { addToast } = useToast();
  const placeOrderMutation = usePlaceOrder();

  const [orderData, setOrderData] = useState<Partial<Omit<PlaceOrderRequest, 'orderType'> & { orderType?: OrderType }>>({
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

  // Super Order state
  const [isSuperOrder, setIsSuperOrder] = useState(false);
  const [superOrderFields, setSuperOrderFields] = useState({
    targetPrice: '',
    stopLossPrice: '',
    trailingJump: '',
  });

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
      setIsSuperOrder(false);
      setSuperOrderFields({ targetPrice: '', stopLossPrice: '', trailingJump: '' });
    }
  }, [isOpen, optionData]);

  const handleInputChange = (field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSuperOrderFieldChange = (field: string, value: any) => {
    setSuperOrderFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {

  const handleSuperOrderFieldChange = (field: string, value: any) => {
    setSuperOrderFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
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

    // Super Order validation
    if (isSuperOrder) {
      if (!superOrderFields.targetPrice || parseFloat(superOrderFields.targetPrice) <= 0) {
        errors.targetPrice = 'Target price is required and must be > 0';
      }
      if (!superOrderFields.stopLossPrice || parseFloat(superOrderFields.stopLossPrice) <= 0) {
        errors.stopLossPrice = 'Stop loss price is required and must be > 0';
      }
      if (superOrderFields.trailingJump && parseFloat(superOrderFields.trailingJump) < 0) {
        errors.trailingJump = 'Trailing jump must be >= 0';
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
      if (isSuperOrder) {
        // Super Order API call
        const superOrderPayload = {
          dhanClientId: DHAN_CONFIG.publicClientId || '',
          transactionType: orderData.transactionType,
          exchangeSegment: orderData.exchangeSegment,
          productType: orderData.productType,
          orderType: orderData.orderType,
          securityId: `${underlying}_${strike}${optionType}_${expiry}`,
          quantity: orderData.quantity,
          price: orderData.price,
          targetPrice: parseFloat(superOrderFields.targetPrice),
          stopLossPrice: parseFloat(superOrderFields.stopLossPrice),
          trailingJump: superOrderFields.trailingJump ? parseFloat(superOrderFields.trailingJump) : undefined,
        };
        const res = await fetch('/api/trading/super-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(superOrderPayload),
        });
        if (!res.ok) throw new Error('Super Order API failed');
        addToast({
          title: 'Super Order Placed Successfully',
          message: `${orderData.transactionType} super order for ${underlying} ${strike} ${optionType} placed`,
          type: 'success'
        });
      } else {
        // Regular order
        const orderRequest: PlaceOrderRequest = {
          ...orderData as PlaceOrderRequest,
          securityId: `${underlying}_${strike}${optionType}_${expiry}`,
        };
        await placeOrderMutation.mutateAsync(orderRequest);
        addToast({
          title: 'Order Placed Successfully',
          message: `${orderData.transactionType} order for ${underlying} ${strike} ${optionType} placed`,
          type: 'success'
        });
      }
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isSelling ? 'Sell' : 'Buy'} Option
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-150 rounded-full p-2 bg-gray-100 hover:bg-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Option Info */}
        <div className="bg-gray-50 rounded-lg p-4 m-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">{optionSymbol}</span>
            <span className="text-sm text-gray-600">Expiry: {new Date(expiry).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">LTP: </span>
              <span className="font-medium">₹{optionData.last_price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">IV: </span>
              <span className="font-medium">{(optionData.implied_volatility * 100).toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Bid: </span>
              <span className="font-medium">₹{optionData.top_bid_price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Ask: </span>
              <span className="font-medium">₹{optionData.top_ask_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-8 py-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
            <select
              value={orderData.transactionType}
              onChange={(e) => handleInputChange('transactionType', e.target.value as TransactionType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 transition-shadow duration-150 shadow-sm"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Type</label>
            <select
              value={orderData.productType}
              onChange={(e) => handleInputChange('productType', e.target.value as ProductType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 transition-shadow duration-150 shadow-sm"
            >
              <option value="CNC">CNC (Delivery)</option>
              <option value="INTRADAY">Intraday</option>
              <option value="MARGIN">Margin</option>
            </select>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type</label>
            <select
              value={orderData.orderType}
              onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 transition-shadow duration-150 shadow-sm"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="STOP_LOSS">Stop Loss (SL)</option>
              <option value="STOP_LOSS_MARKET">Stop Loss Market (SL-M)</option>
              <option value="SUPER_ORDER">Super Order</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={orderData.quantity || ''}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 transition-shadow duration-150 shadow-sm ${
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              value={orderData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow duration-150 shadow-sm ${
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trigger Price</label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              value={orderData.triggerPrice || ''}
              onChange={(e) => handleInputChange('triggerPrice', parseFloat(e.target.value))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow duration-150 shadow-sm ${
                validationErrors.triggerPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter trigger price"
            />
              {validationErrors.triggerPrice && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.triggerPrice}</p>
              )}
            </div>
          )}

          {/* Super Order Fields (only if selected) */}
          {orderData.orderType === 'SUPER_ORDER' && (
            <div className="space-y-4 mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Price</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={superOrderFields.targetPrice}
                  onChange={(e) => handleSuperOrderFieldChange('targetPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow duration-150 shadow-sm"
                  placeholder="Enter target price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stop Loss Price</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={superOrderFields.stopLossPrice}
                  onChange={(e) => handleSuperOrderFieldChange('stopLossPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow duration-150 shadow-sm"
                  placeholder="Enter stop loss price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trailing Jump</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={superOrderFields.trailingJump}
                  onChange={(e) => handleSuperOrderFieldChange('trailingJump', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow duration-150 shadow-sm"
                  placeholder="Enter trailing jump (optional)"
                />
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
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
              {orderData.price && (
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>₹{orderData.price.toFixed(2)}</span>
                </div>
              )}
              {typeof orderData.price === 'number' && typeof orderData.quantity === 'number' && (
                <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                  <span>Total Cost:</span>
                  <span>
                    ₹{(Number(orderData.quantity) * Number(lotSize) * Number(orderData.price)).toFixed(2)}
                    <span className="text-xs text-gray-500"> ({orderData.quantity} × {lotSize} × ₹{Number(orderData.price).toFixed(2)})</span>
                    {optionData && typeof optionData.lot_size === 'number' && (
                      <span className="text-xs text-blue-500 ml-2">(Lot size from API: {optionData.lot_size})</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 focus:outline-none transition-colors duration-150 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-800 focus:outline-none transition-colors duration-150 font-semibold"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OptionOrderModal;
