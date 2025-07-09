# Orders Implementation - Dhan API Integration

## Overview

This document provides a comprehensive overview of the orders implementation based on the Dhan API v2 documentation. The implementation includes all major order management functionalities with proper validation, error handling, and React integration.

## API Endpoints Implemented

### 1. Order Placement
- **Endpoint**: `POST /api/trading/orders`
- **Purpose**: Place new orders
- **Validation**: Comprehensive validation based on order type, product type, and conditional requirements
- **Features**:
  - Required field validation
  - Price validation for LIMIT orders
  - Trigger price validation for stop-loss orders
  - After-market order validation
  - Bracket order validation
  - Disclosed quantity validation (minimum 30% of quantity)

### 2. Order Modification
- **Endpoint**: `PUT /api/trading/orders/[orderId]`
- **Purpose**: Modify pending orders
- **Validation**: Order ID format validation and modification field validation
- **Features**:
  - Modifiable fields: quantity, price, orderType, validity, disclosedQuantity, triggerPrice
  - Leg name support for BO/CO orders
  - Order ID mismatch prevention

### 3. Order Cancellation
- **Endpoint**: `DELETE /api/trading/orders/[orderId]`
- **Purpose**: Cancel pending orders
- **Validation**: Order ID format validation
- **Features**:
  - Simple cancellation with order ID validation
  - Proper error handling for failed cancellations

### 4. Order Book
- **Endpoint**: `GET /api/trading/orders`
- **Purpose**: Retrieve all orders for the day
- **Features**:
  - Complete order details including status, quantities, prices
  - Real-time order status updates
  - Comprehensive order information

### 5. Order Details
- **Endpoint**: `GET /api/trading/orders/[orderId]`
- **Purpose**: Get specific order details
- **Validation**: Order ID format validation
- **Features**:
  - Individual order lookup
  - Complete order information
  - Status tracking

### 6. Order by Correlation ID
- **Endpoint**: `GET /api/trading/orders/external/[correlationId]`
- **Purpose**: Retrieve order by user-defined correlation ID
- **Validation**: Correlation ID format validation
- **Features**:
  - User-defined tracking support
  - Alternative order lookup method

### 7. Order Slicing
- **Endpoint**: `POST /api/trading/orders/slicing`
- **Purpose**: Place orders that exceed freeze limits
- **Validation**: Same as regular order placement
- **Features**:
  - Automatic order splitting for large quantities
  - Multiple order response handling

### 8. Trade Book
- **Endpoint**: `GET /api/trading/trades-book`
- **Purpose**: Retrieve all trades for the day
- **Features**:
  - Complete trade history
  - Trade execution details

### 9. Trades by Order ID
- **Endpoint**: `GET /api/trading/trades/[orderId]`
- **Purpose**: Get trades for specific order
- **Validation**: Order ID format validation
- **Features**:
  - Order-specific trade lookup
  - Partial fill tracking
  - Multiple trades per order support

## Type Definitions

### Core Types
```typescript
// Transaction types
export type TransactionType = 'BUY' | 'SELL';

// Exchange segments
export type ExchangeSegment = 
  | 'NSE_EQ' | 'NSE_FNO' | 'NSE_CURR' 
  | 'BSE_EQ' | 'BSE_FNO' | 'BSE_CURR'
  | 'MCX_COMM';

// Product types
export type ProductType = 
  | 'CNC' | 'INTRADAY' | 'MARGIN' | 'MTF' | 'CO' | 'BO';

// Order types
export type OrderType = 
  | 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_MARKET';

// Order validity
export type OrderValidity = 'DAY' | 'IOC';

// Order status
export type OrderStatus = 
  | 'TRANSIT' | 'PENDING' | 'REJECTED' | 'CANCELLED' 
  | 'PART_TRADED' | 'TRADED' | 'EXPIRED' | 'CONFIRM';
```

### Request/Response Types
- `PlaceOrderRequest`: Complete order placement request structure
- `ModifyOrderRequest`: Order modification request structure
- `DhanOrder`: Complete order information from API
- `DhanTrade`: Trade execution information
- `OrderResponse`: Standard order operation response

## Validation System

### OrderValidator Class
A comprehensive validation system that enforces Dhan API requirements:

#### Order Placement Validation
- **Required fields**: dhanClientId, transactionType, exchangeSegment, productType, orderType, validity, securityId, quantity
- **Conditional validation**:
  - LIMIT orders require price > 0
  - Stop-loss orders require triggerPrice > 0
  - After-market orders require valid amoTime
  - Bracket orders require boProfitValue and boStopLossValue
  - Disclosed quantity must be ≥ 30% of total quantity

#### Order Modification Validation
- **Required fields**: dhanClientId, orderId, orderType, validity
- **At least one modification field required**: quantity, price, disclosedQuantity, triggerPrice
- **Type-specific validation**: Same price/trigger price rules as placement

#### ID Format Validation
- **Order ID**: Numeric string validation
- **Correlation ID**: Length and format validation

## React Hooks Integration

### Query Hooks
- `useOrderBook()`: Real-time order book with auto-refresh
- `useOrderDetails(orderId)`: Individual order tracking
- `useOrderByCorrelationId(correlationId)`: Correlation-based lookup
- `useTradeBook()`: Trade history management
- `useTradesByOrderId(orderId)`: Order-specific trades

### Mutation Hooks
- `usePlaceOrder()`: Order placement with optimistic updates
- `useModifyOrder()`: Order modification with cache invalidation
- `useCancelOrder()`: Order cancellation with immediate UI updates
- `usePlaceSlicedOrder()`: Large order slicing

### Features
- **Automatic cache invalidation**: Mutations automatically update related queries
- **Real-time updates**: Configurable refresh intervals for live data
- **Error handling**: Comprehensive error states and reporting
- **Loading states**: Granular loading indicators for better UX

## Error Handling

### Custom Error Classes
- `OrderValidationError`: Validation-specific errors with field context
- Detailed error messages for API failures
- Proper HTTP status codes for different error types

### Error Response Format
```typescript
{
  error: string;
  details?: string;
  field?: string; // For validation errors
}
```

## Security Features

### Environment Configuration
- Access token validation
- Base URL configuration
- Error message sanitization

### Input Validation
- SQL injection prevention through typed interfaces
- XSS protection through proper encoding
- Input length limitations

## Performance Optimizations

### Query Optimization
- **Stale time configuration**: Different stale times for different data types
- **Refetch intervals**: Appropriate refresh rates for real-time data
- **Conditional queries**: Only fetch when needed

### Cache Management
- **Intelligent invalidation**: Only invalidate affected queries
- **Optimistic updates**: Immediate UI updates for better UX
- **Background refetching**: Keep data fresh without blocking UI

## Usage Examples

### Basic Order Placement
```typescript
const placeOrder = usePlaceOrder();

const handlePlaceOrder = async () => {
  try {
    await placeOrder.mutateAsync({
      dhanClientId: "1000000003",
      transactionType: "BUY",
      exchangeSegment: "NSE_EQ",
      productType: "INTRADAY",
      orderType: "MARKET",
      validity: "DAY",
      securityId: "11536",
      quantity: 5
    });
  } catch (error) {
    console.error("Order placement failed:", error);
  }
};
```

### Order Monitoring
```typescript
const { data: orderBook, isLoading, error } = useOrderBook();
const { data: orderDetails } = useOrderDetails(selectedOrderId);

// Real-time order status tracking
useEffect(() => {
  if (orderDetails?.orderStatus === 'TRADED') {
    showSuccessNotification('Order executed successfully!');
  }
}, [orderDetails?.orderStatus]);
```

## Configuration

### Environment Variables
```env
DHAN_ACCESS_TOKEN=your_access_token
DHAN_BASE_URL=https://api.dhan.co/v2
```

### API Constants
```typescript
export const API_ENDPOINTS = {
  TRADING: {
    ORDERS: '/api/trading/orders',
    TRADES: '/api/trading/trades',
    TRADES_BOOK: '/api/trading/trades-book',
  }
};
```

## Best Practices

1. **Always validate inputs** using the provided validation system
2. **Handle errors gracefully** with appropriate user feedback
3. **Use optimistic updates** for better user experience
4. **Implement proper loading states** for all async operations
5. **Cache management** through React Query for optimal performance
6. **Real-time updates** with appropriate refresh intervals
7. **Security first** with proper token handling and input validation

## Testing Considerations

### API Testing
- Mock Dhan API responses for unit tests
- Integration tests with test trading accounts
- Error scenario testing

### Component Testing
- Form validation testing
- Loading state testing
- Error handling testing
- User interaction testing

## Future Enhancements

1. **WebSocket integration** for real-time order updates
2. **Advanced order types** (OCO, Iceberg orders)
3. **Order history** with pagination
4. **Bulk operations** for multiple orders
5. **Performance analytics** and monitoring
6. **Offline support** with queue management

## Compliance and Risk Management

1. **Order limits** validation
2. **Risk checks** before order placement
3. **Audit logging** for all order operations
4. **Regulatory compliance** with trading rules
5. **Position limits** enforcement

This implementation provides a robust, scalable, and user-friendly order management system that fully leverages the Dhan API capabilities while maintaining high standards for security, performance, and user experience.
