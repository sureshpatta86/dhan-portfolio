/**
 * Forever Order Edit Form Component
 * 
 * Form for modifying existing forever orders
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useModifyForeverOrder } from '@/features/trading/hooks';
import type { 
  ModifyForeverOrderRequest, 
  DhanForeverOrder,
  OrderType,
  LegName,
  OrderValidity 
} from '@/features/trading/types';

interface ForeverOrderEditFormProps {
  order: DhanForeverOrder | null;
  isOpen: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}

export const ForeverOrderEditForm: React.FC<ForeverOrderEditFormProps> = ({
  order,
  isOpen,
  onCloseAction,
  onSuccessAction
}) => {
  const [formData, setFormData] = useState<Partial<ModifyForeverOrderRequest>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const modifyForeverOrderMutation = useModifyForeverOrder();

  // Populate form when order changes
  useEffect(() => {
    if (order) {
      setFormData({
        dhanClientId: order.dhanClientId,
        orderId: order.orderId,
        orderFlag: order.orderType, // DhanForeverOrder.orderType is actually ForeverOrderFlag
        orderType: 'LIMIT', // Default to LIMIT, user can change
        legName: order.legName,
        quantity: order.quantity,
        price: order.price,
        triggerPrice: order.triggerPrice,
        validity: 'DAY', // Default validity
      });
    }
  }, [order]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.orderId) {
      errors.orderId = 'Order ID is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.orderType === 'LIMIT' && (!formData.price || formData.price <= 0)) {
      errors.price = 'Price is required for limit orders';
    }

    if ((formData.orderType === 'STOP_LOSS' || formData.orderType === 'STOP_LOSS_MARKET') && 
        (!formData.triggerPrice || formData.triggerPrice <= 0)) {
      errors.triggerPrice = 'Trigger price is required for stop loss orders';
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
      await modifyForeverOrderMutation.mutateAsync(formData as ModifyForeverOrderRequest);
      onSuccessAction();
      onCloseAction();
    } catch (error) {
      console.error('Failed to modify forever order:', error);
    }
  };

  const handleInputChange = (field: keyof ModifyForeverOrderRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !order) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Modify Forever Order
            </h2>
            <button
              onClick={onCloseAction}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="ml-2 font-medium">{order.orderId}</span>
              </div>
              <div>
                <span className="text-gray-600">Security:</span>
                <span className="ml-2 font-medium">{order.securityId}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{order.transactionType}</span>
              </div>
              <div>
                <span className="text-gray-600">Exchange:</span>
                <span className="ml-2 font-medium">{order.exchangeSegment}</span>
              </div>
            </div>
          </div>

          {/* Modifiable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type *
              </label>
              <select
                value={formData.orderType || ''}
                onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LIMIT">Limit</option>
                <option value="MARKET">Market</option>
                <option value="STOP_LOSS">Stop Loss</option>
                <option value="STOP_LOSS_MARKET">Stop Loss Market</option>
              </select>
              {validationErrors.orderType && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.orderType}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity || ''}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
              {validationErrors.quantity && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>
              )}
            </div>

            {/* Price (for LIMIT orders) */}
            {(formData.orderType === 'LIMIT' || formData.orderType === 'STOP_LOSS') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {validationErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                )}
              </div>
            )}

            {/* Trigger Price (for SL orders) */}
            {(formData.orderType === 'STOP_LOSS' || formData.orderType === 'STOP_LOSS_MARKET') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.triggerPrice || ''}
                  onChange={(e) => handleInputChange('triggerPrice', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {validationErrors.triggerPrice && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.triggerPrice}</p>
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
                value={formData.disclosedQuantity || ''}
                onChange={(e) => handleInputChange('disclosedQuantity', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            {/* Validity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validity
              </label>
              <select
                value={formData.validity || ''}
                onChange={(e) => handleInputChange('validity', e.target.value as OrderValidity)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DAY">Day</option>
                <option value="IOC">IOC (Immediate or Cancel)</option>
              </select>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Modification Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Modifying a forever order may change its execution priority in the order book.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={modifyForeverOrderMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modifyForeverOrderMutation.isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {modifyForeverOrderMutation.isPending && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                </svg>
              )}
              <span>
                {modifyForeverOrderMutation.isPending ? 'Modifying...' : 'Modify Order'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
