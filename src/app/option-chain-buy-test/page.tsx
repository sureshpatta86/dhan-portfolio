'use client';

import React from 'react';
import OptionChain from '@/components/features/options/OptionChain';
import OptionChainAdvanced from '@/components/features/options/OptionChainAdvanced';

export default function OptionChainWithBuyButtonsTest() {
  const [activeTab, setActiveTab] = React.useState<'basic' | 'advanced'>('basic');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Option Chain with Buy Buttons - Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page demonstrates the new buy button functionality in option chains. 
            Click any "Buy" button to open the order placement modal.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Option Chain
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced Option Chain
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'basic' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Option Chain with Buy Buttons
              </h2>
              <OptionChain />
            </div>
          )}
          {activeTab === 'advanced' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Advanced Option Chain with Buy Buttons
              </h2>
              <OptionChainAdvanced />
            </div>
          )}
        </div>

        {/* Feature Description */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            New Features Added:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Buy buttons added to each Call and Put option in the option chain</li>
            <li>Clicking a buy button opens a comprehensive order placement modal</li>
            <li>Order modal supports multiple order types: Market, Limit, Stop Loss, Stop Loss Market</li>
            <li>Product types available: CNC (Delivery), Intraday, Margin</li>
            <li>Real-time option data displayed in the modal including LTP, IV, Bid/Ask prices</li>
            <li>Order summary with estimated total cost calculation</li>
            <li>Proper validation for quantities, prices, and trigger prices</li>
            <li>Integration with existing trading hooks and toast notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
