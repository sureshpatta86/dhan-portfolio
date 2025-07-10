/**
 * Super Order Book Component
 * 
 * Displays a list of super orders with their status and management actions
 */

'use client';

import React, { useState } from 'react';
import { useSuperOrderBook, useModifySuperOrder, useCancelSuperOrder } from '@/features/trading/hooks';
import type { DhanSuperOrder, LegName } from '@/features/trading/types';

interface SuperOrderBookProps {
  onOrderSelect?: (order: DhanSuperOrder) => void;
  onOrderModify?: (order: DhanSuperOrder) => void;
  onCreateNew?: () => void;
}

export const SuperOrderBook: React.FC<SuperOrderBookProps> = ({ onOrderSelect, onOrderModify, onCreateNew }) => {
  const { data: superOrders, isLoading, error } = useSuperOrderBook();
  const modifySuperOrderMutation = useModifySuperOrder();
  const cancelSuperOrderMutation = useCancelSuperOrder();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'TRADED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PART_TRADED':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLegStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'TRIGGERED':
        return 'text-blue-600';
      case 'TRADED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isOrderModifiable = (order: DhanSuperOrder) => {
    const nonModifiableStatuses = ['REJECTED', 'CANCELLED', 'TRADED', 'CLOSED'];
    return !nonModifiableStatuses.includes(order.orderStatus);
  };

  const isOrderCancellable = (order: DhanSuperOrder) => {
    const nonCancellableStatuses = ['REJECTED', 'CANCELLED', 'TRADED', 'CLOSED'];
    return !nonCancellableStatuses.includes(order.orderStatus);
  };

  const getOrderStatusMessage = (order: DhanSuperOrder) => {
    if (order.orderStatus === 'REJECTED' && order.omsErrorDescription) {
      return order.omsErrorDescription;
    }
    return null;
  };

  const handleCancelOrder = async (orderId: string, legName: LegName = 'ENTRY_LEG') => {
    try {
      await cancelSuperOrderMutation.mutateAsync({ orderId, legName });
    } catch (error) {
      console.error('Failed to cancel super order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Super Order API Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
              {error.message.includes('No response data from Dhan API') && (
                <div className="mt-3 p-3 bg-red-100 rounded-md">
                  <p className="font-medium">Possible causes:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Invalid or expired Dhan API access token</li>
                    <li>Super Order feature not enabled for your account</li>
                    <li>Network connectivity issues</li>
                    <li>Dhan API service temporarily unavailable</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Check the browser console and server logs for more details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!superOrders || superOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Super Orders</h3>
        <p className="text-gray-500 mb-4">You haven't placed any super orders yet.</p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Your First Super Order</span>
          </button>
        )}
        
        {/* Show additional help if there's an API error */}
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Super Order Access</h4>
                <div className="mt-1 text-sm text-blue-700">
                  <p>If you're unable to see or place super orders, please:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Verify that Super Order feature is enabled for your Dhan account</li>
                    <li>Contact Dhan support to activate Super Order trading</li>
                    <li>Ensure your account has the required permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Super Order Book</h2>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {superOrders.length} order{superOrders.length !== 1 ? 's' : ''}
            </div>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors inline-flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New</span>
              </button>
            )}
          </div>
        </div>

      <div className="space-y-3">
        {superOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {order.tradingSymbol}
                  </div>
                  <div className="text-sm text-gray-500">
                    Order ID: {order.orderId}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {isOrderModifiable(order) && onOrderModify && (
                  <button
                    onClick={() => onOrderModify(order)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                {isOrderCancellable(order) ? (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    disabled={cancelSuperOrderMutation.isPending}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">
                    {order.orderStatus === 'REJECTED' ? 'Rejected' : 'Not Cancellable'}
                  </span>
                )}
                {onOrderSelect && (
                  <button
                    onClick={() => onOrderSelect(order)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Details
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="font-medium">
                  {order.transactionType} {order.quantity}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Entry Price</div>
                <div className="font-medium">₹{order.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">LTP</div>
                <div className="font-medium">₹{order.ltp.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Remaining Qty</div>
                <div className="font-medium">{order.remainingQuantity}</div>
              </div>
            </div>

            {/* Leg Details */}
            {order.legDetails && order.legDetails.length > 0 && (
              <div className="border-t pt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Order Legs</div>
                <div className="space-y-2">
                  {order.legDetails.map((leg, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-gray-600">
                          {leg.legName.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-medium ${getLegStatusColor(leg.orderStatus)}`}>
                          {leg.orderStatus}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium ml-1">₹{leg.price.toFixed(2)}</span>
                        </div>
                        {leg.trailingJump > 0 && (
                          <div>
                            <span className="text-gray-500">Trail:</span>
                            <span className="font-medium ml-1">₹{leg.trailingJump.toFixed(2)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Qty:</span>
                          <span className="font-medium ml-1">{leg.remainingQuantity}</span>
                        </div>
                        {(leg.legName === 'TARGET_LEG' || leg.legName === 'STOP_LOSS_LEG') && 
                         isOrderCancellable(order) && (
                          <button
                            onClick={() => handleCancelOrder(order.orderId, leg.legName)}
                            disabled={cancelSuperOrderMutation.isPending}
                            className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                          >
                            Cancel Leg
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message for Rejected Orders */}
            {getOrderStatusMessage(order) && (
              <div className="border-t pt-3 mt-3">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800">Order Rejection Reason</h4>
                      <p className="text-sm text-red-700 mt-1">{getOrderStatusMessage(order)}</p>
                      {order.omsErrorDescription?.includes('Rate Not Within Ckt Limit') && (
                        <p className="text-xs text-red-600 mt-2">
                          💡 The order price is outside the allowed circuit limits. Try placing the order at a price closer to the current market price.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>Created: {new Date(order.createTime).toLocaleString()}</div>
                <div>Updated: {new Date(order.updateTime).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SuperOrderBook;