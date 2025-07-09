/**
 * Application-wide constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  
  // Portfolio routes
  PORTFOLIO: '/portfolio',
  HOLDINGS: '/portfolio/holdings',
  POSITIONS: '/portfolio/positions',
  CONVERT_POSITION: '/portfolio/convert',
  
  // Trading routes
  TRADING: '/trading',
  ORDERS: '/trading/orders',
  TRADES: '/trading/trades',
  
  // Market routes
  MARKET: '/market',
  LIVE_FEED: '/market/live-feed',
  MARKET_DEPTH: '/market/depth',
  HISTORICAL_DATA: '/market/historical',
  OPTION_CHAIN: '/market/option-chain',
  
  // Reports routes
  REPORTS: '/reports',
  STATEMENTS: '/reports/statements',
  TRADE_BOOK: '/reports/trade-book',
  
  // Tools routes
  TOOLS: '/tools',
  EDIS: '/tools/edis',
  TRADERS_CONTROL: '/tools/traders-control',
  ORDER_UPDATES: '/tools/order-updates',
  
  // Settings routes
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  PREFERENCES: '/settings/preferences',
  SECURITY: '/settings/security',
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  
  // Portfolio
  PORTFOLIO: {
    HOLDINGS: '/api/portfolio/holdings',
    POSITIONS: '/api/portfolio/positions',
    CONVERT_POSITION: '/api/portfolio/convert-position',
  },
  
  // Trading
  TRADING: {
    ORDERS: '/api/trading/orders',
    TRADES: '/api/trading/trades',
    TRADES_BOOK: '/api/trading/trades-book',
    FUNDS: '/api/trading/funds',
    LEDGER: '/api/trading/ledger',
  },
  
  // Market
  MARKET: {
    QUOTE: '/api/market/quote',
    LIVE_FEED: '/api/market/live-feed',
    DEPTH: '/api/market/depth',
    HISTORICAL: '/api/market/historical',
    OPTION_CHAIN: '/api/market/option-chain',
  },
  
  // User
  USER: {
    PROFILE: '/api/user/profile',
    PREFERENCES: '/api/user/preferences',
  },
} as const;

export const PRODUCT_TYPES = {
  CNC: 'CNC',
  INTRADAY: 'INTRADAY',
  MARGIN: 'MARGIN',
  CO: 'CO',
  BO: 'BO',
} as const;

export const POSITION_TYPES = {
  LONG: 'LONG',
  SHORT: 'SHORT',
  CLOSED: 'CLOSED',
} as const;

export const EXCHANGE_SEGMENTS = {
  NSE_EQ: 'NSE_EQ',
  NSE_FNO: 'NSE_FNO',
  NSE_CURRENCY: 'NSE_CURRENCY',
  BSE_EQ: 'BSE_EQ',
  BSE_FNO: 'BSE_FNO',
  BSE_CURRENCY: 'BSE_CURRENCY',
  MCX_COMM: 'MCX_COMM',
} as const;

export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STOP_LOSS: 'STOP_LOSS',
  STOP_LOSS_MARKET: 'STOP_LOSS_MARKET',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  FILLED: 'FILLED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
} as const;

export const VALIDITY_TYPES = {
  DAY: 'DAY',
  IOC: 'IOC',
  GTD: 'GTD',
} as const;

export const TRANSACTION_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;
