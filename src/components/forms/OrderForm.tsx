/**
 * Simple Order Form Component
 * 
 * Clean form for placing new orders
 */

'use client';

import React, { useState } from 'react';
import { usePlaceOrder, usePlaceSlicedOrder } from '@/features/trading/hooks';
import type { 
  PlaceOrderRequest, 
  TransactionType, 
  ExchangeSegment, 
  ProductType, 
  OrderType, 
  OrderValidity 
} from '@/features/trading/types';

// Default client ID
const DEFAULT_CLIENT_ID = '1101648848';

interface OrderFormProps {
  onOrderPlaced?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onOrderPlaced }) => {
  const [formData, setFormData] = useState<Partial<PlaceOrderRequest>>({
    dhanClientId: DEFAULT_CLIENT_ID,
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.dhanClientId) {
      errors.dhanClientId = 'Client ID is required';
    }

    if (!formData.securityId) {
      errors.securityId = 'Security ID is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if ((formData.orderType === 'LIMIT' || formData.orderType === 'STOP_LOSS') && 
        (!formData.price || formData.price <= 0)) {
      errors.price = 'Price must be greater than 0 for LIMIT and STOP_LOSS orders';
    }

    if ((formData.orderType === 'STOP_LOSS' || formData.orderType === 'STOP_LOSS_MARKET') && 
        (!formData.triggerPrice || formData.triggerPrice <= 0)) {
      errors.triggerPrice = 'Trigger price must be greater than 0 for stop loss orders';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isSliced = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderRequest = formData as PlaceOrderRequest;
    
    try {
      if (isSliced) {
        await placeSlicedOrderMutation.mutateAsync(orderRequest);
      } else {
        await placeOrderMutation.mutateAsync(orderRequest);
      }
      
      // Reset form
      setFormData({
        dhanClientId: DEFAULT_CLIENT_ID,
        transactionType: 'BUY',
        exchangeSegment: 'NSE_EQ',
        productType: 'INTRADAY',
        orderType: 'MARKET',
        validity: 'DAY',
        quantity: 1,
        disclosedQuantity: 0,
        afterMarketOrder: false,
      });

      onOrderPlaced?.();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateFormData = (field: keyof PlaceOrderRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getOrderTypeHelp = (orderType: OrderType) => {
    switch (orderType) {
      case 'MARKET':
        return '🏃 Order will execute at current market price immediately';
      case 'LIMIT':
        return '🎯 Order will execute only at specified price or better';
      case 'STOP_LOSS':
        return '🛡️ Stop loss with limit price - triggers at trigger price, executes at limit price';
      case 'STOP_LOSS_MARKET':
        return '🛡️ Stop loss market order - triggers at trigger price, executes at market price';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Place New Order</h2>
      </div>

      {/* Quick Reference */}
      <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Quick Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium text-blue-800 mb-1">Common Security IDs:</p>
            <ul className="text-blue-700 space-y-0.5">
              <li>• <strong>TCS</strong>: 11536</li>
              <li>• <strong>RELIANCE</strong>: 3456</li>
              <li>• <strong>INFY</strong>: 4963</li>
              <li>• <strong>HDFCBANK</strong>: 1333</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-blue-800 mb-1">Quick Fill:</p>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  securityId: '11536',
                  quantity: 10,
                  orderType: 'LIMIT',
                  price: 100
                })}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded"
              >
                TCS Example
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="p-6 space-y-6">
        {/* Client ID and Security ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client ID *
            </label>
            <input
              type="text"
              value={formData.dhanClientId || ''}
              onChange={(e) => updateFormData('dhanClientId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.dhanClientId ? 'border-red-500' : 'border-green-300 bg-green-50'
              }`}
              placeholder="e.g., 1101648848"
              required
            />
            {validationErrors.dhanClientId && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.dhanClientId}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security ID *
            </label>
            <input
              type="text"
              value={formData.securityId || ''}
              onChange={(e) => updateFormData('securityId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.securityId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 11536 for TCS"
              required
            />
            {validationErrors.securityId && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.securityId}</p>
            )}
          </div>
        </div>

        {/* Basic Order Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <select
              value={formData.transactionType || 'BUY'}
              onChange={(e) => updateFormData('transactionType', e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exchange *
            </label>
            <select
              value={formData.exchangeSegment || 'NSE_EQ'}
              onChange={(e) => updateFormData('exchangeSegment', e.target.value as ExchangeSegment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NSE_EQ">NSE_EQ</option>
              <option value="NSE_FNO">NSE_FNO</option>
              <option value="BSE_EQ">BSE_EQ</option>
              <option value="BSE_FNO">BSE_FNO</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <select
              value={formData.productType || 'INTRADAY'}
              onChange={(e) => updateFormData('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Order Type and Basic Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type *
            </label>
            <select
              value={formData.orderType || 'MARKET'}
              onChange={(e) => updateFormData('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
              <option value="STOP_LOSS">STOP_LOSS</option>
              <option value="STOP_LOSS_MARKET">STOP_LOSS_MARKET</option>
            </select>
            {formData.orderType && (
              <p className="mt-1 text-xs text-blue-600">
                {getOrderTypeHelp(formData.orderType)}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validity *
            </label>
            <select
              value={formData.validity || 'DAY'}
              onChange={(e) => updateFormData('validity', e.target.value as OrderValidity)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DAY">DAY</option>
              <option value="IOC">IOC</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => updateFormData('quantity', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
              required
            />
            {validationErrors.quantity && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.quantity}</p>
            )}
          </div>
        </div>

        {/* Price fields for non-market orders */}
        {(formData.orderType === 'LIMIT' || formData.orderType === 'STOP_LOSS') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
                required
              />
              {validationErrors.price && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.price}</p>
              )}
            </div>
            
            {formData.orderType === 'STOP_LOSS' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.triggerPrice || ''}
                  onChange={(e) => updateFormData('triggerPrice', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.triggerPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter trigger price"
                  required
                />
                {validationErrors.triggerPrice && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.triggerPrice}</p>
                )}
              </div>
            )}
          </div>
        )}

        {formData.orderType === 'STOP_LOSS_MARKET' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.triggerPrice || ''}
              onChange={(e) => updateFormData('triggerPrice', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.triggerPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter trigger price"
              required
            />
            {validationErrors.triggerPrice && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.triggerPrice}</p>
            )}
          </div>
        )}

        {/* Disclosed Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disclosed Quantity
          </label>
          <input
            type="number"
            value={formData.disclosedQuantity || 0}
            onChange={(e) => updateFormData('disclosedQuantity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="mt-1 text-xs text-gray-600">
            Amount of quantity to disclose to market (0 = full quantity)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={placeOrderMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={placeSlicedOrderMutation.isPending}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {placeSlicedOrderMutation.isPending ? 'Placing Sliced Order...' : 'Place Sliced Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
