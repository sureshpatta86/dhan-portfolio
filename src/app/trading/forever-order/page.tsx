/**
 * Forever Order Page - Long-term order management
 */

'use client';

import React, { useState } from 'react';
import { ForeverOrderForm } from '@/components/forms/ForeverOrderForm';
import { ForeverOrderEditForm } from '@/components/forms/ForeverOrderEditForm';
import { ForeverOrderBook } from '@/components/ForeverOrderBook';
import { ForeverOrderDashboard } from '@/components/ForeverOrderDashboard';
import type { DhanForeverOrder } from '@/features/trading/types';

const ForeverOrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'place' | 'book'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<DhanForeverOrder | null>(null);
  const [orderToModify, setOrderToModify] = useState<DhanForeverOrder | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleOrderPlaced = () => {
    // Switch to dashboard to show overview
    setActiveTab('dashboard');
  };

  const handleOrderSelect = (order: DhanForeverOrder) => {
    setSelectedOrder(order);
  };

  const handleOrderModify = (order: DhanForeverOrder) => {
    setOrderToModify(order);
    setIsEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setOrderToModify(null);
    setIsEditFormOpen(false);
  };

  const handleEditFormSuccess = () => {
    setOrderToModify(null);
    setIsEditFormOpen(false);
    setActiveTab('dashboard');
  };

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview and analytics'
    },
    {
      id: 'place' as const,
      label: 'Place Order',
      icon: '➕',
      description: 'Create new forever order'
    },
    {
      id: 'book' as const,
      label: 'Order Book',
      icon: '📋',
      description: 'Manage existing orders'
    }
  ];

  const renderTabContent = () => {    
    try {
      switch (activeTab) {
        case 'dashboard':
          return (
            <ForeverOrderDashboard 
              onCreateNew={() => setActiveTab('place')}
              onViewAll={() => setActiveTab('book')}
            />
          );
        case 'place':
          return <ForeverOrderForm onOrderPlaced={handleOrderPlaced} />;
        case 'book':
          return (
            <ForeverOrderBook 
              onOrderSelect={handleOrderSelect}
              onOrderModify={handleOrderModify}
              onCreateNew={() => setActiveTab('place')}
            />
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Error Loading Component</h3>
          <p className="text-red-600 mt-2">There was an error loading the Forever Order components.</p>
          <pre className="mt-2 text-sm text-red-500">{String(error)}</pre>
        </div>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Quick Action Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forever Order</h1>
            <p className="text-gray-600 mt-2">
              Long-term orders that persist across market sessions until executed or cancelled
            </p>
          </div>
          <button
            onClick={() => setActiveTab('place')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Forever Order</span>
          </button>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Persistent Orders</h3>
            </div>
            <p className="text-gray-600">
              Orders that remain active across multiple trading sessions without daily re-entry.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">OCO Orders</h3>
            </div>
            <p className="text-gray-600">
              One-Cancels-Other orders for advanced trading strategies with multiple conditions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5 5 5-5 5-5-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Smart Management</h3>
            </div>
            <p className="text-gray-600">
              Comprehensive tools to modify, cancel, and track long-term order performance.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* Edit Order Modal */}
        <ForeverOrderEditForm
          order={orderToModify}
          isOpen={isEditFormOpen}
          onCloseAction={handleEditFormClose}
          onSuccessAction={handleEditFormSuccess}
        />
      </div>
    </div>
  );
};

export default ForeverOrderPage;
