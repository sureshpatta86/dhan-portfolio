'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  EyeIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useHoldings, usePositions } from '@/features/portfolio';
import type { DhanHolding, DhanPosition } from '@/features/portfolio/types';
import { LoadingSkeleton } from '@/lib/components/ui/LoadingStates';
import { useTradersControlStore } from '@/lib/store/tradersControl';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon: Icon }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                     changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
  const changeBg = changeType === 'positive' ? 'bg-green-50' : 
                  changeType === 'negative' ? 'bg-red-50' : 'bg-gray-50';
  const ChangeIcon = changeType === 'positive' ? ArrowTrendingUpIcon : 
                    changeType === 'negative' ? ArrowTrendingDownIcon : ClockIcon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className={`flex items-center mt-4 px-2 py-1 rounded-full ${changeBg} w-fit`}>
        <ChangeIcon className={`h-4 w-4 ${changeColor} mr-1`} />
        <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
      </div>
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
  badge?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick,
  badge 
}) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-[1.02] text-left w-full"
    >
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {badge}
          </span>
        </div>
      )}
      <div className={`p-3 ${color} rounded-lg w-fit mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
};

interface DashboardHomeProps {
  onNavigate: (path: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { data: holdings = [], isLoading: holdingsLoading } = useHoldings();
  const { data: positions = [], isLoading: positionsLoading } = usePositions();
  const { killSwitchStatus } = useTradersControlStore();

  const isLoading = holdingsLoading || positionsLoading;

  // Show loading state if data is still being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        {/* Welcome Header Loading */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white bg-opacity-20 rounded w-96 mb-2"></div>
            <div className="h-6 bg-white bg-opacity-20 rounded w-80"></div>
            <div className="mt-6">
              <div className="h-4 bg-white bg-opacity-20 rounded w-64"></div>
            </div>
          </div>
        </div>

        {/* Stats Loading */}
        <div>
          <div className="animate-pulse mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <LoadingSkeleton type="stats" />
        </div>

        {/* Quick Actions Loading */}
        <div>
          <div className="animate-pulse mb-6">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Loading */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate portfolio stats
  const totalHoldingsValue = holdings.reduce((sum: number, holding: DhanHolding) => 
    sum + (holding.totalQty * holding.avgCostPrice), 0
  );
  
  const totalUnrealizedPnL = positions.reduce((sum: number, position: DhanPosition) => 
    sum + position.unrealizedProfit, 0
  );
  
  const totalRealizedPnL = positions.reduce((sum: number, position: DhanPosition) => 
    sum + position.realizedProfit, 0
  );

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `₹${totalHoldingsValue.toLocaleString('en-IN')}`,
      change: '+2.4% today',
      changeType: 'positive' as const,
      icon: BanknotesIcon
    },
    {
      title: 'Total Holdings',
      value: holdings.length.toString(),
      change: `${holdings.length} stocks`,
      changeType: 'neutral' as const,
      icon: ChartBarIcon
    },
    {
      title: 'Active Positions',
      value: positions.length.toString(),
      change: `${positions.filter((p: DhanPosition) => p.positionType === 'LONG').length} long`,
      changeType: 'neutral' as const,
      icon: ArrowTrendingUpIcon
    },
    {
      title: 'Unrealized P&L',
      value: `₹${totalUnrealizedPnL.toLocaleString('en-IN')}`,
      change: totalUnrealizedPnL >= 0 ? '+0.8%' : '-0.8%',
      changeType: totalUnrealizedPnL >= 0 ? 'positive' as const : 'negative' as const,
      icon: ChartBarIcon
    }
  ];

  const quickActions = [
    {
      title: 'View Holdings',
      description: 'Check your long-term investment portfolio',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      onClick: () => onNavigate('/portfolio/holdings')
    },
    {
      title: 'Active Positions',
      description: 'Monitor your current trading positions',
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-500',
      onClick: () => onNavigate('/portfolio/positions')
    },
    {
      title: 'Funds',
      description: 'Manage your trading funds and account balance',
      icon: BanknotesIcon,
      color: 'bg-emerald-500',
      onClick: () => onNavigate('/funds')
    },
    {
      title: 'Account Statements',
      description: 'View ledger and trade history reports',
      icon: DocumentTextIcon,
      color: 'bg-indigo-500',
      onClick: () => onNavigate('/reports/statements')
    },
    {
      title: "Trader's Control",
      description: 'Risk management and kill switch controls',
      icon: ShieldCheckIcon,
      color: killSwitchStatus.isActive ? 'bg-red-500' : 'bg-purple-500',
      onClick: () => onNavigate('/tools/traders-control'),
      badge: killSwitchStatus.isActive ? 'ACTIVE' : undefined
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to DhanHQ Portfolio</h1>
            <p className="text-blue-100 text-lg">
              Track your investments, analyze performance, and make informed decisions
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <ChartBarIcon className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center text-blue-100">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm">Market is open • Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {holdings.slice(0, 3).map((holding: DhanHolding, index: number) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-sm">
                    {holding.tradingSymbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{holding.tradingSymbol}</p>
                  <p className="text-sm text-gray-500">{holding.totalQty} shares</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{holding.avgCostPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{holding.exchange}</p>
              </div>
            </div>
          ))}
          
          {holdings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Your trades and transactions will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Status Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          <div>
            <p className="text-green-800 font-medium">Market is Open</p>
            <p className="text-green-600 text-sm">NSE & BSE are currently active for trading</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
