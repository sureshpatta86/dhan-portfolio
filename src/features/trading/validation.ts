/**
 * Order validation utilities based on Dhan API documentation
 */

import type { 
  PlaceOrderRequest, 
  ModifyOrderRequest,
  OrderType,
  ProductType,
  // Super Order types
  PlaceSuperOrderRequest,
  ModifySuperOrderRequest 
} from './types';

export class OrderValidationError extends Error {
  constructor(field: string, message: string) {
    super(`${field}: ${message}`);
    this.name = 'OrderValidationError';
  }
}

export class OrderValidator {
  /**
   * Validate order placement request according to Dhan API requirements
   */
  static validatePlaceOrder(order: PlaceOrderRequest): void {
    // Required fields validation
    const requiredFields = [
      'dhanClientId',
      'transactionType', 
      'exchangeSegment',
      'productType',
      'orderType',
      'validity',
      'securityId',
      'quantity'
    ];

    for (const field of requiredFields) {
      if (!order[field as keyof PlaceOrderRequest]) {
        throw new OrderValidationError(field, 'is required');
      }
    }

    // Price validation based on order type
    if (order.orderType === 'LIMIT') {
      if (!order.price || order.price <= 0) {
        throw new OrderValidationError('price', 'is required and must be greater than 0 for LIMIT orders');
      }
    }

    // Trigger price validation for stop loss orders
    if (order.orderType === 'STOP_LOSS' || order.orderType === 'STOP_LOSS_MARKET') {
      if (!order.triggerPrice || order.triggerPrice <= 0) {
        throw new OrderValidationError('triggerPrice', 'is required and must be greater than 0 for stop loss orders');
      }
    }

    // After market order validation
    if (order.afterMarketOrder === true) {
      if (!order.amoTime) {
        throw new OrderValidationError('amoTime', 'is required when afterMarketOrder is true');
      }
      
      const validAmoTimes = ['PRE_OPEN', 'OPEN', 'OPEN_30', 'OPEN_60'];
      if (!validAmoTimes.includes(order.amoTime)) {
        throw new OrderValidationError('amoTime', `must be one of: ${validAmoTimes.join(', ')}`);
      }
    }

    // Bracket order validation
    if (order.productType === 'BO') {
      if (!order.boProfitValue || order.boProfitValue <= 0) {
        throw new OrderValidationError('boProfitValue', 'is required and must be greater than 0 for BO orders');
      }
      if (!order.boStopLossValue || order.boStopLossValue <= 0) {
        throw new OrderValidationError('boStopLossValue', 'is required and must be greater than 0 for BO orders');
      }
    }

    // Disclosed quantity validation
    if (order.disclosedQuantity && order.disclosedQuantity > 0) {
      const minDisclosedRatio = 0.3;
      const minDisclosed = order.quantity * minDisclosedRatio;
      if (order.disclosedQuantity < minDisclosed) {
        throw new OrderValidationError('disclosedQuantity', 
          `must be at least 30% of quantity (minimum: ${Math.ceil(minDisclosed)})`);
      }
    }

    // Quantity validation
    if (order.quantity <= 0) {
      throw new OrderValidationError('quantity', 'must be greater than 0');
    }
  }

  /**
   * Validate order modification request
   */
  static validateModifyOrder(modify: ModifyOrderRequest): void {
    // Required fields validation
    const requiredFields = ['dhanClientId', 'orderId', 'orderType', 'validity'];
    
    for (const field of requiredFields) {
      if (!modify[field as keyof ModifyOrderRequest]) {
        throw new OrderValidationError(field, 'is required');
      }
    }

    // At least one modification field must be provided
    const modifiableFields = ['quantity', 'price', 'disclosedQuantity', 'triggerPrice'];
    const hasModification = modifiableFields.some(field => 
      modify[field as keyof ModifyOrderRequest] !== undefined
    );

    if (!hasModification) {
      throw new OrderValidationError('modification', 
        `at least one of the following fields must be provided: ${modifiableFields.join(', ')}`);
    }

    // Price validation based on order type
    if (modify.orderType === 'LIMIT' && modify.price !== undefined) {
      if (modify.price <= 0) {
        throw new OrderValidationError('price', 'must be greater than 0 for LIMIT orders');
      }
    }

    // Trigger price validation for stop loss orders
    if ((modify.orderType === 'STOP_LOSS' || modify.orderType === 'STOP_LOSS_MARKET') && 
        modify.triggerPrice !== undefined) {
      if (modify.triggerPrice <= 0) {
        throw new OrderValidationError('triggerPrice', 'must be greater than 0 for stop loss orders');
      }
    }

    // Quantity validation
    if (modify.quantity !== undefined && modify.quantity <= 0) {
      throw new OrderValidationError('quantity', 'must be greater than 0');
    }

    // Disclosed quantity validation
    if (modify.disclosedQuantity !== undefined && modify.disclosedQuantity > 0 && modify.quantity) {
      const minDisclosedRatio = 0.3;
      const minDisclosed = modify.quantity * minDisclosedRatio;
      if (modify.disclosedQuantity < minDisclosed) {
        throw new OrderValidationError('disclosedQuantity', 
          `must be at least 30% of quantity (minimum: ${Math.ceil(minDisclosed)})`);
      }
    }
  }

  /**
   * Validate correlation ID format
   */
  static validateCorrelationId(correlationId: string): void {
    if (!correlationId || correlationId.trim().length === 0) {
      throw new OrderValidationError('correlationId', 'cannot be empty');
    }

    // Optional: Add format validation if needed
    // e.g., alphanumeric only, max length, etc.
    if (correlationId.length > 50) {
      throw new OrderValidationError('correlationId', 'cannot exceed 50 characters');
    }
  }

  /**
   * Validate order ID format
   */
  static validateOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new OrderValidationError('orderId', 'cannot be empty');
    }

    // Dhan order IDs are typically numeric strings
    if (!/^\d+$/.test(orderId)) {
      throw new OrderValidationError('orderId', 'must be a numeric string');
    }
  }

  /**
   * Validate Super Order placement request
   */
  static validatePlaceSuperOrder(order: PlaceSuperOrderRequest): void {
    // Required fields validation
    const requiredFields = [
      'dhanClientId',
      'transactionType', 
      'exchangeSegment',
      'productType',
      'orderType',
      'securityId',
      'quantity',
      'price',
      'targetPrice',
      'stopLossPrice',
      'trailingJump'
    ];

    for (const field of requiredFields) {
      if (!order[field as keyof PlaceSuperOrderRequest]) {
        throw new OrderValidationError(field, `${field} is required`);
      }
    }

    // Basic validations
    if (order.quantity <= 0) {
      throw new OrderValidationError('quantity', 'must be greater than 0');
    }

    if (order.price <= 0) {
      throw new OrderValidationError('price', 'must be greater than 0');
    }

    if (order.targetPrice <= 0) {
      throw new OrderValidationError('targetPrice', 'must be greater than 0');
    }

    if (order.stopLossPrice <= 0) {
      throw new OrderValidationError('stopLossPrice', 'must be greater than 0');
    }

    if (order.trailingJump < 0) {
      throw new OrderValidationError('trailingJump', 'must be 0 or greater');
    }

    // Business logic validations
    if (order.transactionType === 'BUY') {
      if (order.targetPrice <= order.price) {
        throw new OrderValidationError('targetPrice', 'must be greater than entry price for BUY orders');
      }
      if (order.stopLossPrice >= order.price) {
        throw new OrderValidationError('stopLossPrice', 'must be less than entry price for BUY orders');
      }
    } else if (order.transactionType === 'SELL') {
      if (order.targetPrice >= order.price) {
        throw new OrderValidationError('targetPrice', 'must be less than entry price for SELL orders');
      }
      if (order.stopLossPrice <= order.price) {
        throw new OrderValidationError('stopLossPrice', 'must be greater than entry price for SELL orders');
      }
    }

    // Enum validations - basic checks
    const validTransactionTypes = ['BUY', 'SELL'];
    if (!validTransactionTypes.includes(order.transactionType)) {
      throw new OrderValidationError('transactionType', 'must be BUY or SELL');
    }

    const validExchangeSegments = ['NSE_EQ', 'NSE_FNO', 'NSE_CURR', 'BSE_EQ', 'BSE_FNO', 'BSE_CURR', 'MCX_COMM'];
    if (!validExchangeSegments.includes(order.exchangeSegment)) {
      throw new OrderValidationError('exchangeSegment', 'invalid exchange segment');
    }

    const validProductTypes = ['CNC', 'INTRADAY', 'MARGIN', 'MTF', 'CO', 'BO'];
    if (!validProductTypes.includes(order.productType)) {
      throw new OrderValidationError('productType', 'invalid product type');
    }

    const validOrderTypes = ['LIMIT', 'MARKET', 'STOP_LOSS', 'STOP_LOSS_MARKET'];
    if (!validOrderTypes.includes(order.orderType)) {
      throw new OrderValidationError('orderType', 'invalid order type');
    }
    
    if (order.correlationId) {
      this.validateCorrelationId(order.correlationId);
    }
  }

  /**
   * Validate Super Order modification request
   */
  static validateModifySuperOrder(modify: ModifySuperOrderRequest): void {
    // Required fields
    if (!modify.dhanClientId) {
      throw new OrderValidationError('dhanClientId', 'is required');
    }

    if (!modify.orderId) {
      throw new OrderValidationError('orderId', 'is required');
    }

    if (!modify.legName) {
      throw new OrderValidationError('legName', 'is required');
    }

    // Validate leg name
    const validLegNames = ['ENTRY_LEG', 'TARGET_LEG', 'STOP_LOSS_LEG'];
    if (!validLegNames.includes(modify.legName)) {
      throw new OrderValidationError('legName', 'must be one of: ENTRY_LEG, TARGET_LEG, STOP_LOSS_LEG');
    }

    // Validate optional fields if provided
    if (modify.quantity !== undefined && modify.quantity <= 0) {
      throw new OrderValidationError('quantity', 'must be greater than 0 if provided');
    }

    if (modify.price !== undefined && modify.price <= 0) {
      throw new OrderValidationError('price', 'must be greater than 0 if provided');
    }

    if (modify.targetPrice !== undefined && modify.targetPrice <= 0) {
      throw new OrderValidationError('targetPrice', 'must be greater than 0 if provided');
    }

    if (modify.stopLossPrice !== undefined && modify.stopLossPrice <= 0) {
      throw new OrderValidationError('stopLossPrice', 'must be greater than 0 if provided');
    }

    if (modify.trailingJump !== undefined && modify.trailingJump < 0) {
      throw new OrderValidationError('trailingJump', 'must be 0 or greater if provided');
    }

    // Validate orderType if provided
    if (modify.orderType) {
      const validOrderTypes = ['LIMIT', 'MARKET', 'STOP_LOSS', 'STOP_LOSS_MARKET'];
      if (!validOrderTypes.includes(modify.orderType)) {
        throw new OrderValidationError('orderType', 'invalid order type');
      }
    }

    this.validateOrderId(modify.orderId);
  }
}

/**
 * Higher-level validation functions for use in API routes
 */
export const validatePlaceOrderRequest = (order: unknown): PlaceOrderRequest => {
  if (!order || typeof order !== 'object') {
    throw new OrderValidationError('request', 'body must be a valid object');
  }

  const orderRequest = order as PlaceOrderRequest;
  OrderValidator.validatePlaceOrder(orderRequest);
  return orderRequest;
};

export const validateModifyOrderRequest = (modify: unknown): ModifyOrderRequest => {
  if (!modify || typeof modify !== 'object') {
    throw new OrderValidationError('request', 'body must be a valid object');
  }

  const modifyRequest = modify as ModifyOrderRequest;
  OrderValidator.validateModifyOrder(modifyRequest);
  return modifyRequest;
};

/**
 * Super Order validation functions
 */
export const validatePlaceSuperOrderRequest = (order: unknown): PlaceSuperOrderRequest => {
  if (!order || typeof order !== 'object') {
    throw new OrderValidationError('request', 'body must be a valid object');
  }

  const superOrderRequest = order as PlaceSuperOrderRequest;
  OrderValidator.validatePlaceSuperOrder(superOrderRequest);
  return superOrderRequest;
};

export const validateModifySuperOrderRequest = (modify: unknown): ModifySuperOrderRequest => {
  if (!modify || typeof modify !== 'object') {
    throw new OrderValidationError('request', 'body must be a valid object');
  }

  const modifyRequest = modify as ModifySuperOrderRequest;
  OrderValidator.validateModifySuperOrder(modifyRequest);
  return modifyRequest;
};
