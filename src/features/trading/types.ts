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
