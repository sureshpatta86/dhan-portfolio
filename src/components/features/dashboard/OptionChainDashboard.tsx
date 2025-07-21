'use client';

import React, { useState } from 'react';
import OptionChain from '../options/OptionChain';
import OptionChainAdvanced from '../options/OptionChainAdvanced';

export default function OptionChainDashboard() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'analyzer'>('advanced');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          
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
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Option Chain
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analyzer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Option Analyzer
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'advanced' && <OptionChainAdvanced />}
        {activeTab === 'basic' && <OptionChain />}
        {activeTab === 'analyzer' && <OptionAnalyzer />}
      </div>
    </div>
  );
}

// Placeholder Option Analyzer component
function OptionAnalyzer() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Option Analyzer</h3>
        <p className="mt-1 text-sm text-gray-500">
          Advanced option analysis tools coming soon!
        </p>
        <div className="mt-4 text-xs text-gray-400">
          • Option Greeks Analysis<br />
          • Strategy Builder<br />
          • P&L Calculator<br />
          • Volatility Analysis
        </div>
      </div>
    </div>
  );
}
