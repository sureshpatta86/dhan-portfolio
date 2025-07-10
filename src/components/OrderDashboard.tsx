/**
 * Order Dashboard Component
 * 
 * Provides a quick overview and stats for orders
 */

'use client';

import React from 'react';
import { useOrderBook } from '@/features/trading/hooks';
import type { DhanOrder } from '@/features/trading/types';

interface OrderDashboardProps {
  onCreateNew?: () => void;
  onViewAll?: () => void;
}

export const OrderDashboard: React.FC<OrderDashboardProps> = ({ 
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
        rejected: 0
      };
    }

    return {
      total: orders.length,
      pending: orders.filter((order: DhanOrder) => order.orderStatus === 'PENDING').length,
      traded: orders.filter((order: DhanOrder) => order.orderStatus === 'TRADED').length,
      cancelled: orders.filter((order: DhanOrder) => order.orderStatus === 'CANCELLED').length,
      rejected: orders.filter((order: DhanOrder) => order.orderStatus === 'REJECTED').length
    };
  };

  const getRecentOrders = (): DhanOrder[] => {
    if (!orders || orders.length === 0) return [];
    
    return orders
      .sort((a: DhanOrder, b: DhanOrder) => new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime())
      .slice(0, 3);
  };

  const stats = getOrderStats();
  const recentOrders = getRecentOrders();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-48 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600">
            Unable to load order information. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Executed</p>
              <p className="text-2xl font-bold text-green-900">{stats.traded}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={onCreateNew}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>➕</span>
              <span>Place New Order</span>
            </button>
            <button
              onClick={onViewAll}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>View All Orders</span>
            </button>
          </div>
        </div>

        {/* Market Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">NSE</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">BSE</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">MCX</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Orders Placed</span>
              <span className="text-sm font-semibold text-gray-900">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {stats.total > 0 ? Math.round((stats.traded / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Orders</span>
              <span className="text-sm font-semibold text-blue-600">{stats.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            {orders && orders.length > 3 && (
              <button
                onClick={onViewAll}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            )}
          </div>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.tradingSymbol || order.securityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.orderStatus === 'TRADED' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-gray-400 mb-2">📋</div>
            <p>No recent orders found</p>
            <p className="text-sm">Your recent orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
