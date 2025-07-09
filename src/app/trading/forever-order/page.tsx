/**
 * Forever Order Page - Long-term order management
 */

'use client';

import React from 'react';

const ForeverOrderPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forever Order</h1>
          <p className="text-gray-600 mt-2">Long-term orders that persist across market sessions</p>
        </div>

        {/* Beta Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-purple-900">Beta Feature</h3>
              <p className="text-purple-700 mt-1">
                Forever Orders allow you to place long-term orders that remain active across multiple 
                trading sessions until executed or manually cancelled.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Persistent Orders</h3>
            </div>
            <p className="text-gray-600 mb-4">Orders that remain active across multiple trading sessions without daily re-entry.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Good Till Cancelled (GTC)</li>
              <li>• Good Till Date (GTD)</li>
              <li>• Fill or Kill (FOK)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5 5 5-5 5-5-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Smart Triggers</h3>
            </div>
            <p className="text-gray-600 mb-4">Advanced trigger conditions for automated order execution.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Price-based triggers</li>
              <li>• Volume-based conditions</li>
              <li>• Technical indicator triggers</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Order Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Comprehensive tools to manage long-term orders effectively.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Order modification</li>
              <li>• Partial execution tracking</li>
              <li>• Performance analytics</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 4.343l.707-.707m12.728 0l.707.707m-6.364 17.657l-.707.707m-12.728 0l-.707-.707M16 8a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Risk Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Built-in safeguards for long-term order strategies.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Position size limits</li>
              <li>• Stop-loss integration</li>
              <li>• Exposure monitoring</li>
            </ul>
          </div>
        </div>

        {/* Forever Order Types */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forever Order Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Target Price Orders</h4>
              <p className="text-sm text-gray-600">Execute when your target price is reached, regardless of when it happens.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Accumulation Orders</h4>
              <p className="text-sm text-gray-600">Gradually build positions over time with systematic buying/selling.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Conditional Orders</h4>
              <p className="text-sm text-gray-600">Complex orders triggered by multiple market conditions and events.</p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Forever Order Interface</h3>
          <p className="text-gray-600 mb-6">
            The Forever Order feature is currently in beta development. This will enable you to place 
            persistent orders that work around the clock to capture your target opportunities.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Join Beta Program
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeverOrderPage;
