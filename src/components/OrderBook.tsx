/**
 * Order Book Component with CRUD Operations
 * 
 * Enhanced order book with create, edit, modify, and cancel functionality
 */

'use client';

import React, { useState } from 'react';
import { useOrderBook, useModifyOrder, useCancelOrder } from '@/features/trading/hooks';
import type { DhanOrder } from '@/features/trading/types';

interface OrderBookProps {
  onOrderSelect?: (order: DhanOrder) => void;
  onOrderModify?: (order: DhanOrder) => void;
  onCreateNew?: () => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({ 
  onOrderSelect, 
  onOrderModify, 
  onCreateNew 
}) => {
  const { data: orders, isLoading, error } = useOrderBook();
  const cancelOrderMutation = useCancelOrder();
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOrderModifiable = (order: DhanOrder) => {
    const nonModifiableStatuses = ['REJECTED', 'CANCELLED', 'TRADED'];
    return !nonModifiableStatuses.includes(order.orderStatus);
  };

  const isOrderCancellable = (order: DhanOrder) => {
    const nonCancellableStatuses = ['REJECTED', 'CANCELLED', 'TRADED'];
    return !nonCancellableStatuses.includes(order.orderStatus);
  };

  const getOrderStatusMessage = (order: DhanOrder) => {
    if (order.orderStatus === 'REJECTED' && order.omsErrorDescription) {
      return order.omsErrorDescription;
    }
    return null;
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync(orderId);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'Market';
    return `₹${price.toFixed(2)}`;
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
            <h3 className="text-sm font-medium text-red-800">Orders API Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
              {error.message.includes('No response data from Dhan API') && (
                <div className="mt-3 p-3 bg-red-100 rounded-md">
                  <p className="font-medium">Possible causes:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Invalid or expired Dhan API access token</li>
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

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders</h3>
        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Place Your First Order</span>
          </button>
        )}
        
        {/* Show additional help */}
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Getting Started</h4>
                <div className="mt-1 text-sm text-blue-700">
                  <p>Start trading with various order types:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Market orders for immediate execution</li>
                    <li>Limit orders for specific price targets</li>
                    <li>Stop loss orders for risk management</li>
                    <li>Sliced orders for large quantities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Order Book</h2>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
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
        {orders.map((order: DhanOrder) => (
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
                    disabled={cancelOrderMutation.isPending}
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

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="font-medium">
                  {order.transactionType} {order.quantity}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Price</div>
                <div className="font-medium">{formatPrice(order.price)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Product</div>
                <div className="font-medium">{order.productType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Order Type</div>
                <div className="font-medium">{order.orderType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Remaining</div>
                <div className="font-medium">{order.remainingQuantity}</div>
              </div>
            </div>

            {/* Progress bar for partial fills */}
            {order.orderStatus === 'PART_TRADED' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Filled: {order.filledQty}</span>
                  <span>Total: {order.quantity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(order.filledQty / order.quantity) * 100}%` }}
                  ></div>
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

export default OrderBook;
