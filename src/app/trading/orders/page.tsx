/**
 * Trading Orders Page
 */

'use client';

import React from 'react';
import Orders from '@/components/Orders';

export default function TradingOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trading Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage your orders, place new trades, and monitor order status
        </p>
      </div>
      
      <Orders />
    </div>
  );
}
