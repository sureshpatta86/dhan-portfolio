'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldExclamationIcon,
  ShieldCheckIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTradersControlStore } from '@/lib/store/tradersControl';
import { useToast } from '@/lib/components/ui/ToastProvider';
import { usePositions } from '@/features/portfolio';
import type { DhanPosition } from '@/features/portfolio/types';
import Modal from '@/lib/components/ui/Modal';

const TradersControl: React.FC = () => {
  const { addToast } = useToast();
  const { data: positions = [] } = usePositions();

  const {
    settings,
    killSwitchStatus,
    dailyPnL,
    updateSettings,
    updateDailyPnL,
    activateKillSwitch,
    deactivateKillSwitch,
    resetDailyData,
    checkAndActivateKillSwitch
  } = useTradersControlStore();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [showKillSwitchModal, setShowKillSwitchModal] = useState(false);

  // Calculate daily P&L from positions
  useEffect(() => {
    if (positions.length > 0) {
      const totalRealizedPnL = positions.reduce((sum: number, pos: DhanPosition) => sum + pos.realizedProfit, 0);
      const totalUnrealizedPnL = positions.reduce((sum: number, pos: DhanPosition) => sum + pos.unrealizedProfit, 0);
      const totalDailyPnL = totalRealizedPnL + totalUnrealizedPnL;

      const pnlSummary = {
        totalRealizedPnL,
        totalUnrealizedPnL,
        totalDailyPnL,
        tradeCount: positions.length,
        lastUpdated: new Date().toISOString(),
      };

      updateDailyPnL(pnlSummary);
    }
  }, [positions, updateDailyPnL]);

  // Check for new day and reset if needed
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (settings.lastResetDate !== today) {
      resetDailyData();
      addToast({
        type: 'info',
        title: 'Daily Reset',
        message: 'Trader\'s control data has been reset for the new trading day.',
      });
    }
  }, [settings.lastResetDate, resetDailyData, addToast]);

  const handleManualKillSwitch = () => {
    if (killSwitchStatus.isActive) {
      setShowKillSwitchModal(true);
    } else {
      activateKillSwitch('Manually activated by trader');
      addToast({
        type: 'warning',
        title: 'Kill Switch Activated',
        message: 'Trading has been disabled manually.',
      });
    }
  };

  const handleDeactivateKillSwitch = () => {
    deactivateKillSwitch();
    setShowKillSwitchModal(false);
    addToast({
      type: 'success',
      title: 'Kill Switch Deactivated',
      message: 'Trading has been re-enabled.',
    });
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setShowSettings(false);
    addToast({
      type: 'success',
      title: 'Settings Updated',
      message: 'Trader\'s control settings have been saved.',
    });
  };

  const currentLoss = Math.abs(Math.min(dailyPnL.totalDailyPnL, 0));
  const lossPercentage = settings.dailyLossLimit > 0 ? (currentLoss / settings.dailyLossLimit) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trader's Control</h1>
          <p className="text-gray-600">Risk management and kill switch controls</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="btn-secondary flex items-center"
        >
          <CogIcon className="h-4 w-4 mr-2" />
          Settings
        </button>
      </div>

      {/* Kill Switch Status */}
      <div className={`rounded-lg p-6 border-2 ${
        killSwitchStatus.isActive 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {killSwitchStatus.isActive ? (
              <ShieldExclamationIcon className="h-8 w-8 text-red-600 mr-3" />
            ) : (
              <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
            )}
            <div>
              <h2 className={`text-xl font-bold ${
                killSwitchStatus.isActive ? 'text-red-800' : 'text-green-800'
              }`}>
                Kill Switch {killSwitchStatus.isActive ? 'ACTIVE' : 'INACTIVE'}
              </h2>
              <p className={`text-sm ${
                killSwitchStatus.isActive ? 'text-red-600' : 'text-green-600'
              }`}>
                {killSwitchStatus.isActive 
                  ? 'All trading operations are disabled'
                  : 'Trading operations are enabled'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleManualKillSwitch}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              killSwitchStatus.isActive
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {killSwitchStatus.isActive ? 'Deactivate' : 'Activate'} Kill Switch
          </button>
        </div>

        {killSwitchStatus.isActive && (
          <div className="bg-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Reason for activation:</p>
                <p className="text-red-700">{killSwitchStatus.reason}</p>
                {killSwitchStatus.activatedAt && (
                  <p className="text-red-600 text-sm mt-1">
                    Activated at: {new Date(killSwitchStatus.activatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily P&L Monitor */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Daily P&L Monitor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{dailyPnL.totalRealizedPnL.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-600">Realized P&L</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              dailyPnL.totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{dailyPnL.totalUnrealizedPnL.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-600">Unrealized P&L</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              dailyPnL.totalDailyPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{dailyPnL.totalDailyPnL.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-600">Total Daily P&L</div>
          </div>
        </div>

        {/* Loss Limit Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Daily Loss vs Limit
            </span>
            <span className="text-sm text-gray-600">
              ₹{currentLoss.toLocaleString('en-IN')} / ₹{settings.dailyLossLimit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                lossPercentage >= 100 ? 'bg-red-600' :
                lossPercentage >= 80 ? 'bg-orange-500' :
                lossPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(lossPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span className={`font-medium ${
              lossPercentage >= 90 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {lossPercentage.toFixed(1)}% of limit
            </span>
            <span>₹{settings.dailyLossLimit.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Warning if approaching limit */}
        {lossPercentage >= 80 && !killSwitchStatus.isActive && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-orange-800 font-medium">Warning: Approaching Loss Limit</p>
                <p className="text-orange-700 text-sm">
                  You are {(100 - lossPercentage).toFixed(1)}% away from the daily loss limit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Trader's Control Settings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Loss Limit (₹)
            </label>
            <input
              type="number"
              value={tempSettings.dailyLossLimit}
              onChange={(e) => setTempSettings({
                ...tempSettings,
                dailyLossLimit: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kill switch will activate when daily loss exceeds this amount
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoKillSwitch"
              checked={tempSettings.isAutoKillSwitchEnabled}
              onChange={(e) => setTempSettings({
                ...tempSettings,
                isAutoKillSwitchEnabled: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoKillSwitch" className="ml-2 text-sm text-gray-700">
              Enable automatic kill switch activation
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowSettings(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Kill Switch Deactivation Modal */}
      <Modal
        isOpen={showKillSwitchModal}
        onClose={() => setShowKillSwitchModal(false)}
        title="Deactivate Kill Switch"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Warning</p>
                <p className="text-yellow-700 text-sm">
                  Are you sure you want to deactivate the kill switch? This will re-enable all trading operations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowKillSwitchModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivateKillSwitch}
              className="btn-danger"
            >
              Deactivate Kill Switch
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TradersControl;
