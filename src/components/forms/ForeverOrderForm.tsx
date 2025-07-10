/**
 * Forever Order Form Component
 * 
 * Form for placing new forever orders (Single and OCO types)
 */

'use client';

import React, { useState } from 'react';
import { usePlaceForeverOrder } from '@/features/trading/hooks';
import type { 
  PlaceForeverOrderRequest, 
  TransactionType, 
  ExchangeSegment, 
  ProductType, 
  OrderType, 
  OrderValidity,
  ForeverOrderFlag 
} from '@/features/trading/types';

// Default client ID
const DEFAULT_CLIENT_ID = '1101648848';

interface ForeverOrderFormProps {
  onOrderPlaced?: () => void;
}

export const ForeverOrderForm: React.FC<ForeverOrderFormProps> = ({ onOrderPlaced }) => {
  const [formData, setFormData] = useState<Partial<PlaceForeverOrderRequest>>({
    dhanClientId: DEFAULT_CLIENT_ID,
    orderFlag: 'SINGLE',
    transactionType: 'BUY',
    exchangeSegment: 'NSE_EQ',
    productType: 'CNC',
    orderType: 'LIMIT',
    validity: 'DAY',
    quantity: 1,
    disclosedQuantity: 0,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const placeForeverOrderMutation = usePlaceForeverOrder();

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

    if (formData.orderType === 'LIMIT' && (!formData.price || formData.price <= 0)) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.orderType === 'STOP_LOSS' && (!formData.triggerPrice || formData.triggerPrice <= 0)) {
      errors.triggerPrice = 'Trigger price must be greater than 0';
    }

    // OCO specific validation
    if (formData.orderFlag === 'OCO') {
      if (!formData.price1 || formData.price1 <= 0) {
        errors.price1 = 'Target price is required for OCO orders';
      }

      if (!formData.triggerPrice1 || formData.triggerPrice1 <= 0) {
        errors.triggerPrice1 = 'Target trigger price is required for OCO orders';
      }

      if (!formData.quantity1 || formData.quantity1 <= 0) {
        errors.quantity1 = 'Target quantity is required for OCO orders';
      }
    }

    // Validate trigger price vs limit price relationship
    if (formData.orderType === 'STOP_LOSS' && formData.price && formData.triggerPrice) {
      if (formData.transactionType === 'BUY' && formData.triggerPrice >= formData.price) {
        errors.triggerPrice = 'For BUY orders, trigger price should be less than limit price';
      } else if (formData.transactionType === 'SELL' && formData.triggerPrice <= formData.price) {
        errors.triggerPrice = 'For SELL orders, trigger price should be greater than limit price';
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
      await placeForeverOrderMutation.mutateAsync(formData as PlaceForeverOrderRequest);
      
      // Reset form
      setFormData({
        dhanClientId: DEFAULT_CLIENT_ID,
        orderFlag: 'SINGLE',
        transactionType: 'BUY',
        exchangeSegment: 'NSE_EQ',
        productType: 'CNC',
        orderType: 'LIMIT',
        validity: 'DAY',
        quantity: 1,
        disclosedQuantity: 0,
      });

      onOrderPlaced?.();
    } catch (error) {
      console.error('Error placing forever order:', error);
    }
  };

  const updateFormData = (field: keyof PlaceForeverOrderRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getOrderFlagHelp = (orderFlag: ForeverOrderFlag) => {
    switch (orderFlag) {
      case 'SINGLE':
        return 'Traditional forever order that persists until executed or cancelled';
      case 'OCO':
        return 'One-Cancels-Other: Target order with automatic stop-loss leg';
      default:
        return '';
    }
  };

  const getProductTypeHelp = (productType: ProductType) => {
    switch (productType) {
      case 'CNC':
        return 'Cash and Carry - For delivery trading';
      case 'INTRADAY':
        return 'Intraday trading - Same day square-off';
      case 'MARGIN':
        return 'Margin trading - Leveraged position';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Place Forever Order</h2>
        <p className="text-gray-600 mt-1">
          Create long-term orders that persist across market sessions
        </p>
      </div>

      {/* Quick Reference */}
      <div className="px-6 py-4 bg-purple-50 border-b border-gray-200">
        <h4 className="text-sm font-medium text-purple-900 mb-2">📋 Forever Order Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium text-purple-800 mb-1">Order Types:</p>
            <ul className="text-purple-700 space-y-0.5">
              <li>• <strong>SINGLE</strong>: Traditional forever order</li>
              <li>• <strong>OCO</strong>: One-Cancels-Other with target & stop loss</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-purple-800 mb-1">Key Features:</p>
            <ul className="text-purple-700 space-y-0.5">
              <li>• Persist across multiple sessions</li>
              <li>• Trigger-based execution</li>
              <li>• Long-term investment strategies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Order Flag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Type *
          </label>
          <select
            value={formData.orderFlag || 'SINGLE'}
            onChange={(e) => updateFormData('orderFlag', e.target.value as ForeverOrderFlag)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="SINGLE">SINGLE - Single Forever Order</option>
            <option value="OCO">OCO - One-Cancels-Other</option>
          </select>
          {formData.orderFlag && (
            <p className="mt-1 text-xs text-purple-600">
              {getOrderFlagHelp(formData.orderFlag)}
            </p>
          )}
        </div>

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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.dhanClientId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client ID"
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.securityId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1333"
              required
            />
            {validationErrors.securityId && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.securityId}</p>
            )}
            <p className="mt-1 text-xs text-gray-600">
              Security ID from Dhan (e.g., 1333 for RELIANCE)
            </p>
          </div>
        </div>

        {/* Transaction Type and Exchange Segment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <select
              value={formData.transactionType || 'BUY'}
              onChange={(e) => updateFormData('transactionType', e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exchange Segment *
            </label>
            <select
              value={formData.exchangeSegment || 'NSE_EQ'}
              onChange={(e) => updateFormData('exchangeSegment', e.target.value as ExchangeSegment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="NSE_EQ">NSE_EQ - NSE Equity</option>
              <option value="NSE_FNO">NSE_FNO - NSE F&O</option>
              <option value="BSE_EQ">BSE_EQ - BSE Equity</option>
              <option value="BSE_FNO">BSE_FNO - BSE F&O</option>
            </select>
          </div>
        </div>

        {/* Product Type and Order Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <select
              value={formData.productType || 'CNC'}
              onChange={(e) => updateFormData('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="CNC">CNC - Cash and Carry</option>
              <option value="INTRADAY">INTRADAY - Intraday</option>
              <option value="MARGIN">MARGIN - Margin</option>
            </select>
            {formData.productType && (
              <p className="mt-1 text-xs text-purple-600">
                {getProductTypeHelp(formData.productType)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type *
            </label>
            <select
              value={formData.orderType || 'LIMIT'}
              onChange={(e) => updateFormData('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="LIMIT">LIMIT - Limit Order</option>
              <option value="MARKET">MARKET - Market Order</option>
              <option value="STOP_LOSS">STOP_LOSS - Stop Loss</option>
              <option value="STOP_LOSS_MARKET">STOP_LOSS_MARKET - Stop Loss Market</option>
            </select>
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => updateFormData('quantity', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Number of shares"
              min="1"
              required
            />
            {validationErrors.quantity && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.quantity}</p>
            )}
          </div>

          {formData.orderType === 'LIMIT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Limit price"
                required
              />
              {validationErrors.price && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.price}</p>
              )}
            </div>
          )}
        </div>

        {/* Trigger Price for Stop Loss orders */}
        {(formData.orderType === 'STOP_LOSS' || formData.orderType === 'STOP_LOSS_MARKET') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.triggerPrice || ''}
              onChange={(e) => updateFormData('triggerPrice', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                validationErrors.triggerPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Trigger price"
              required
            />
            {validationErrors.triggerPrice && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.triggerPrice}</p>
            )}
            <p className="mt-1 text-xs text-gray-600">
              Order will be triggered when market price {formData.transactionType === 'BUY' ? 'falls to' : 'rises to'} this level
            </p>
          </div>
        )}

        {/* OCO Order Additional Fields */}
        {formData.orderFlag === 'OCO' && (
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="text-sm font-medium text-purple-900 mb-3">Target Leg (OCO)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity1 || ''}
                  onChange={(e) => updateFormData('quantity1', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.quantity1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Target quantity"
                  min="1"
                  required
                />
                {validationErrors.quantity1 && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.quantity1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price1 || ''}
                  onChange={(e) => updateFormData('price1', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.price1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Target price"
                  required
                />
                {validationErrors.price1 && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.price1}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Trigger Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.triggerPrice1 || ''}
                onChange={(e) => updateFormData('triggerPrice1', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.triggerPrice1 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Target trigger price"
                required
              />
              {validationErrors.triggerPrice1 && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.triggerPrice1}</p>
              )}
            </div>
          </div>
        )}

        {/* Validity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validity *
          </label>
          <select
            value={formData.validity || 'DAY'}
            onChange={(e) => updateFormData('validity', e.target.value as OrderValidity)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="DAY">DAY - Valid for current session</option>
            <option value="IOC">IOC - Immediate or Cancel</option>
          </select>
        </div>

        {/* Disclosed Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disclosed Quantity
          </label>
          <input
            type="number"
            value={formData.disclosedQuantity || 0}
            onChange={(e) => updateFormData('disclosedQuantity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
          />
          <p className="mt-1 text-xs text-gray-600">
            Amount of quantity to disclose to market (0 = full quantity)
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          {/* Show API errors */}
          {placeForeverOrderMutation.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Order Placement Failed</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {placeForeverOrderMutation.error?.message?.includes('not available') || placeForeverOrderMutation.error?.message?.includes('404')
                      ? 'Forever Orders feature is not available for your account. Please contact Dhan support to enable this feature.'
                      : placeForeverOrderMutation.error?.message || 'An unexpected error occurred'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={placeForeverOrderMutation.isPending}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {placeForeverOrderMutation.isPending ? 'Creating Forever Order...' : 'Create Forever Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForeverOrderForm;
