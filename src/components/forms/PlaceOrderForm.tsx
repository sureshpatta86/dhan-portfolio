/**
 * Place Order Form Component
 * 
 * Form for placing new orders with various order types
 */

'use client';

import React, { useState } from 'react';
import { usePlaceOrder, usePlaceSlicedOrder } from '@/features/trading/hooks';
import { DHAN_CONFIG } from '@/lib/config/app';
import type { 
  PlaceOrderRequest, 
  TransactionType, 
  ExchangeSegment, 
  ProductType, 
  OrderType, 
  OrderValidity 
} from '@/features/trading/types';

interface PlaceOrderFormProps {
  onOrderPlaced?: () => void;
}

export const PlaceOrderForm: React.FC<PlaceOrderFormProps> = ({ onOrderPlaced }) => {
  const [orderData, setOrderData] = useState<Partial<PlaceOrderRequest>>({
    dhanClientId: DHAN_CONFIG.publicClientId || '',
    transactionType: 'BUY',
    exchangeSegment: 'NSE_EQ',
    productType: 'INTRADAY',
    orderType: 'MARKET',
    validity: 'DAY',
    quantity: 1,
    disclosedQuantity: 0,
    afterMarketOrder: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const placeOrderMutation = usePlaceOrder();
  const placeSlicedOrderMutation = usePlaceSlicedOrder();

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
            Order functionality requires proper Dhan API configuration.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h4 className="font-medium text-gray-900 mb-2">Required Environment Variables:</h4>
            <code className="text-sm text-gray-700 block space-y-1">
              <div>DHAN_ACCESS_TOKEN=your_token</div>
              <div>NEXT_PUBLIC_DHAN_CLIENT_ID=your_client_id</div>
            </code>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!orderData.dhanClientId) {
      errors.dhanClientId = 'Client ID is required';
    }

    if (!orderData.securityId) {
      errors.securityId = 'Security ID is required';
    }

    if (!orderData.quantity || orderData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') {
      if (!orderData.price || orderData.price <= 0) {
        errors.price = 'Price is required for limit and stop loss orders';
      }
    }

    if (orderData.orderType === 'STOP_LOSS' || orderData.orderType === 'STOP_LOSS_MARKET') {
      if (!orderData.triggerPrice || orderData.triggerPrice <= 0) {
        errors.triggerPrice = 'Trigger price is required for stop loss orders';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isSliced = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isSliced) {
        await placeSlicedOrderMutation.mutateAsync(orderData as PlaceOrderRequest);
      } else {
        await placeOrderMutation.mutateAsync(orderData as PlaceOrderRequest);
      }
      
      // Reset form
      setOrderData({
        dhanClientId: DHAN_CONFIG.publicClientId || '',
        transactionType: 'BUY',
        exchangeSegment: 'NSE_EQ',
        productType: 'INTRADAY',
        orderType: 'MARKET',
        validity: 'DAY',
        quantity: 1,
        disclosedQuantity: 0,
        afterMarketOrder: false,
      });

      setValidationErrors({});
      onOrderPlaced?.();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateOrderData = (field: keyof PlaceOrderRequest, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Place New Order</h3>
        
        {/* Quick Reference Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-green-900 mb-2">📋 Quick Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-green-800 mb-1">Common Security IDs:</p>
              <ul className="text-green-700 space-y-0.5">
                <li>• <strong>TCS</strong> (Tata Consultancy Services): 11536</li>
                <li>• <strong>RELIANCE</strong> (Reliance Industries): 3456</li>
                <li>• <strong>INFY</strong> (Infosys): 4963</li>
                <li>• <strong>HDFCBANK</strong> (HDFC Bank): 1333</li>
                <li>• <strong>SBIN</strong> (State Bank of India): 3045</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-1">Your Client ID:</p>
              <p className="text-green-700">✓ Pre-populated with your default ID ({DHAN_CONFIG.publicClientId})</p>
              <p className="font-medium text-green-800 mb-1 mt-2">Security ID:</p>
              <p className="text-green-700">Use Dhan's instrument master or search for the stock symbol</p>
              <p className="font-medium text-green-800 mb-1 mt-2">💡 Tip:</p>
              <p className="text-green-700">Security IDs remain constant - you can save frequently used ones</p>
            </div>
          </div>
          
          {/* Quick Fill Examples */}
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="font-medium text-green-800 mb-2 text-xs">Quick Fill Examples:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOrderData({
                  dhanClientId: DHAN_CONFIG.publicClientId || '',
                  securityId: '11536',
                  transactionType: 'BUY',
                  exchangeSegment: 'NSE_EQ',
                  productType: 'INTRADAY',
                  orderType: 'LIMIT',
                  validity: 'DAY',
                  quantity: 10,
                  price: 3500,
                  disclosedQuantity: 0,
                  afterMarketOrder: false,
                })}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
              >
                BUY TCS (Limit)
              </button>
              
              <button
                type="button"
                onClick={() => setOrderData({
                  dhanClientId: DHAN_CONFIG.publicClientId || '',
                  securityId: '3456',
                  transactionType: 'BUY',
                  exchangeSegment: 'NSE_EQ',
                  productType: 'CNC',
                  orderType: 'MARKET',
                  validity: 'DAY',
                  quantity: 5,
                  disclosedQuantity: 0,
                  afterMarketOrder: false,
                })}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
              >
                BUY RELIANCE (Market)
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Client ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              value={orderData.dhanClientId || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            {validationErrors.dhanClientId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.dhanClientId}</p>
            )}
          </div>

          {/* Security ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security ID *
            </label>
            <input
              type="text"
              value={orderData.securityId || ''}
              onChange={(e) => updateOrderData('securityId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter security ID (e.g., 11536 for TCS)"
              required
            />
            {validationErrors.securityId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.securityId}</p>
            )}
          </div>

          {/* Transaction Type, Exchange, Product Type */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <select
                value={orderData.transactionType || 'BUY'}
                onChange={(e) => updateOrderData('transactionType', e.target.value as TransactionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exchange *
              </label>
              <select
                value={orderData.exchangeSegment || 'NSE_EQ'}
                onChange={(e) => updateOrderData('exchangeSegment', e.target.value as ExchangeSegment)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="NSE_EQ">NSE EQ</option>
                <option value="BSE_EQ">BSE EQ</option>
                <option value="NSE_FNO">NSE F&O</option>
                <option value="NSE_CURRENCY">NSE Currency</option>
                <option value="MCX_COMM">MCX Commodity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type *
              </label>
              <select
                value={orderData.productType || 'INTRADAY'}
                onChange={(e) => updateOrderData('productType', e.target.value as ProductType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="CNC">CNC</option>
                <option value="INTRADAY">INTRADAY</option>
                <option value="MARGIN">MARGIN</option>
                <option value="MTF">MTF</option>
                <option value="CO">CO</option>
                <option value="BO">BO</option>
              </select>
            </div>
          </div>

          {/* Order Type, Validity, Quantity */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type *
              </label>
              <select
                value={orderData.orderType || 'MARKET'}
                onChange={(e) => updateOrderData('orderType', e.target.value as OrderType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="MARKET">MARKET</option>
                <option value="LIMIT">LIMIT</option>
                <option value="STOP_LOSS">STOP_LOSS</option>
                <option value="STOP_LOSS_MARKET">STOP_LOSS_MARKET</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity *
              </label>
              <select
                value={orderData.validity || 'DAY'}
                onChange={(e) => updateOrderData('validity', e.target.value as OrderValidity)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="DAY">DAY</option>
                <option value="IOC">IOC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                value={orderData.quantity || 1}
                onChange={(e) => updateOrderData('quantity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                required
              />
              {validationErrors.quantity && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
              )}
            </div>
          </div>

          {/* Price and Trigger Price (conditional) */}
          {(orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={orderData.price || ''}
                  onChange={(e) => updateOrderData('price', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price"
                  required
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>
              
              {orderData.orderType === 'STOP_LOSS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderData.triggerPrice || ''}
                    onChange={(e) => updateOrderData('triggerPrice', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter trigger price"
                    required
                  />
                  {validationErrors.triggerPrice && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.triggerPrice}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {orderData.orderType === 'STOP_LOSS_MARKET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={orderData.triggerPrice || ''}
                onChange={(e) => updateOrderData('triggerPrice', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter trigger price"
                required
              />
              {validationErrors.triggerPrice && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.triggerPrice}</p>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={placeOrderMutation.isPending}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={placeSlicedOrderMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {placeSlicedOrderMutation.isPending ? 'Placing Sliced Order...' : 'Place Sliced Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
