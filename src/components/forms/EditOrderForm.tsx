/**
 * Edit Order Form Component
 * 
 * Form for editing/modifying regular orders with validation and error handling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useModifyOrder, useCancelOrder } from '@/features/trading/hooks';
import type { 
  DhanOrder, 
  ModifyOrderRequest, 
  OrderType, 
  OrderValidity 
} from '@/features/trading/types';

interface EditOrderFormProps {
  order: DhanOrder | null;
  isOpen: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}

export const EditOrderForm: React.FC<EditOrderFormProps> = ({
  order,
  isOpen,
  onCloseAction: onClose,
  onSuccessAction: onSuccess
}) => {
  const [formData, setFormData] = useState<Partial<ModifyOrderRequest>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'modify' | 'cancel' | null>(null);

  const modifyOrderMutation = useModifyOrder();
  const cancelOrderMutation = useCancelOrder();

  // Initialize form data when order changes
  useEffect(() => {
    if (order) {
      setFormData({
        dhanClientId: order.dhanClientId,
        orderId: order.orderId,
        orderType: order.orderType,
        quantity: order.remainingQuantity || order.quantity,
        price: order.price,
        triggerPrice: order.triggerPrice,
        validity: order.validity,
        disclosedQuantity: order.disclosedQuantity || 0,
      });
      setValidationErrors({});
    }
  }, [order]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

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

    if (formData.orderType === 'STOP_LOSS' && formData.price && formData.triggerPrice) {
      if (order?.transactionType === 'BUY' && formData.triggerPrice >= formData.price) {
        errors.triggerPrice = 'For BUY stop loss, trigger price should be less than limit price';
      }
      if (order?.transactionType === 'SELL' && formData.triggerPrice <= formData.price) {
        errors.triggerPrice = 'For SELL stop loss, trigger price should be greater than limit price';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setActionType('modify');
      setShowConfirmation(true);
    }
  };

  const handleConfirmModify = async () => {
    if (!order || !formData.orderId) return;

    try {
      await modifyOrderMutation.mutateAsync({
        orderId: formData.orderId,
        modifyData: formData as ModifyOrderRequest
      });
      onSuccess();
      onClose();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error modifying order:', error);
    }
  };

  const handleCancelOrder = () => {
    setActionType('cancel');
    setShowConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (!order) return;

    try {
      await cancelOrderMutation.mutateAsync(order.orderId);
      onSuccess();
      onClose();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const updateFormData = (field: keyof ModifyOrderRequest, value: any) => {
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

  if (!isOpen || !order) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Edit Order</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Order Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <div className="font-medium">{order.orderId}</div>
              </div>
              <div>
                <span className="text-gray-600">Symbol:</span>
                <div className="font-medium">{order.tradingSymbol || order.securityId}</div>
              </div>
              <div>
                <span className="text-gray-600">Side:</span>
                <div className={`font-medium ${
                  order.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.transactionType}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium">{order.orderStatus}</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Order Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type *
              </label>
              <select
                value={formData.orderType || ''}
                onChange={(e) => updateFormData('orderType', e.target.value as OrderType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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

            {/* Quantity and Validity */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                {order.filledQty > 0 && (
                  <p className="mt-1 text-xs text-green-600">
                    Filled: {order.filledQty} | Remaining: {order.remainingQuantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity *
                </label>
                <select
                  value={formData.validity || ''}
                  onChange={(e) => updateFormData('validity', e.target.value as OrderValidity)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="DAY">DAY</option>
                  <option value="IOC">IOC (Immediate or Cancel)</option>
                </select>
              </div>
            </div>

            {/* Price (for LIMIT and STOP_LOSS orders) */}
            {(formData.orderType === 'LIMIT' || formData.orderType === 'STOP_LOSS') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limit Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter limit price"
                  required
                />
                {validationErrors.price && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.price}</p>
                )}
              </div>
            )}

            {/* Trigger Price (for stop loss orders) */}
            {(formData.orderType === 'STOP_LOSS' || formData.orderType === 'STOP_LOSS_MARKET') && (
              <div className="mb-6">
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
                <p className="mt-1 text-xs text-gray-600">
                  {order.transactionType === 'BUY' 
                    ? 'For BUY orders, trigger when price falls to this level'
                    : 'For SELL orders, trigger when price rises to this level'
                  }
                </p>
              </div>
            )}

            {/* Disclosed Quantity */}
            <div className="mb-6">
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
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
              <button
                type="submit"
                disabled={modifyOrderMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {modifyOrderMutation.isPending ? 'Updating...' : 'Update Order'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'cancel' ? 'Cancel Order' : 'Confirm Modification'}
              </h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-600">
                {actionType === 'cancel' 
                  ? `Are you sure you want to cancel order ${order.orderId}?`
                  : `Are you sure you want to modify order ${order.orderId}?`
                }
              </p>

              {actionType === 'modify' && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <div className="font-medium mb-2">Summary of changes:</div>
                  <div className="space-y-1">
                    <div>Quantity: {formData.quantity}</div>
                    <div>Order Type: {formData.orderType}</div>
                    {formData.price && <div>Price: ₹{formData.price}</div>}
                    {formData.triggerPrice && <div>Trigger Price: ₹{formData.triggerPrice}</div>}
                    <div>Validity: {formData.validity}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'cancel' ? handleConfirmCancel : handleConfirmModify}
                disabled={modifyOrderMutation.isPending || cancelOrderMutation.isPending}
                className={`flex-1 px-4 py-2 text-white rounded-md transition-colors ${
                  actionType === 'cancel' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {(modifyOrderMutation.isPending || cancelOrderMutation.isPending) 
                  ? 'Processing...' 
                  : actionType === 'cancel' 
                    ? 'Yes, Cancel Order' 
                    : 'Yes, Modify Order'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditOrderForm;
