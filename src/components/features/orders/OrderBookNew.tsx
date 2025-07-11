/**
 * Order Book Component
 * 
 * Displays all orders with filtering and management capabilities
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useOrderBook, useCancelOrder } from '@/features/trading/hooks';
import type { DhanOrder } from '@/features/trading/types';
import { LoadingSpinner, ErrorMessage } from '@/lib/components/ui/LoadingStates';

interface OrderBookProps {
  onOrderSelect?: (order: DhanOrder) => void;
  onOrderModify?: (order: DhanOrder) => void;
  onCreateNew?: () => void;
}

// Order Status Badge Component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TRADED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'PART_TRADED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export const OrderBook: React.FC<OrderBookProps> = ({ 
  onOrderSelect, 
  onOrderModify, 
  onCreateNew 
}) => {
  const { data: orders, isLoading, error, refetch } = useOrderBook();
  const cancelOrderMutation = useCancelOrder();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Categorize orders by status
  const categorizedOrders = useMemo(() => {
    if (!orders) return { active: [], completed: [], cancelled: [], expired: [], others: [] };
    
    const active = orders.filter((order: DhanOrder) => 
      order.orderStatus === 'PENDING' || order.orderStatus === 'PART_TRADED'
    );
    const completed = orders.filter((order: DhanOrder) => 
      order.orderStatus === 'TRADED'
    );
    const cancelled = orders.filter((order: DhanOrder) => 
      order.orderStatus === 'CANCELLED' || order.orderStatus === 'REJECTED'
    );
    const expired = orders.filter((order: DhanOrder) => 
      order.orderStatus === 'EXPIRED'
    );
    const others = orders.filter((order: DhanOrder) => 
      !['PENDING', 'PART_TRADED', 'TRADED', 'CANCELLED', 'REJECTED', 'EXPIRED'].includes(order.orderStatus)
    );

    return { active, completed, cancelled, expired, others };
  }, [orders]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
        refetch();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const OrderTable: React.FC<{ 
    orders: DhanOrder[], 
    title: string, 
    showActions?: boolean,
    bgColor?: string 
  }> = ({ 
    orders, 
    title, 
    showActions = false,
    bgColor = 'bg-white'
  }) => {
    if (!orders.length) {
      return (
        <div className={`${bgColor} rounded-lg shadow mb-6`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              {title}
              <span className="text-sm font-normal text-gray-500">(0)</span>
            </h3>
          </div>
          <div className="px-6 py-8 text-center text-gray-500">
            No {title.toLowerCase()} orders
          </div>
        </div>
      );
    }

    return (
      <div className={`${bgColor} rounded-lg shadow mb-6`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center justify-between">
            {title}
            <span className="text-sm font-normal text-gray-500">({orders.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr 
                  key={order.orderId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onOrderSelect?.(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.tradingSymbol || order.securityId}</span>
                      <span className="text-xs text-gray-400">{order.securityId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.transactionType}
                      </span>
                      <span className="text-xs text-gray-400">{order.orderType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.quantity}</span>
                      {order.filledQty > 0 && (
                        <span className="text-xs text-green-600">Filled: {order.filledQty}</span>
                      )}
                      {order.remainingQuantity > 0 && (
                        <span className="text-xs text-yellow-600">Remaining: {order.remainingQuantity}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">₹{order.price}</span>
                      {order.averageTradedPrice > 0 && (
                        <span className="text-xs text-blue-600">Avg: ₹{order.averageTradedPrice}</span>
                      )}
                      {order.triggerPrice > 0 && (
                        <span className="text-xs text-orange-600">Trigger: ₹{order.triggerPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrderModify?.(order);
                          }}
                          className="text-green-600 hover:text-green-900 font-medium"
                          title="Edit Order"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.orderId);
                          }}
                          disabled={cancelOrderMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message="Failed to load orders" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with filters and actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Orders</option>
            <option value="active">Active Orders</option>
            <option value="completed">Completed Orders</option>
            <option value="cancelled">Cancelled/Rejected</option>
          </select>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Order Tables */}
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {(statusFilter === 'all' || statusFilter === 'active') && (
            <OrderTable 
              orders={categorizedOrders.active} 
              title="Active Orders" 
              showActions={true}
              bgColor="bg-white border-l-4 border-l-green-500"
            />
          )}

          {(statusFilter === 'all' || statusFilter === 'completed') && (
            <OrderTable 
              orders={categorizedOrders.completed} 
              title="Completed Orders"
              bgColor="bg-green-50"
            />
          )}

          {(statusFilter === 'all' || statusFilter === 'cancelled') && (
            <OrderTable 
              orders={categorizedOrders.cancelled} 
              title="Cancelled/Rejected Orders"
              bgColor="bg-red-50"
            />
          )}

          {statusFilter === 'all' && categorizedOrders.expired.length > 0 && (
            <OrderTable 
              orders={categorizedOrders.expired} 
              title="Expired Orders"
              bgColor="bg-yellow-50"
            />
          )}

          {statusFilter === 'all' && categorizedOrders.others.length > 0 && (
            <OrderTable 
              orders={categorizedOrders.others} 
              title="Other Orders"
              bgColor="bg-gray-50"
            />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
            <button
              onClick={onCreateNew}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBook;
