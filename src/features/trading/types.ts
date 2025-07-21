/**
 * Trading feature - types
 */

export interface DhanFunds {
  dhanClientId: string;
  availabelBalance: number;
  sodLimit: number;
  collateralAmount: number;
  receiveableAmount: number;
  utilizedAmount: number;
  blockedPayoutAmount: number;
  withdrawableBalance: number;
}

export interface FundsResponse {
  success: boolean;
  endpoint: string;
  data: DhanFunds;
  count: number;
}

export interface DhanLedger {
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

export interface LedgerResponse {
  success: boolean;
  endpoint: string;
  data: DhanLedger[];
  count: number;
}

// Order-related types and enums

export type TransactionType = 'BUY' | 'SELL';

export type ExchangeSegment = 
  | 'NSE_EQ' | 'NSE_FNO' | 'NSE_CURR' 
  | 'BSE_EQ' | 'BSE_FNO' | 'BSE_CURR'
  | 'MCX_COMM';

export type ProductType = 
  | 'CNC' | 'INTRADAY' | 'MARGIN' | 'MTF' | 'CO' | 'BO';

export type OrderType = 
  | 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_MARKET';

export type OrderValidity = 'DAY' | 'IOC';

export type OrderStatus = 
  | 'TRANSIT' | 'PENDING' | 'REJECTED' | 'CANCELLED' 
  | 'PART_TRADED' | 'TRADED' | 'EXPIRED' | 'CONFIRM';

export type AMOTime = 'PRE_OPEN' | 'OPEN' | 'OPEN_30' | 'OPEN_60';

export type LegName = 'ENTRY_LEG' | 'TARGET_LEG' | 'STOP_LOSS_LEG';

export type OptionType = 'CALL' | 'PUT';

// Order placement request
export interface PlaceOrderRequest {
  dhanClientId: string;
  correlationId?: string;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  validity: OrderValidity;
  securityId: string;
  quantity: number;
  disclosedQuantity?: number;
  price?: number;
  triggerPrice?: number;
  afterMarketOrder?: boolean;
  amoTime?: AMOTime;
  boProfitValue?: number;
  boStopLossValue?: number;
}

// Order modification request
export interface ModifyOrderRequest {
  dhanClientId: string;
  orderId: string;
  orderType: OrderType;
  legName?: LegName;
  quantity?: number;
  price?: number;
  disclosedQuantity?: number;
  triggerPrice?: number;
  validity: OrderValidity;
}

// Order response
export interface OrderResponse {
  orderId: string;
  orderStatus: OrderStatus;
}

// Detailed order information
export interface DhanOrder {
  dhanClientId: string;
  orderId: string;
  correlationId?: string;
  orderStatus: OrderStatus;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  validity: OrderValidity;
  tradingSymbol: string;
  securityId: string;
  quantity: number;
  disclosedQuantity: number;
  price: number;
  triggerPrice: number;
  afterMarketOrder: boolean;
  boProfitValue: number;
  boStopLossValue: number;
  legName?: LegName;
  createTime: string;
  updateTime: string;
  exchangeTime: string;
  drvExpiryDate?: string;
  drvOptionType?: OptionType;
  drvStrikePrice: number;
  omsErrorCode?: string;
  omsErrorDescription?: string;
  algoId?: string;
  remainingQuantity: number;
  averageTradedPrice: number;
  filledQty: number;
}

// Trade information
export interface DhanTrade {
  dhanClientId: string;
  orderId: string;
  exchangeOrderId: string;
  exchangeTradeId: string;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  tradingSymbol: string;
  securityId: string;
  tradedQuantity: number;
  tradedPrice: number;
  createTime: string;
  updateTime: string;
  exchangeTime: string;
  drvExpiryDate?: string;
  drvOptionType?: OptionType;
  drvStrikePrice: number;
}

// API Response wrapper types
export interface PlaceOrderResponse {
  success: boolean;
  endpoint: string;
  data: OrderResponse;
  message: string;
}

export interface ModifyOrderResponse {
  success: boolean;
  endpoint: string;
  data: OrderResponse;
  message: string;
}

export interface CancelOrderResponse {
  success: boolean;
  endpoint: string;
  data: OrderResponse;
  message: string;
}

export interface OrderBookResponse {
  success: boolean;
  endpoint: string;
  data: DhanOrder[];
  count: number;
}

export interface OrderDetailsResponse {
  success: boolean;
  endpoint: string;
  data: DhanOrder;
  message: string;
}

export interface TradeBookResponse {
  success: boolean;
  endpoint: string;
  data: DhanTrade[];
  count: number;
}

export interface TradeDetailsResponse {
  success: boolean;
  endpoint: string;
  data: DhanTrade[];
  count: number;
}

export interface OrderSliceResponse {
  success: boolean;
  endpoint: string;
  data: OrderResponse[];
  count: number;
  message: string;
}

// Super Order types
export interface PlaceSuperOrderRequest {
  dhanClientId: string;
  correlationId?: string;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  securityId: string;
  quantity: number;
  price: number;
  targetPrice: number;
  stopLossPrice: number;
  trailingJump: number;
}

export interface ModifySuperOrderRequest {
  dhanClientId: string;
  orderId: string;
  orderType?: OrderType;
  legName: LegName;
  quantity?: number;
  price?: number;
  targetPrice?: number;
  stopLossPrice?: number;
  trailingJump?: number;
}

export interface SuperOrderLegDetail {
  orderId: string;
  legName: LegName;
  transactionType: TransactionType;
  totalQuantity: number;
  remainingQuantity: number;
  triggeredQuantity: number;
  price: number;
  orderStatus: OrderStatus;
  trailingJump: number;
}

export interface DhanSuperOrder {
  dhanClientId: string;
  orderId: string;
  correlationId?: string;
  orderStatus: OrderStatus;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  validity: OrderValidity;
  tradingSymbol: string;
  securityId: string;
  quantity: number;
  remainingQuantity: number;
  ltp: number;
  price: number;
  afterMarketOrder: boolean;
  legName: LegName;
  exchangeOrderId: string;
  createTime: string;
  updateTime: string;
  exchangeTime: string;
  omsErrorDescription: string;
  averageTradedPrice: number;
  filledQty: number;
  legDetails: SuperOrderLegDetail[];
}

export interface SuperOrderResponse {
  orderId: string;
  orderStatus: OrderStatus;
}

export interface PlaceSuperOrderResponse {
  success: boolean;
  endpoint: string;
  data: SuperOrderResponse;
  message: string;
}

export interface ModifySuperOrderResponse {
  success: boolean;
  endpoint: string;
  data: SuperOrderResponse;
  message: string;
}

export interface CancelSuperOrderResponse {
  success: boolean;
  endpoint: string;
  data: SuperOrderResponse;
  message: string;
}

export interface SuperOrderBookResponse {
  success: boolean;
  endpoint: string;
  data: DhanSuperOrder[];
  count: number;
}

// Forever Order types
export type ForeverOrderFlag = 'SINGLE' | 'OCO';
export type ForeverOrderStatus = 'TRANSIT' | 'PENDING' | 'REJECTED' | 'CANCELLED' | 'TRADED' | 'EXPIRED' | 'CONFIRM';

// Create Forever Order request
export interface PlaceForeverOrderRequest {
  dhanClientId: string;
  correlationId?: string;
  orderFlag: ForeverOrderFlag;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: OrderType;
  validity: OrderValidity;
  securityId: string;
  quantity: number;
  disclosedQuantity?: number;
  price: number;
  triggerPrice: number;
  // OCO specific fields
  price1?: number;
  triggerPrice1?: number;
  quantity1?: number;
}

// Modify Forever Order request
export interface ModifyForeverOrderRequest {
  dhanClientId: string;
  orderId: string;
  orderFlag: ForeverOrderFlag;
  orderType: OrderType;
  legName: LegName;
  quantity: number;
  price: number;
  disclosedQuantity?: number;
  triggerPrice: number;
  validity: OrderValidity;
}

// Forever Order response
export interface ForeverOrderResponse {
  orderId: string;
  orderStatus: ForeverOrderStatus;
}

// Detailed Forever Order information
export interface DhanForeverOrder {
  dhanClientId: string;
  orderId: string;
  orderStatus: ForeverOrderStatus;
  transactionType: TransactionType;
  exchangeSegment: ExchangeSegment;
  productType: ProductType;
  orderType: ForeverOrderFlag; // Note: API returns orderType as SINGLE/OCO for forever orders
  tradingSymbol: string;
  securityId: string;
  quantity: number;
  price: number;
  triggerPrice: number;
  legName: LegName;
  createTime: string;
  updateTime?: string;
  exchangeTime?: string;
  drvExpiryDate?: string;
  drvOptionType?: OptionType;
  drvStrikePrice: number;
}

// Forever Order API Response wrapper types
export interface PlaceForeverOrderResponse {
  success: boolean;
  endpoint: string;
  data: ForeverOrderResponse;
  message: string;
}

export interface ModifyForeverOrderResponse {
  success: boolean;
  endpoint: string;
  data: ForeverOrderResponse;
  message: string;
}

export interface CancelForeverOrderResponse {
  success: boolean;
  endpoint: string;
  data: ForeverOrderResponse;
  message: string;
}

export interface ForeverOrderBookResponse {
  success: boolean;
  endpoint: string;
  data: DhanForeverOrder[];
  count: number;
}

// Option Chain Types
export interface OptionGreeks {
  delta: number;
  theta: number;
  gamma: number;
  vega: number;
}

export interface OptionData {
  greeks: OptionGreeks;
  implied_volatility: number;
  last_price: number;
  oi: number;
  previous_close_price: number;
  previous_oi: number;
  previous_volume: number;
  top_ask_price: number;
  top_ask_quantity: number;
  top_bid_price: number;
  top_bid_quantity: number;
  volume: number;
  lot_size?: number;
}

export interface OptionStrike {
  ce?: OptionData;
  pe?: OptionData;
}

export interface OptionChainData {
  last_price: number;
  oc: Record<string, OptionStrike>;
}

export interface OptionChainResponse {
  data: OptionChainData;
  status: string;
}

export interface OptionChainRequest {
  UnderlyingScrip: number;
  UnderlyingSeg: string;
  Expiry: string;
}

export interface ExpiryListRequest {
  UnderlyingScrip: number;
  UnderlyingSeg: string;
}

export interface ExpiryListResponse {
  data: string[];
  status: string;
}

// Common underlying instruments
export const COMMON_UNDERLYINGS = {
  NIFTY: { scrip: 13, segment: 'IDX_I', name: 'NIFTY' },
  BANKNIFTY: { scrip: 25, segment: 'IDX_I', name: 'BANK NIFTY' },
  FINNIFTY: { scrip: 27, segment: 'IDX_I', name: 'FIN NIFTY' },
  MIDCPNIFTY: { scrip: 1992, segment: 'IDX_I', name: 'MIDCAP NIFTY' },
  SENSEX: { scrip: 51, segment: 'IDX_I', name: 'SENSEX' },
  BANKEX: { scrip: 690, segment: 'IDX_I', name: 'BANKEX' },
} as const;

export type UnderlyingKey = keyof typeof COMMON_UNDERLYINGS;
