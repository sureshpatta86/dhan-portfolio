// This file exports TypeScript types and interfaces used throughout the application. 

// Import types for response definitions
import type { DhanHolding, DhanPosition } from '@/features/portfolio/types';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export type State = {
    user: User | null;
    posts: Post[];
};

export type Action = 
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_POSTS'; payload: Post[] };

// Re-export portfolio types from feature module
export type { 
  DhanHolding, 
  DhanPosition, 
  ConvertPositionRequest,
  ConvertPositionResponse 
} from '@/features/portfolio/types';

export interface DhanFunds {
    dhanClientId: string;
    availabelBalance: number; // Note: This is how it's spelled in the API
    sodLimit: number;
    collateralAmount: number;
    receiveableAmount: number;
    utilizedAmount: number;
    blockedPayoutAmount: number;
    withdrawableBalance: number;
}

// Generic API Response Types
export interface DhanApiResponse<T = any> {
    success: boolean;
    endpoint: string;
    data: T;
    count: number;
}

export interface DhanApiError {
    error: string;
    message?: string;
    status?: number;
    statusText?: string;
}

// Specific Response Types
export type DhanHoldingsResponse = DhanApiResponse<DhanHolding[]>;
export type DhanPositionsResponse = DhanApiResponse<DhanPosition[]>;
export interface DhanFundsResponse {
    data: DhanFunds;
    success: boolean;
    endpoint: string;
    count: number;
}

export interface FundsTransaction {
    id: string;
    type: 'CREDIT' | 'DEBIT' | 'MARGIN' | 'SETTLEMENT';
    amount: number;
    description: string;
    timestamp: string;
    balance: number;
}

export interface FundsSummary {
    availableBalance: number;
    totalBalance: number;
    usedMargin: number;
    availableMargin: number;
    buyingPower: number;
    dailyPnL: number;
}

export interface DhanLedgerEntry {
    dhanClientId: string;
    narration: string;
    voucherdate: string;
    exchange: string;
    voucherdesc: string;
    vouchernumber: string;
    debit: string;
    credit: string;
    runbal: string;
}

export interface DhanTradeEntry {
    dhanClientId: string;
    orderId: string;
    exchangeOrderId: string;
    exchangeTradeId: string;
    transactionType: "BUY" | "SELL";
    exchangeSegment: string;
    productType: "CNC" | "INTRADAY" | "MARGIN" | "MTF" | "CO" | "BO";
    orderType: "LIMIT" | "MARKET" | "STOP_LOSS" | "STOP_LOSS_MARKET";
    tradingSymbol: string | null;
    customSymbol: string;
    securityId: string;
    tradedQuantity: number;
    tradedPrice: number;
    isin: string;
    instrument: "EQUITY" | "DERIVATIVES";
    sebiTax: number;
    stt: number;
    brokerageCharges: number;
    serviceTax: number;
    exchangeTransactionCharges: number;
    stampDuty: number;
    createTime: string;
    updateTime: string;
    exchangeTime: string;
    drvExpiryDate: string;
    drvOptionType: "CALL" | "PUT" | "NA";
    drvStrikePrice: number;
}

export interface DhanLedgerResponse {
    data: DhanLedgerEntry[];
    success: boolean;
    endpoint: string;
    count: number;
}

export interface DhanTradeHistoryResponse {
    data: DhanTradeEntry[];
    success: boolean;
    endpoint: string;
    count: number;
    page: number;
    hasMore: boolean;
}

// Type aliases for easier use in components and hooks
export type LedgerEntry = DhanLedgerEntry;
export type TradeHistoryEntry = DhanTradeEntry;
export type LedgerResponse = DhanLedgerResponse;
export type TradeHistoryResponse = DhanTradeHistoryResponse;
