/**
 * Super Order Page - Advanced order management with entry, target, and stop loss
 */

'use client';

import React, { useState } from 'react';
import { SuperOrderForm } from '@/components/forms/SuperOrderForm';
import { ModifySuperOrderForm } from '@/components/forms/ModifySuperOrderForm';
import { SuperOrderBook } from '@/components/SuperOrderBook';
import { SuperOrderDashboard } from '@/components/SuperOrderDashboard';
import type { DhanSuperOrder } from '@/features/trading/types';

const SuperOrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'place' | 'book' | 'modify'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<DhanSuperOrder | null>(null);
  const [orderToModify, setOrderToModify] = useState<DhanSuperOrder | null>(null);

  const handleOrderPlaced = (orderId: string) => {
    // Switch to dashboard to show overview
    setActiveTab('dashboard');
  };

  const handleOrderSelect = (order: DhanSuperOrder) => {
    setSelectedOrder(order);
  };

  const handleOrderModify = (order: DhanSuperOrder) => {
    setOrderToModify(order);
    setActiveTab('modify');
  };

  const handleModifySuccess = () => {
    setOrderToModify(null);
    setActiveTab('dashboard');
  };

  const handleModifyCancel = () => {
    setOrderToModify(null);
    setActiveTab('dashboard');
  };

  const handleOrderCancelled = () => {
    setOrderToModify(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Quick Action Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Order</h1>
            <p className="text-gray-600 mt-2">
              Advanced order management with intelligent execution - Entry, Target, and Stop Loss in one order
            </p>
          </div>
          <button
            onClick={() => setActiveTab('place')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Super Order</span>
          </button>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Entry + Target + SL</h3>
            </div>
            <p className="text-gray-600">
              Place entry order with pre-defined target and stop loss levels in a single order.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Trailing Stop Loss</h3>
            </div>
            <p className="text-gray-600">
              Automatically adjust stop loss as the market moves in your favor with trailing jumps.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Risk Management</h3>
            </div>
            <p className="text-gray-600">
              Pre-defined risk management with automatic execution based on market conditions.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'book'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Order Book
              </button>
              <button
                onClick={() => setActiveTab('place')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'place'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Place Order
              </button>
              {activeTab === 'modify' && orderToModify && (
                <button
                  className="py-4 px-6 text-sm font-medium border-b-2 border-orange-500 text-orange-600"
                >
                  Modify: {orderToModify.tradingSymbol}
                </button>
              )}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <SuperOrderDashboard 
                onCreateNew={() => setActiveTab('place')}
                onViewAll={() => setActiveTab('book')}
              />
            )}

            {activeTab === 'book' && (
              <SuperOrderBook 
                onOrderSelect={handleOrderSelect} 
                onOrderModify={handleOrderModify}
                onCreateNew={() => setActiveTab('place')}
              />
            )}
            
            {activeTab === 'place' && (
              <SuperOrderForm 
                onSuccess={handleOrderPlaced}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'modify' && orderToModify && (
              <ModifySuperOrderForm
                order={orderToModify}
                onSuccess={handleModifySuccess}
                onCancel={handleModifyCancel}
                onOrderCancelled={handleOrderCancelled}
                onCreateNew={() => setActiveTab('place')}
              />
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Super Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trading Symbol</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedOrder.tradingSymbol}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order ID</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedOrder.orderId}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          selectedOrder.orderStatus === 'TRADED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedOrder.orderStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedOrder.transactionType} {selectedOrder.quantity}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entry Price</label>
                      <div className="mt-1 text-sm text-gray-900">₹{selectedOrder.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LTP</label>
                      <div className="mt-1 text-sm text-gray-900">₹{selectedOrder.ltp.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Remaining Quantity</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedOrder.remainingQuantity}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Filled Quantity</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedOrder.filledQty}</div>
                    </div>
                  </div>

                  {selectedOrder.legDetails && selectedOrder.legDetails.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Order Legs</h3>
                      <div className="space-y-3">
                        {selectedOrder.legDetails.map((leg, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Leg Name</label>
                                <div className="text-sm font-medium">{leg.legName.replace('_', ' ')}</div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Status</label>
                                <div className="text-sm font-medium">{leg.orderStatus}</div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Price</label>
                                <div className="text-sm font-medium">₹{leg.price.toFixed(2)}</div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500">Remaining Qty</label>
                                <div className="text-sm font-medium">{leg.remainingQuantity}</div>
                              </div>
                              {leg.trailingJump > 0 && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-500">Trailing Jump</label>
                                  <div className="text-sm font-medium">₹{leg.trailingJump.toFixed(2)}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Created</label>
                        <div>{new Date(selectedOrder.createTime).toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Updated</label>
                        <div>{new Date(selectedOrder.updateTime).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Super Order Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Super Orders allow you to place complex trading strategies with predefined entry, 
                  target, and stop loss levels. Once the entry order is executed, the target and 
                  stop loss orders are automatically activated.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Entry leg executes your main buy/sell order</li>
                  <li>Target leg automatically sells when your profit target is reached</li>
                  <li>Stop loss leg protects you from excessive losses</li>
                  <li>Trailing stop loss can lock in profits as the market moves favorably</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperOrderPage;
