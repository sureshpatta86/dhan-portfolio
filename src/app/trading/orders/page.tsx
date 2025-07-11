/**
 * Trading Orders Page
 */

'use client';

import React, { useState } from 'react';
import { OrdersDashboard } from '@/components/features/dashboard/OrdersDashboard';
import { OrderBook } from '@/components/features/orders/OrderBook';
import { OrderForm } from '@/components/features/orders/forms/OrderForm';
import { EditOrderForm } from '@/components/features/orders/forms/EditOrderForm';
import type { DhanOrder } from '@/features/trading/types';

type TabType = 'dashboard' | 'book' | 'place' | 'modify';

export default function TradingOrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [editingOrder, setEditingOrder] = useState<DhanOrder | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleCreateNewOrder = () => {
    setActiveTab('place');
  };

  const handleViewAllOrders = () => {
    setActiveTab('book');
  };

  const handleOrderEdit = (order: DhanOrder) => {
    setEditingOrder(order);
    setIsEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
    setEditingOrder(null);
  };

  const handleEditFormSuccess = () => {
    setIsEditFormOpen(false);
    setEditingOrder(null);
    // Refresh data - this will happen automatically via React Query
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: '📊' },
    { id: 'book' as TabType, label: 'Order Book', icon: '📖' },
    { id: 'place' as TabType, label: 'Place Order', icon: '➕' },
    { id: 'modify' as TabType, label: 'Modify Orders', icon: '✏️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OrdersDashboard 
            onCreateNew={handleCreateNewOrder}
            onViewAll={handleViewAllOrders}
          />
        );
      case 'book':
        return (
          <OrderBook 
            onOrderSelect={(order) => console.log('Selected order:', order)}
            onOrderModify={handleOrderEdit}
            onCreateNew={handleCreateNewOrder}
          />
        );
      case 'place':
        return (
          <OrderForm 
            onOrderPlaced={() => {
              // Optionally switch to dashboard or book after placing order
              setActiveTab('dashboard');
            }}
          />
        );
      case 'modify':
        return (
          <OrderBook 
            onOrderSelect={(order) => console.log('Selected order:', order)}
            onOrderModify={handleOrderEdit}
            onCreateNew={handleCreateNewOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trading Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage your orders, place new trades, and monitor order status
        </p>
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
                  ? 'border-blue-500 text-blue-600'
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
      <EditOrderForm
        order={editingOrder}
        isOpen={isEditFormOpen}
        onCloseAction={handleEditFormClose}
        onSuccessAction={handleEditFormSuccess}
      />
    </div>
  );
}
