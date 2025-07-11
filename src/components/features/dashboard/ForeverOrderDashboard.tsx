/**
 * Forever Order Dashboard Component
 * 
 * Provides a quick overview and stats for forever orders
 */

'use client';

import React from 'react';
import { useForeverOrderBook } from '@/features/trading/hooks';
import type { DhanForeverOrder } from '@/features/trading/types';

interface ForeverOrderDashboardProps {
  onCreateNew?: () => void;
  onViewAll?: () => void;
}

export const ForeverOrderDashboard: React.FC<ForeverOrderDashboardProps> = ({ 
  onCreateNew, 
  onViewAll 
}) => {
  const { data: foreverOrders, isLoading, error } = useForeverOrderBook();

  const getOrderStats = () => {
    if (!foreverOrders || foreverOrders.length === 0) {
      return {
        total: 0,
        pending: 0,
        confirm: 0,
        cancelled: 0,
        rejected: 0,
        traded: 0,
        single: 0,
        oco: 0
      };
    }

    return {
      total: foreverOrders.length,
      pending: foreverOrders.filter((order: DhanForeverOrder) => order.orderStatus === 'PENDING').length,
      confirm: foreverOrders.filter((order: DhanForeverOrder) => order.orderStatus === 'CONFIRM').length,
      cancelled: foreverOrders.filter((order: DhanForeverOrder) => order.orderStatus === 'CANCELLED').length,
      rejected: foreverOrders.filter((order: DhanForeverOrder) => order.orderStatus === 'REJECTED').length,
      traded: foreverOrders.filter((order: DhanForeverOrder) => order.orderStatus === 'TRADED').length,
      single: foreverOrders.filter((order: DhanForeverOrder) => order.orderType === 'SINGLE').length,
      oco: foreverOrders.filter((order: DhanForeverOrder) => order.orderType === 'OCO').length
    };
  };

  const getRecentOrders = (): DhanForeverOrder[] => {
    if (!foreverOrders || foreverOrders.length === 0) return [];
    
    return foreverOrders
      .sort((a: DhanForeverOrder, b: DhanForeverOrder) => 
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )
      .slice(0, 5);
  };

  const getActiveOrdersValue = () => {
    if (!foreverOrders || foreverOrders.length === 0) return 0;
    
    return foreverOrders
      .filter((order: DhanForeverOrder) => 
        order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRM'
      )
      .reduce((sum: number, order: DhanForeverOrder) => {
        return sum + (order.price * order.quantity);
      }, 0);
  };

  const stats = getOrderStats();
  const recentOrders = getRecentOrders();
  const activeOrdersValue = getActiveOrdersValue();

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
    const isFeatureNotAvailable = error.message?.includes('not available') || error.message?.includes('404');
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className={`w-16 h-16 ${isFeatureNotAvailable ? 'bg-blue-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isFeatureNotAvailable ? (
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isFeatureNotAvailable ? 'Forever Orders Feature Not Available' : 'Unable to Load Forever Orders'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isFeatureNotAvailable 
              ? 'Forever Orders are not enabled for your Dhan account. Please contact Dhan support to enable this feature.'
              : error.message
            }
          </p>
          {!isFeatureNotAvailable && onCreateNew && (
            <button
              onClick={onCreateNew}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Place New Forever Order
            </button>
          )}
          {isFeatureNotAvailable && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>What are Forever Orders?</strong><br />
                Forever Orders are advanced order types that remain active until executed or manually cancelled, 
                even across multiple trading sessions. They're ideal for long-term strategies and capturing specific price targets.
              </p>
            </div>
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
          <h2 className="text-xl font-semibold text-gray-900">Forever Orders Overview</h2>
          <div className="flex items-center space-x-3">
            {onViewAll && stats.total > 0 && (
              <button
                onClick={onViewAll}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View All ({stats.total})
              </button>
            )}
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Forever Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Confirmed</p>
                <p className="text-2xl font-semibold text-blue-900">{stats.confirm}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Executed</p>
                <p className="text-2xl font-semibold text-green-900">{stats.traded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Types Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Single Orders</p>
                <p className="text-xl font-semibold text-purple-900">{stats.single}</p>
              </div>
              <div className="text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">OCO Orders</p>
                <p className="text-xl font-semibold text-indigo-900">{stats.oco}</p>
              </div>
              <div className="text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Active Value</p>
                <p className="text-xl font-semibold text-pink-900">₹{activeOrdersValue.toLocaleString()}</p>
              </div>
              <div className="text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Forever Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.orderId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">{order.tradingSymbol}</div>
                        <div className="text-sm text-gray-500">
                          {order.transactionType} {order.quantity} @ ₹{order.price} | Trigger: ₹{order.triggerPrice}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {order.orderType} • {order.legName}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Forever Orders Yet</h3>
            <p className="text-gray-500 mb-4">
              Start with long-term investment strategies by placing your first forever order.
            </p>
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Your First Forever Order</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForeverOrderDashboard;
