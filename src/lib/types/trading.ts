export interface TradersControlSettings {
  isKillSwitchActive: boolean;
  dailyLossLimit: number;
  currentDailyLoss: number;
  isAutoKillSwitchEnabled: boolean;
  killSwitchActivatedAt?: string;
  lastResetDate: string;
}

export interface KillSwitchStatus {
  isActive: boolean;
  reason: string;
  activatedAt?: string;
  canOverride: boolean;
}

export interface DailyPnLSummary {
  totalRealizedPnL: number;
  totalUnrealizedPnL: number;
  totalDailyPnL: number;
  tradeCount: number;
  lastUpdated: string;
}
