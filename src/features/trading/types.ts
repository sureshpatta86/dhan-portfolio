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
