/**
 * Forever Order Book Component with CRUD Operations
 * 
 * Enhanced forever order book with create, edit, modify, and cancel functionality
 */

'use client';

import React, { useState } from 'react';
import { useForeverOrderBook, useCancelForeverOrder } from '@/features/trading/hooks';
import type { DhanForeverOrder } from '@/features/trading/types';

interface ForeverOrderBookProps {
  onOrderSelect?: (order: DhanForeverOrder) => void;
  onOrderModify?: (order: DhanForeverOrder) => void;
  onCreateNew?: () => void;
}

export const ForeverOrderBook: React.FC<ForeverOrderBookProps> = ({ 
  onOrderSelect, 
  onOrderModify, 
  onCreateNew 
}) => {
  const { data: foreverOrders, isLoading, error, refetch } = useForeverOrderBook();
  const cancelOrderMutation = useCancelForeverOrder();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRM':
        return 'bg-blue-100 text-blue-800';
      case 'TRADED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOrderModifiable = (order: DhanForeverOrder) => {
    const nonModifiableStatuses = ['REJECTED', 'CANCELLED', 'TRADED', 'EXPIRED'];
    return !nonModifiableStatuses.includes(order.orderStatus);
  };

  const isOrderCancellable = (order: DhanForeverOrder) => {
    const cancellableStatuses = ['PENDING', 'CONFIRM'];
    return cancellableStatuses.includes(order.orderStatus);
  };

  const getOrderTypeIcon = (orderType: string) => {
    return orderType === 'OCO' ? '🔄' : '⚡';
  };

  const getLegNameDisplay = (legName: string) => {
    switch (legName) {
      case 'ENTRY_LEG':
        return 'Entry';
      case 'TARGET_LEG':
        return 'Target';
      default:
        return legName;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this forever order? This action cannot be undone.')) {
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync(orderId);
      refetch();
    } catch (error) {
      console.error('Failed to cancel forever order:', error);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A';
    return `₹${price.toFixed(2)}`;
  };

  const getOrderStatusMessage = (order: DhanForeverOrder) => {
    if (order.orderStatus === 'REJECTED') {
      return 'Order was rejected by the exchange or broker';
    }
    if (order.orderStatus === 'EXPIRED') {
      return 'Order expired due to validity period completion';
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    const isFeatureNotAvailable = error.message?.includes('not available') || error.message?.includes('404');
    
    return (
      <div className={`${isFeatureNotAvailable ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {isFeatureNotAvailable ? (
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${isFeatureNotAvailable ? 'text-blue-800' : 'text-red-800'}`}>
              {isFeatureNotAvailable ? 'Forever Orders Feature Not Available' : 'Forever Orders API Error'}
            </h3>
            <div className={`mt-2 text-sm ${isFeatureNotAvailable ? 'text-blue-700' : 'text-red-700'}`}>
              {isFeatureNotAvailable ? (
                <div>
                  <p>Forever Orders are not enabled for your Dhan account.</p>
                  <div className="mt-3 p-3 bg-blue-100 rounded-md">
                    <p className="font-medium">To enable Forever Orders:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Contact Dhan customer support</li>
                      <li>Request activation of the Forever Orders feature</li>
                      <li>Complete any additional KYC requirements if needed</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      Forever Orders are advanced order types that remain active across trading sessions until executed or cancelled.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{error.message}</p>
                  {error.message.includes('No response data from Dhan API') && (
                    <div className="mt-3 p-3 bg-red-100 rounded-md">
                      <p className="font-medium">Possible causes:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Invalid or expired Dhan API access token</li>
                        <li>Forever Order feature not enabled for this account</li>
                        <li>Network connectivity issues</li>
                        <li>Dhan API service temporarily unavailable</li>
                      </ul>
                      <p className="mt-2 text-xs">
                        Check the browser console and server logs for more details.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!foreverOrders || foreverOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Forever Orders</h3>
        <p className="text-gray-500 mb-4">You haven't placed any forever orders yet.</p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Your First Forever Order</span>
          </button>
        )}
        
        {/* Show additional help */}
        <div className="max-w-md mx-auto">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-purple-800">About Forever Orders</h4>
                <div className="mt-1 text-sm text-purple-700">
                  <p>Forever orders are long-term orders that persist across sessions:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Single orders: Traditional long-term orders</li>
                    <li>OCO orders: One-Cancels-Other with target and stop loss</li>
                    <li>Triggered orders: Activated when conditions are met</li>
                    <li>Persistent: Remain active until executed or cancelled</li>
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
        <h2 className="text-xl font-semibold text-gray-900">Forever Order Book</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <div className="text-sm text-gray-500">
            {foreverOrders.length} order{foreverOrders.length !== 1 ? 's' : ''}
          </div>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors inline-flex items-center space-x-1"
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
        {foreverOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getOrderTypeIcon(order.orderType)}</div>
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
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
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

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
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
                <div className="text-xs text-gray-500">Trigger Price</div>
                <div className="font-medium">{formatPrice(order.triggerPrice)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Order Type</div>
                <div className="font-medium">{order.orderType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Leg</div>
                <div className="font-medium">{getLegNameDisplay(order.legName)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Product</div>
                <div className="font-medium">{order.productType}</div>
              </div>
            </div>

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
                      <h4 className="text-sm font-medium text-red-800">Order Status</h4>
                      <p className="text-sm text-red-700 mt-1">{getOrderStatusMessage(order)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>Created: {new Date(order.createTime).toLocaleString()}</div>
                {order.updateTime && (
                  <div>Updated: {new Date(order.updateTime).toLocaleString()}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForeverOrderBook;
