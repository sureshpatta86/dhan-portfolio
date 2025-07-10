'use client';

import React, { useState } from 'react';
import { 
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  CreditCardIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useFunds } from '@/features/trading';
import { useToast } from '@/lib/components/ui/ToastProvider';
import { LoadingSkeleton } from '@/lib/components/ui/LoadingStates';

interface FundsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  description?: string;
  alert?: 'warning' | 'success' | 'info';
}

const FundsCard: React.FC<FundsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description,
  alert 
}) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                     changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
  const changeBg = changeType === 'positive' ? 'bg-green-50' : 
                  changeType === 'negative' ? 'bg-red-50' : 'bg-gray-50';
  const ChangeIcon = changeType === 'positive' ? ArrowTrendingUpIcon : 
                    changeType === 'negative' ? ArrowTrendingDownIcon : ClockIcon;

  const alertColors = {
    warning: 'border-yellow-200 bg-yellow-50',
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const alertIcons = {
    warning: ExclamationTriangleIcon,
    success: CheckCircleIcon,
    info: InformationCircleIcon
  };

  const AlertIcon = alert ? alertIcons[alert] : null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${alert ? alertColors[alert] : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {AlertIcon && <AlertIcon className="h-4 w-4 ml-2 text-yellow-500" />}
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      {change && (
        <div className={`flex items-center mt-4 px-2 py-1 rounded-full ${changeBg} w-fit`}>
          <ChangeIcon className={`h-4 w-4 ${changeColor} mr-1`} />
          <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
        </div>
      )}
    </div>
  );
};

const FundsSummary = ({ funds }: { funds: any }) => {
  const totalBalance = funds.availabelBalance + funds.collateralAmount;
  const marginUtilizationPercent = funds.sodLimit > 0 ? (funds.utilizedAmount / funds.sodLimit) * 100 : 0;
  
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white mb-6">
      <h2 className="text-2xl font-bold mb-4">Funds Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-green-100">Available Balance</p>
          <p className="text-3xl font-bold">₹{funds.availabelBalance.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-green-100">SOD Limit</p>
          <p className="text-3xl font-bold">₹{funds.sodLimit.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-green-100">Withdrawable Balance</p>
          <p className="text-3xl font-bold">₹{funds.withdrawableBalance.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {/* Margin Utilization Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-green-100">Fund Utilization</p>
          <p className="text-green-100">{marginUtilizationPercent.toFixed(1)}%</p>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300" 
            style={{ width: `${Math.min(marginUtilizationPercent, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const { addToast } = useToast();

  const handleAddFunds = () => {
    addToast({
      type: 'info',
      title: 'Add Funds',
      message: 'Redirecting to bank transfer page...',
    });
  };

  const handleWithdrawFunds = () => {
    addToast({
      type: 'info',
      title: 'Withdraw Funds',
      message: 'Redirecting to withdrawal page...',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleAddFunds}
          className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium text-green-700">Add Funds</span>
        </button>
        <button
          onClick={handleWithdrawFunds}
          className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ArrowTrendingDownIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-700">Withdraw Funds</span>
        </button>
      </div>
    </div>
  );
};

export default function Funds() {
  const { data: fundsData, isLoading, error, refetch } = useFunds();
  const { addToast } = useToast();
  const [showSensitive, setShowSensitive] = useState(true);

  // Debug logging
  console.log('Funds component rendering - isLoading:', isLoading);
  console.log('Funds component rendering - error:', error);
  console.log('Funds component rendering - fundsData:', fundsData);

  const funds = fundsData || {
    dhanClientId: "",
    availabelBalance: 0,
    sodLimit: 0,
    collateralAmount: 0,
    receiveableAmount: 0,
    utilizedAmount: 0,
    blockedPayoutAmount: 0,
    withdrawableBalance: 0
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      addToast({
        type: 'success',
        title: 'Funds Refreshed',
        message: 'Your funds data has been updated successfully.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh funds data. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load funds data</h3>
          <p className="text-gray-500 mb-4">
            There was an error fetching your funds information. Please try again.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const fundsCards = [
    {
      title: 'Available Balance',
      value: showSensitive ? `₹${funds.availabelBalance.toLocaleString('en-IN')}` : '₹••••••',
      icon: BanknotesIcon,
      description: 'Ready to trade',
      changeType: 'positive' as const
    },
    {
      title: 'SOD Limit',
      value: showSensitive ? `₹${funds.sodLimit.toLocaleString('en-IN')}` : '₹••••••',
      icon: ChartBarIcon,
      description: 'Start of day limit',
      changeType: 'neutral' as const
    },
    {
      title: 'Withdrawable Balance',
      value: showSensitive ? `₹${funds.withdrawableBalance.toLocaleString('en-IN')}` : '₹••••••',
      icon: ArrowTrendingUpIcon,
      description: 'Available for withdrawal',
      changeType: 'positive' as const
    },
    {
      title: 'Utilized Amount',
      value: showSensitive ? `₹${funds.utilizedAmount.toLocaleString('en-IN')}` : '₹••••••',
      icon: CreditCardIcon,
      description: 'Currently utilized',
      changeType: 'negative' as const,
      alert: funds.utilizedAmount > funds.sodLimit * 0.8 ? 'warning' as const : undefined
    },
    {
      title: 'Collateral Amount',
      value: showSensitive ? `₹${funds.collateralAmount.toLocaleString('en-IN')}` : '₹••••••',
      icon: ArrowTrendingUpIcon,
      description: 'Collateral value',
      changeType: 'positive' as const
    },
    {
      title: 'Receivable Amount',
      value: showSensitive ? `₹${funds.receiveableAmount.toLocaleString('en-IN')}` : '₹••••••',
      icon: ClockIcon,
      description: 'Amount to be received',
      changeType: 'neutral' as const
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Funds</h1>
          <p className="text-gray-600">Manage your trading funds and account balance</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showSensitive ? (
              <EyeSlashIcon className="h-4 w-4 mr-2" />
            ) : (
              <EyeIcon className="h-4 w-4 mr-2" />
            )}
            {showSensitive ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <FundsSummary funds={funds} />
      <QuickActions />

      {/* Detailed Fund Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {fundsCards.map((card, index) => (
          <FundsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
            changeType={card.changeType}
            alert={card.alert}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Limits & Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">SOD Limit</span>
                <span className="font-medium">₹{funds.sodLimit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Balance</span>
                <span className="font-medium">₹{funds.availabelBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Collateral Amount</span>
                <span className="font-medium">₹{funds.collateralAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Utilized Amount</span>
                <span className="font-medium">₹{funds.utilizedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receivable Amount</span>
                <span className="font-medium">₹{funds.receiveableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blocked Payout</span>
                <span className="font-medium">₹{funds.blockedPayoutAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
