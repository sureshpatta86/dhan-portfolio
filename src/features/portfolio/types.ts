/**
 * Portfolio feature - types and interfaces
 */

export interface DhanHolding {
  exchange: "NSE" | "BSE" | "ALL";
  tradingSymbol: string;
  securityId: string;
  isin: string;   
  totalQty: number;
  dpQty: number;
  t1Qty: number;
  mtf_t1_qty: number;
  mtf_qty: number;
  availableQty: number;
  collateralQty: number;
  avgCostPrice: number;
  lastTradedPrice: number;
}

export interface DhanPosition {
  dhanClientId: string;
  tradingSymbol: string;
  securityId: string;
  positionType: "LONG" | "SHORT" | "CLOSED";
  exchangeSegment: string;
  productType: string;
  buyAvg: number;
  buyQty: number;
  costPrice: number;
  sellAvg: number;
  sellQty: number;
  netQty: number;
  realizedProfit: number;
  unrealizedProfit: number;
  rbiReferenceRate: number;
  multiplier: number;
  carryForwardBuyQty: number;
  carryForwardSellQty: number;
  carryForwardBuyValue: number;
  carryForwardSellValue: number;
  dayBuyQty: number;
  daySellQty: number;
  dayBuyValue: number;
  daySellValue: number;
  drvExpiryDate: string;
  drvOptionType: string | null;
  drvStrikePrice: number;
  crossCurrency: boolean;
}

export interface ConvertPositionRequest {
  dhanClientId: string;
  fromProductType: string;
  exchangeSegment: string;
  positionType: "LONG" | "SHORT";
  securityId: string;
  tradingSymbol: string;
  convertQty: number;
  toProductType: string;
}

export interface ConvertPositionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnL: number;
  totalRealizedPnL: number;
  totalUnrealizedPnL: number;
  dayPnL: number;
  activePositions: number;
  totalHoldings: number;
}
