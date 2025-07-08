'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TradersControlSettings, KillSwitchStatus, DailyPnLSummary } from '@/types/trading';

interface TradersControlStore {
  settings: TradersControlSettings;
  killSwitchStatus: KillSwitchStatus;
  dailyPnL: DailyPnLSummary;
  
  // Actions
  updateSettings: (settings: Partial<TradersControlSettings>) => void;
  updateDailyPnL: (pnl: DailyPnLSummary) => void;
  activateKillSwitch: (reason: string) => void;
  deactivateKillSwitch: () => void;
  resetDailyData: () => void;
  checkAndActivateKillSwitch: () => boolean;
}

const initialSettings: TradersControlSettings = {
  isKillSwitchActive: false,
  dailyLossLimit: 10000, // ₹10,000 default limit
  currentDailyLoss: 0,
  isAutoKillSwitchEnabled: true,
  lastResetDate: new Date().toISOString().split('T')[0], // Today's date
};

const initialKillSwitchStatus: KillSwitchStatus = {
  isActive: false,
  reason: '',
  canOverride: false,
};

const initialDailyPnL: DailyPnLSummary = {
  totalRealizedPnL: 0,
  totalUnrealizedPnL: 0,
  totalDailyPnL: 0,
  tradeCount: 0,
  lastUpdated: new Date().toISOString(),
};

export const useTradersControlStore = create<TradersControlStore>()(
  persist(
    (set, get) => ({
      settings: initialSettings,
      killSwitchStatus: initialKillSwitchStatus,
      dailyPnL: initialDailyPnL,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      updateDailyPnL: (pnl) => {
        set({ dailyPnL: pnl });
        
        // Check if we need to activate kill switch
        const { checkAndActivateKillSwitch } = get();
        checkAndActivateKillSwitch();
      },

      activateKillSwitch: (reason) => {
        const now = new Date().toISOString();
        set((state) => ({
          settings: { ...state.settings, isKillSwitchActive: true, killSwitchActivatedAt: now },
          killSwitchStatus: {
            isActive: true,
            reason,
            activatedAt: now,
            canOverride: false, // Can be changed based on business rules
          }
        }));
      },

      deactivateKillSwitch: () => {
        set((state) => ({
          settings: { ...state.settings, isKillSwitchActive: false, killSwitchActivatedAt: undefined },
          killSwitchStatus: {
            isActive: false,
            reason: '',
            canOverride: false,
          }
        }));
      },

      resetDailyData: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          settings: { 
            ...state.settings, 
            currentDailyLoss: 0, 
            lastResetDate: today,
            isKillSwitchActive: false,
            killSwitchActivatedAt: undefined
          },
          killSwitchStatus: initialKillSwitchStatus,
          dailyPnL: { ...initialDailyPnL, lastUpdated: new Date().toISOString() }
        }));
      },

      checkAndActivateKillSwitch: () => {
        const { settings, dailyPnL, killSwitchStatus, activateKillSwitch } = get();
        
        // Don't check if kill switch is already active or auto-activation is disabled
        if (killSwitchStatus.isActive || !settings.isAutoKillSwitchEnabled) {
          return false;
        }

        // Check if daily loss exceeds the limit
        const currentLoss = Math.abs(Math.min(dailyPnL.totalDailyPnL, 0));
        
        if (currentLoss >= settings.dailyLossLimit) {
          activateKillSwitch(
            `Daily loss limit of ₹${settings.dailyLossLimit.toLocaleString('en-IN')} exceeded. Current loss: ₹${currentLoss.toLocaleString('en-IN')}`
          );
          return true;
        }

        return false;
      },
    }),
    {
      name: 'traders-control-storage',
      // Only persist settings and essential data
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
