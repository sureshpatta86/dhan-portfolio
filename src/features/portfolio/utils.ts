/**
 * Portfolio feature - utility functions
 */

import { PRODUCT_TYPES, POSITION_TYPES, EXCHANGE_SEGMENTS } from '@/lib/constants';
import type { DhanPosition } from './types';

/**
 * Validates if a position conversion is allowed based on business rules
 */
export function validateConversion(
  fromProductType: string,
  toProductType: string,
  positionType: string,
  exchangeSegment: string
): { isValid: boolean; reason?: string } {
  // Cannot convert to the same product type
  if (fromProductType === toProductType) {
    return { isValid: false, reason: 'Cannot convert to the same product type' };
  }

  // F&O positions can only be converted between MARGIN and INTRADAY
  if (exchangeSegment.includes('FNO') || exchangeSegment.includes('CURRENCY')) {
    const validFOProductTypes = [PRODUCT_TYPES.MARGIN, PRODUCT_TYPES.INTRADAY];
    if (!validFOProductTypes.includes(fromProductType as any) || 
        !validFOProductTypes.includes(toProductType as any)) {
      return { 
        isValid: false, 
        reason: 'F&O positions can only be converted between MARGIN and INTRADAY' 
      };
    }
  }

  // Equity positions support all conversions
  if (exchangeSegment.includes('EQ')) {
    const validEQProductTypes = [PRODUCT_TYPES.CNC, PRODUCT_TYPES.MARGIN, PRODUCT_TYPES.INTRADAY];
    if (!validEQProductTypes.includes(fromProductType as any) || 
        !validEQProductTypes.includes(toProductType as any)) {
      return { isValid: false, reason: 'Invalid product type for equity conversion' };
    }
  }

  return { isValid: true };
}

/**
 * Gets available product types for conversion based on current position
 */
export function getAvailableProductTypes(
  currentProductType: string,
  exchangeSegment: string
): string[] {
  const allProductTypes = [PRODUCT_TYPES.CNC, PRODUCT_TYPES.INTRADAY, PRODUCT_TYPES.MARGIN];
  
  // Filter out current product type
  let availableTypes = allProductTypes.filter(type => type !== currentProductType);
  
  // For F&O, only allow MARGIN and INTRADAY
  if (exchangeSegment.includes('FNO') || exchangeSegment.includes('CURRENCY')) {
    availableTypes = availableTypes.filter(type => 
      [PRODUCT_TYPES.MARGIN, PRODUCT_TYPES.INTRADAY].includes(type as any)
    );
  }
  
  return availableTypes;
}

/**
 * Checks if a position is active (can be traded/converted)
 */
export function isActivePosition(position: DhanPosition): boolean {
  return position.positionType !== POSITION_TYPES.CLOSED && position.netQty !== 0;
}

/**
 * Calculates position metrics
 */
export function calculatePositionMetrics(position: DhanPosition) {
  const totalValue = Math.abs(position.netQty) * position.buyAvg;
  const profitPercentage = position.buyAvg > 0 
    ? (position.unrealizedProfit / totalValue) * 100 
    : 0;
  
  return {
    totalValue,
    profitPercentage,
    isProfit: position.unrealizedProfit > 0,
    isActive: isActivePosition(position),
  };
}

/**
 * Groups positions by exchange or product type
 */
export function groupPositions(positions: DhanPosition[], groupBy: 'exchange' | 'productType') {
  return positions.reduce((groups, position) => {
    const key = groupBy === 'exchange' ? position.exchangeSegment : position.productType;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(position);
    return groups;
  }, {} as Record<string, DhanPosition[]>);
}

/**
 * Calculates portfolio summary from positions
 */
export function calculatePortfolioSummary(positions: DhanPosition[]) {
  const activePositions = positions.filter(isActivePosition);
  const closedPositions = positions.filter(p => !isActivePosition(p));
  
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedProfit, 0);
  const totalRealizedPnL = positions.reduce((sum, p) => sum + p.realizedProfit, 0);
  const totalValue = positions.reduce((sum, p) => sum + Math.abs(p.netQty) * p.buyAvg, 0);
  
  const dayPnL = positions.reduce((sum, p) => {
    // Calculate day P&L based on day quantities and values
    const dayBuyValue = p.dayBuyValue || 0;
    const daySellValue = p.daySellValue || 0;
    return sum + (daySellValue - dayBuyValue);
  }, 0);

  return {
    totalPositions: positions.length,
    activePositions: activePositions.length,
    closedPositions: closedPositions.length,
    longPositions: positions.filter(p => p.positionType === POSITION_TYPES.LONG).length,
    shortPositions: positions.filter(p => p.positionType === POSITION_TYPES.SHORT).length,
    totalValue,
    totalUnrealizedPnL,
    totalRealizedPnL,
    totalPnL: totalUnrealizedPnL + totalRealizedPnL,
    dayPnL,
  };
}
