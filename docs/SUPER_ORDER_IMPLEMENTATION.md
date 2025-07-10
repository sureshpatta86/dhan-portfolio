# Super Order Implementation

## Overview

This document describes the complete implementation of Super Order functionality based on the Dhan API v2 specification. Super Orders allow traders to place complex orders with entry, target, and stop loss levels in a single order.

## Features Implemented

### 1. Core Super Order Types
- **Entry Leg**: Main buy/sell order
- **Target Leg**: Profit-taking order
- **Stop Loss Leg**: Risk management order
- **Trailing Stop Loss**: Dynamic stop loss that moves with favorable price movements

### 2. API Endpoints

#### Place Super Order
- **Endpoint**: `POST /api/trading/super-orders`
- **Purpose**: Place a new super order with entry, target, and stop loss
- **Request Body**:
  ```json
  {
    "dhanClientId": "string",
    "correlationId": "string", // optional
    "transactionType": "BUY|SELL",
    "exchangeSegment": "NSE_EQ|NSE_FNO|BSE_EQ|BSE_FNO|MCX_COMM",
    "productType": "CNC|INTRADAY|MARGIN|MTF",
    "orderType": "LIMIT|MARKET",
    "securityId": "string",
    "quantity": number,
    "price": number,
    "targetPrice": number,
    "stopLossPrice": number,
    "trailingJump": number
  }
  ```

#### Get Super Order Book
- **Endpoint**: `GET /api/trading/super-orders`
- **Purpose**: Retrieve all super orders for the day
- **Response**: Array of super order objects with leg details

#### Modify Super Order
- **Endpoint**: `PUT /api/trading/super-orders/{orderId}`
- **Purpose**: Modify specific legs of a super order
- **Request Body**:
  ```json
  {
    "dhanClientId": "string",
    "orderId": "string",
    "legName": "ENTRY_LEG|TARGET_LEG|STOP_LOSS_LEG",
    "orderType": "LIMIT|MARKET", // optional
    "quantity": number, // optional, ENTRY_LEG only
    "price": number, // optional, ENTRY_LEG only
    "targetPrice": number, // optional, ENTRY_LEG or TARGET_LEG
    "stopLossPrice": number, // optional, ENTRY_LEG or STOP_LOSS_LEG
    "trailingJump": number // optional, ENTRY_LEG or STOP_LOSS_LEG
  }
  ```

#### Cancel Super Order
- **Endpoint**: `DELETE /api/trading/super-orders/{orderId}/{legName}`
- **Purpose**: Cancel specific legs or entire super order
- **Parameters**:
  - `orderId`: Order ID to cancel
  - `legName`: `ENTRY_LEG|TARGET_LEG|STOP_LOSS_LEG`

### 3. React Components

#### SuperOrderForm
- **Location**: `src/components/forms/SuperOrderForm.tsx`
- **Purpose**: Form interface for placing super orders
- **Features**:
  - Comprehensive form validation
  - Real-time P&L calculation
  - Support for all order types and segments
  - Error handling and loading states

#### SuperOrderBook
- **Location**: `src/components/SuperOrderBook.tsx`
- **Purpose**: Display and manage existing super orders
- **Features**:
  - Real-time order status updates
  - Leg-wise order management
  - Cancel individual legs or entire orders
  - Detailed order information display

#### SuperOrderPage
- **Location**: `src/app/trading/super-order/page.tsx`
- **Purpose**: Main page combining form and order book
- **Features**:
  - Tab-based navigation
  - Order details modal
  - Feature overview and help information

### 4. Business Logic

#### Order Validation
- **Entry vs Target/Stop Loss Relationship**:
  - BUY orders: Target > Entry > Stop Loss
  - SELL orders: Target < Entry < Stop Loss
- **Trailing Jump**: Must be >= 0
- **Required Fields**: All price levels and quantities must be specified

#### State Management
- **React Query**: Automatic caching and refetching
- **Real-time Updates**: Order book refreshes every 30 seconds
- **Error Handling**: Comprehensive error states and user feedback

### 5. Service Layer

#### TradingService
- **Location**: `src/features/trading/services.ts`
- **Methods**:
  - `placeSuperOrder(orderData)`: Place new super order
  - `modifySuperOrder(modifyData)`: Modify existing super order
  - `cancelSuperOrder(orderId, legName)`: Cancel super order
  - `getSuperOrderBook()`: Get all super orders

#### Custom Hooks
- **Location**: `src/features/trading/hooks.ts`
- **Hooks**:
  - `useSuperOrderBook()`: Fetch and manage super order book
  - `usePlaceSuperOrder()`: Place super order with optimistic updates
  - `useModifySuperOrder()`: Modify super order
  - `useCancelSuperOrder()`: Cancel super order

## Usage Examples

### Placing a Super Order
```typescript
const { mutateAsync: placeSuperOrder } = usePlaceSuperOrder();

const orderData = {
  dhanClientId: 'YOUR_CLIENT_ID',
  transactionType: 'BUY',
  exchangeSegment: 'NSE_EQ',
  productType: 'CNC',
  orderType: 'LIMIT',
  securityId: '11536', // HDFCBANK
  quantity: 10,
  price: 1500,
  targetPrice: 1600,
  stopLossPrice: 1400,
  trailingJump: 10
};

const result = await placeSuperOrder(orderData);
console.log('Order ID:', result.orderId);
```

### Modifying a Super Order
```typescript
const { mutateAsync: modifySuperOrder } = useModifySuperOrder();

const modifyData = {
  dhanClientId: 'YOUR_CLIENT_ID',
  orderId: 'ORDER_ID',
  legName: 'TARGET_LEG',
  targetPrice: 1650
};

await modifySuperOrder(modifyData);
```

### Canceling a Super Order
```typescript
const { mutateAsync: cancelSuperOrder } = useCancelSuperOrder();

await cancelSuperOrder({ 
  orderId: 'ORDER_ID', 
  legName: 'ENTRY_LEG' // Cancels entire order
});
```

## Configuration

### Environment Variables
```bash
# Required for Dhan API integration
DHAN_BASE_URL=https://api.dhan.co/v2
DHAN_ACCESS_TOKEN=your_access_token_here
DHAN_CLIENT_ID=your_client_id_here
```

### API Client Configuration
- **Timeout**: 30 seconds
- **Retries**: 3 attempts
- **Headers**: Content-Type: application/json, access-token: JWT

## Error Handling

### Common Errors
1. **Invalid Price Relationship**: Target/Stop Loss prices don't follow BUY/SELL rules
2. **Missing Required Fields**: Any required field is empty or invalid
3. **API Authentication**: Invalid or missing access token
4. **Order Not Found**: Trying to modify/cancel non-existent order
5. **Invalid Leg Name**: Using incorrect leg names for modification/cancellation

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "endpoint": "/api/endpoint",
  "data": null
}
```

## Testing

### API Testing
- **Test Script**: `test-super-order-api.js`
- **Coverage**: All endpoints with mock data
- **Expected Behavior**: Fails with authentication errors (expected without valid tokens)

### Manual Testing
1. Navigate to `/trading/super-order`
2. Fill out the super order form
3. Submit order (will fail without valid API credentials)
4. Check order book tab for orders
5. Test modification and cancellation features

## Security Considerations

1. **API Key Management**: Store access tokens securely in environment variables
2. **Client ID Validation**: Ensure client ID matches authenticated user
3. **Order Validation**: Comprehensive server-side validation
4. **Rate Limiting**: Consider implementing rate limiting for API calls
5. **Error Logging**: Log errors without exposing sensitive information

## Performance Optimizations

1. **Query Caching**: React Query caches API responses
2. **Optimistic Updates**: UI updates immediately on mutations
3. **Auto-refresh**: Order book refreshes every 30 seconds
4. **Lazy Loading**: Components load only when needed
5. **Error Boundaries**: Prevent crashes from API errors

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live order updates
2. **Advanced Order Types**: Support for more complex order strategies
3. **Portfolio Integration**: Link super orders with portfolio positions
4. **Analytics**: Track super order performance and success rates
5. **Alerts**: Notifications for order status changes
6. **Bulk Operations**: Place multiple super orders simultaneously

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: Ensure all types are properly imported
2. **API Failures**: Check environment variables and network connectivity
3. **UI Not Loading**: Verify React Query provider is properly configured
4. **Form Validation**: Check validation rules match API requirements

### Debug Steps
1. Check browser console for errors
2. Verify API endpoint responses in Network tab
3. Test API directly with curl or Postman
4. Check server logs for detailed error messages
5. Validate environment variables are loaded correctly

## API Documentation References

- **Dhan API v2 Super Order**: https://dhanhq.co/docs/v2/super-order/
- **Order Types**: https://dhanhq.co/docs/v2/annexure/
- **Exchange Segments**: https://dhanhq.co/docs/v2/annexure/
- **Product Types**: https://dhanhq.co/docs/v2/annexure/
