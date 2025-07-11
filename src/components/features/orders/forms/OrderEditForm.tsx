/**
 * Order Edit Form Component
 * 
 * Form for modifying existing orders
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useModifyOrder } from '@/features/trading/hooks';
import type { 
  ModifyOrderRequest, 
  DhanOrder,
  OrderType,
  OrderValidity 
} from '@/features/trading/types';

interface OrderEditFormProps {
  order: DhanOrder | null;
  isOpen: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}

export const OrderEditForm: React.FC<OrderEditFormProps> = ({
  order,
  isOpen,
  onCloseAction,
  onSuccessAction
}) => {
  const [modifyData, setModifyData] = useState<Partial<ModifyOrderRequest>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const modifyOrderMutation = useModifyOrder();

  // Populate form when order changes
  useEffect(() => {
    if (order) {
      setModifyData({
        dhanClientId: order.dhanClientId,
        orderId: order.orderId,
        orderType: order.orderType,
        quantity: order.quantity,
        price: order.price,
        triggerPrice: order.triggerPrice,
        validity: order.validity,
        disclosedQuantity: order.disclosedQuantity,
      });
    }
  }, [order]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!modifyData.quantity || modifyData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (modifyData.orderType === 'LIMIT' || modifyData.orderType === 'STOP_LOSS') {
      if (!modifyData.price || modifyData.price <= 0) {
        errors.price = 'Price is required for limit and stop loss orders';
      }
    }

    if (modifyData.orderType === 'STOP_LOSS' || modifyData.orderType === 'STOP_LOSS_MARKET') {
      if (!modifyData.triggerPrice || modifyData.triggerPrice <= 0) {
        errors.triggerPrice = 'Trigger price is required for stop loss orders';
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

    if (!modifyData.dhanClientId || !modifyData.orderId) {
      alert('Missing required order information');
      return;
    }

    try {
      await modifyOrderMutation.mutateAsync({
        orderId: modifyData.orderId!,
        modifyData: modifyData as ModifyOrderRequest
      });
      onSuccessAction();
      onCloseAction();
    } catch (error) {
      console.error('Error modifying order:', error);
    }
  };

  const updateModifyData = (field: keyof ModifyOrderRequest, value: any) => {
    setModifyData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Edit Order</h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Order Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="ml-2 font-medium">{order.orderId}</span>
              </div>
              <div>
                <span className="text-gray-600">Symbol:</span>
                <span className="ml-2 font-medium">{order.tradingSymbol || order.securityId}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{order.transactionType}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.orderStatus === 'TRADED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type *
              </label>
              <select
                value={modifyData.orderType || ''}
                onChange={(e) => updateModifyData('orderType', e.target.value as OrderType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="MARKET">MARKET</option>
                <option value="LIMIT">LIMIT</option>
                <option value="STOP_LOSS">STOP_LOSS</option>
                <option value="STOP_LOSS_MARKET">STOP_LOSS_MARKET</option>
              </select>
            </div>

            {/* Quantity and Validity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={modifyData.quantity || ''}
                  onChange={(e) => updateModifyData('quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  required
                />
                {validationErrors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity *
                </label>
                <select
                  value={modifyData.validity || ''}
                  onChange={(e) => updateModifyData('validity', e.target.value as OrderValidity)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="DAY">DAY</option>
                  <option value="IOC">IOC</option>
                </select>
              </div>
            </div>

            {/* Price (conditional) */}
            {(modifyData.orderType === 'LIMIT' || modifyData.orderType === 'STOP_LOSS') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={modifyData.price || ''}
                  onChange={(e) => updateModifyData('price', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price"
                  required
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>
            )}

            {/* Trigger Price (conditional) */}
            {(modifyData.orderType === 'STOP_LOSS' || modifyData.orderType === 'STOP_LOSS_MARKET') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trigger Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={modifyData.triggerPrice || ''}
                  onChange={(e) => updateModifyData('triggerPrice', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter trigger price"
                  required
                />
                {validationErrors.triggerPrice && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.triggerPrice}</p>
                )}
              </div>
            )}

            {/* Disclosed Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disclosed Quantity
              </label>
              <input
                type="number"
                value={modifyData.disclosedQuantity || 0}
                onChange={(e) => updateModifyData('disclosedQuantity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave as 0 to disclose full quantity
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCloseAction}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modifyOrderMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {modifyOrderMutation.isPending ? 'Updating...' : 'Update Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
