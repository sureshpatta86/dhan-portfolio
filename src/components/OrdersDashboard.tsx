/**
 * Orders Dashboard Component
 * 
 * Provides a quick overview and stats for regular orders
 */

'use client';

import React from 'react';
import { useOrderBook } from '@/features/trading/hooks';
import type { DhanOrder } from '@/features/trading/types';

interface OrdersDashboardProps {
  onCreateNew?: () => void;
  onViewAll?: () => void;
}

export const OrdersDashboard: React.FC<OrdersDashboardProps> = ({ 
  onCreateNew, 
  onViewAll 
}) => {
  const { data: orders, isLoading, error } = useOrderBook();

  const getOrderStats = () => {
    if (!orders || orders.length === 0) {
      return {
        total: 0,
        pending: 0,
        traded: 0,
        cancelled: 0,
        rejected: 0,
        partTraded: 0
      };
    }

    return {
      total: orders.length,
      pending: orders.filter((order: DhanOrder) => order.orderStatus === 'PENDING').length,
      traded: orders.filter((order: DhanOrder) => order.orderStatus === 'TRADED').length,
      cancelled: orders.filter((order: DhanOrder) => order.orderStatus === 'CANCELLED').length,
      rejected: orders.filter((order: DhanOrder) => order.orderStatus === 'REJECTED').length,
      partTraded: orders.filter((order: DhanOrder) => order.orderStatus === 'PART_TRADED').length
    };
  };

  const getRecentOrders = (): DhanOrder[] => {
    if (!orders || orders.length === 0) return [];
    
    return orders
      .sort((a: DhanOrder, b: DhanOrder) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .slice(0, 5);
  };

  const getTodaysPnL = () => {
    if (!orders || orders.length === 0) return { realizedPnL: 0, orderValue: 0 };
    
    const today = new Date().toDateString();
    const todaysOrders = orders.filter((order: DhanOrder) => 
      new Date(order.createTime).toDateString() === today
    );
    
    const orderValue = todaysOrders.reduce((sum: number, order: DhanOrder) => {
      if (order.orderStatus === 'TRADED') {
        return sum + (order.price * order.quantity);
      }
      return sum;
    }, 0);

    return { realizedPnL: 0, orderValue }; // PnL would need trade data
  };

  const stats = getOrderStats();
  const recentOrders = getRecentOrders();
  const { orderValue } = getTodaysPnL();

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Orders</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Place New Order
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Orders Overview</h2>
          <div className="flex items-center space-x-3">
            {onViewAll && stats.total > 0 && (
              <button
                onClick={onViewAll}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All ({stats.total})
              </button>
            )}
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Place Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Executed</p>
                <p className="text-2xl font-semibold text-green-900">{stats.traded}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Partial</p>
                <p className="text-2xl font-semibold text-blue-900">{stats.partTraded}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Cancelled/Rejected</p>
                <p className="text-2xl font-semibold text-red-900">{stats.cancelled + stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Trading Summary */}
        {orderValue > 0 && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900 mb-2">Today's Trading</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Total Order Value</p>
                <p className="text-xl font-semibold text-purple-900">₹{orderValue.toLocaleString()}</p>
              </div>
              <div className="text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.orderId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">{order.tradingSymbol}</div>
                        <div className="text-sm text-gray-500">
                          {order.transactionType} {order.quantity} @ ₹{order.price?.toFixed(2) || 'Market'}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {order.productType} • {order.orderType}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-4">
              Start trading by placing your first order. Choose from market, limit, or advanced order types.
            </p>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Place Your First Order</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
