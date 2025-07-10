/**
 * Modify Super Order Form Component
 * 
 * Provides a form interface for modifying existing super orders
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useModifySuperOrder, useCancelSuperOrder } from '@/features/trading/hooks';
import { DHAN_CONFIG } from '@/lib/config/app';
import type { 
  ModifySuperOrderRequest, 
  DhanSuperOrder,
  LegName,
  OrderType 
} from '@/features/trading/types';

interface ModifySuperOrderFormProps {
  order: DhanSuperOrder;
  onSuccess?: () => void;
  onCancel?: () => void;
  onOrderCancelled?: () => void;
  onCreateNew?: () => void;
}

export const ModifySuperOrderForm: React.FC<ModifySuperOrderFormProps> = ({ 
  order, 
  onSuccess, 
  onCancel,
  onOrderCancelled,
  onCreateNew
}) => {
  const [formData, setFormData] = useState<ModifySuperOrderRequest>({
    dhanClientId: DHAN_CONFIG.clientId || '',
    orderId: order.orderId,
    legName: 'ENTRY_LEG' as LegName,
    orderType: order.orderType as OrderType,
    quantity: order.quantity,
    price: order.price,
    targetPrice: 0,
    stopLossPrice: 0,
    trailingJump: 0,
  });

  const modifySuperOrderMutation = useModifySuperOrder();
  const cancelSuperOrderMutation = useCancelSuperOrder();

  // Initialize form with order's leg details
  useEffect(() => {
    if (order.legDetails && order.legDetails.length > 0) {
      const entryLeg = order.legDetails.find(leg => leg.legName === 'ENTRY_LEG');
      const targetLeg = order.legDetails.find(leg => leg.legName === 'TARGET_LEG');
      const stopLossLeg = order.legDetails.find(leg => leg.legName === 'STOP_LOSS_LEG');

      setFormData(prev => ({
        ...prev,
        price: entryLeg?.price || order.price,
        targetPrice: targetLeg?.price || 0,
        stopLossPrice: stopLossLeg?.price || 0,
        trailingJump: stopLossLeg?.trailingJump || 0,
      }));
    }
  }, [order]);

  const handleInputChange = (field: keyof ModifySuperOrderRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await modifySuperOrderMutation.mutateAsync(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to modify super order:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this super order? This action cannot be undone.')) {
      return;
    }

    try {
      await cancelSuperOrderMutation.mutateAsync({ 
        orderId: order.orderId, 
        legName: 'ENTRY_LEG' 
      });
      if (onOrderCancelled) {
        onOrderCancelled();
      }
    } catch (error) {
      console.error('Failed to cancel super order:', error);
    }
  };

  const handleCancelLeg = async (legName: LegName) => {
    if (!window.confirm(`Are you sure you want to cancel the ${legName.replace('_', ' ')}? This action cannot be undone.`)) {
      return;
    }

    try {
      await cancelSuperOrderMutation.mutateAsync({ 
        orderId: order.orderId, 
        legName 
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to cancel order leg:', error);
    }
  };

  const isOrderModifiable = () => {
    const nonModifiableStatuses = ['REJECTED', 'CANCELLED', 'TRADED', 'CLOSED'];
    return !nonModifiableStatuses.includes(order.orderStatus);
  };

  const calculateProfitLoss = () => {
    const { price, targetPrice, stopLossPrice, quantity } = formData;
    if (!price || !targetPrice || !stopLossPrice || !quantity) return { profit: 0, loss: 0 };
    
    const profit = (targetPrice - price) * quantity;
    const loss = (price - stopLossPrice) * quantity;
    return { profit, loss };
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (formData.legName === 'ENTRY_LEG') {
      if (!formData.quantity || formData.quantity <= 0) {
        errors.push('Quantity must be greater than 0');
      }
      if (!formData.price || formData.price <= 0) {
        errors.push('Entry price must be greater than 0');
      }
    } else if (formData.legName === 'TARGET_LEG') {
      if (!formData.targetPrice || formData.targetPrice <= 0) {
        errors.push('Target price must be greater than 0');
      }
      // For buy orders, target should be higher than entry price
      if (order.transactionType === 'BUY' && formData.targetPrice && formData.targetPrice <= order.price) {
        errors.push('Target price should be higher than entry price for buy orders');
      }
      // For sell orders, target should be lower than entry price
      if (order.transactionType === 'SELL' && formData.targetPrice && formData.targetPrice >= order.price) {
        errors.push('Target price should be lower than entry price for sell orders');
      }
    } else if (formData.legName === 'STOP_LOSS_LEG') {
      if (!formData.stopLossPrice || formData.stopLossPrice <= 0) {
        errors.push('Stop loss price must be greater than 0');
      }
      // For buy orders, stop loss should be lower than entry price
      if (order.transactionType === 'BUY' && formData.stopLossPrice && formData.stopLossPrice >= order.price) {
        errors.push('Stop loss price should be lower than entry price for buy orders');
      }
      // For sell orders, stop loss should be higher than entry price
      if (order.transactionType === 'SELL' && formData.stopLossPrice && formData.stopLossPrice <= order.price) {
        errors.push('Stop loss price should be higher than entry price for sell orders');
      }
    }
    
    return errors;
  };

  const formErrors = validateForm();

  if (!isOrderModifiable()) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Modifiable</h3>
          <p className="text-gray-600 mb-4">
            This super order cannot be modified due to its current status: <strong>{order.orderStatus}</strong>
          </p>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back to Orders
            </button>
          )}
        </div>
      </div>
    );
  }

  const { profit, loss } = calculateProfitLoss();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modify Super Order</h2>
          <p className="text-gray-600 mt-1">
            Order ID: {order.orderId} • {order.tradingSymbol}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Order</span>
            </button>
          )}
          
          {/* Cancel Order Button */}
          {isOrderModifiable() && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelSuperOrderMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{cancelSuperOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}</span>
            </button>
          )}

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
      </div>

      {/* Order Status Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.orderStatus === 'PART_TRADED' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.orderStatus}
            </span>
            <div className="text-sm text-gray-600">
              <strong>LTP:</strong> ₹{order.ltp.toFixed(2)} | 
              <strong className="ml-2">Remaining:</strong> {order.remainingQuantity}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leg Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leg to Modify
          </label>
          <div className="flex items-center space-x-3">
            <select
              value={formData.legName}
              onChange={(e) => handleInputChange('legName', e.target.value as LegName)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ENTRY_LEG">Entry Leg</option>
              <option value="TARGET_LEG">Target Leg</option>
              <option value="STOP_LOSS_LEG">Stop Loss Leg</option>
            </select>
            
            {/* Cancel specific leg button */}
            {(formData.legName === 'TARGET_LEG' || formData.legName === 'STOP_LOSS_LEG') && isOrderModifiable() && (
              <button
                type="button"
                onClick={() => handleCancelLeg(formData.legName)}
                disabled={cancelSuperOrderMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm disabled:opacity-50"
              >
                Cancel This Leg
              </button>
            )}
          </div>
        </div>

        {/* Conditional Fields based on selected leg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.legName === 'ENTRY_LEG' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {formData.legName === 'TARGET_LEG' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.targetPrice || ''}
                onChange={(e) => handleInputChange('targetPrice', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {formData.legName === 'STOP_LOSS_LEG' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stopLossPrice || ''}
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
                  step="0.01"
                  min="0"
                  value={formData.trailingJump || ''}
                  onChange={(e) => handleInputChange('trailingJump', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Order Type for Entry Leg */}
        {formData.legName === 'ENTRY_LEG' && (
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
        )}

        {/* P&L Preview for comprehensive changes */}
        {(profit > 0 || loss > 0) && formData.quantity && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Updated P&L Preview</h3>
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

        {/* Validation Errors */}
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
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
            disabled={modifySuperOrderMutation.isPending || formErrors.length > 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {modifySuperOrderMutation.isPending ? 'Modifying Order...' : 'Modify Super Order'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {modifySuperOrderMutation.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 text-sm">
            {modifySuperOrderMutation.error instanceof Error 
              ? modifySuperOrderMutation.error.message 
              : 'An error occurred while modifying the super order'}
          </div>
        </div>
      )}

      {/* Success Message */}
      {modifySuperOrderMutation.isSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="text-green-800 text-sm">
            Super order modified successfully!
          </div>
        </div>
      )}

      {/* Form Validation Errors */}
      {formErrors.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-yellow-800 text-sm">
            <ul className="list-disc list-inside">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Super Order Actions Guide
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Available Actions:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Modify</strong>: Change price, quantity, or leg parameters</li>
                    <li>• <strong>Cancel Order</strong>: Cancel the entire super order</li>
                    <li>• <strong>Cancel Leg</strong>: Cancel only Target or Stop Loss legs</li>
                    <li>• <strong>Create New</strong>: Start fresh with a new super order</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Modification Rules:</h4>
                  <ul className="space-y-1">
                    <li>• Entry Leg: Modify price, quantity, and order type</li>
                    <li>• Target Leg: Adjust profit-taking price</li>
                    <li>• Stop Loss Leg: Change stop price and trailing jump</li>
                    <li>• Only pending orders can be modified</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
