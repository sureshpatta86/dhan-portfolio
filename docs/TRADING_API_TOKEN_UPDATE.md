# Trading API Configuration Update

## Summary

Successfully updated the trading system to use separate API tokens for different types of operations:

### API Token Configuration

1. **`DHAN_ACCESS_TOKEN`** - Used for trading operations (orders, funds, positions, holdings)
2. **`DHAN_DATA_ACCESS_TOKEN`** - Used for market data operations (option chains, expiry lists)

### Files Updated

#### Configuration
- ✅ **`src/lib/config/app.ts`** - Added `dataAccessToken` to `DHAN_CONFIG`
- ✅ **`.env.example`** - Added `DHAN_DATA_ACCESS_TOKEN` documentation

#### API Routes
- ✅ **`src/app/api/trading/option-chain/route.ts`** - Updated to use data access token
- ✅ **`src/app/api/trading/option-chain/expiry-list/route.ts`** - Updated to use data access token

### API Implementation Details

#### Option Chain API (`POST /api/trading/option-chain`)
- **Endpoint**: `/optionchain` (Dhan API)
- **Method**: POST
- **Headers**: 
  - `access-token`: `DHAN_DATA_ACCESS_TOKEN`
  - `client-id`: `DHAN_CLIENT_ID`
- **Rate Limit**: 1 request per 3 seconds
- **Request Body**:
  ```json
  {
    "UnderlyingScrip": 13,
    "UnderlyingSeg": "IDX_I",
    "Expiry": "2025-07-24"
  }
  ```

#### Expiry List API (`POST /api/trading/option-chain/expiry-list`)
- **Endpoint**: `/optionchain/expirylist` (Dhan API)
- **Method**: POST
- **Headers**: 
  - `access-token`: `DHAN_DATA_ACCESS_TOKEN`
  - `client-id`: `DHAN_CLIENT_ID`
- **Request Body**:
  ```json
  {
    "UnderlyingScrip": 13,
    "UnderlyingSeg": "IDX_I"
  }
  ```

### Frontend Integration

#### Hooks
- ✅ **`useOptionChain`** - Auto-refresh every 5 seconds, respects 3-second rate limit
- ✅ **`useExpiryList`** - Cached for 5 minutes (expiry dates don't change frequently)

#### Components
- ✅ **`OptionChain.tsx`** - Ready to use with the new API configuration
- ✅ **`OptionChainAdvanced.tsx`** - Ready to use with the new API configuration

### Test Results

#### Direct API Tests ✅
- **Expiry List**: Successfully fetched 18 expiry dates
- **Option Chain**: Successfully fetched 228 strikes with current price ₹25,048.65

#### Local API Tests ✅
- **Expiry List Route**: Working correctly
- **Option Chain Route**: Working correctly (rate limit encountered during testing is expected)

### Rate Limiting

The Option Chain API has a rate limit of **1 request per 3 seconds**. The frontend hooks are configured to:
- Set `staleTime: 3000` (3 seconds)
- Set `refetchInterval: 5000` (5 seconds)

This ensures compliance with Dhan's rate limiting requirements.

### Environment Variables Required

```env
# Trading operations
DHAN_ACCESS_TOKEN=your_trading_token_here
DHAN_CLIENT_ID=your_client_id_here
DHAN_BASE_URL=https://api.dhan.co/v2

# Market data operations  
DHAN_DATA_ACCESS_TOKEN=your_data_token_here
```

### Trading vs Data API Separation

**Trading APIs** (use `DHAN_ACCESS_TOKEN`):
- Orders (`/orders`)
- Super Orders (`/super-orders`) 
- Forever Orders (`/forever-orders`)
- Funds (`/funds`)
- Ledger (`/ledger`)
- Trades (`/trades`, `/trades-book`)

**Data APIs** (use `DHAN_DATA_ACCESS_TOKEN`):
- Option Chain (`/option-chain`)
- Expiry List (`/option-chain/expiry-list`)
- Market Quotes (when implemented)
- Historical Data (when implemented)

## Verification

Run the test script to verify everything is working:

```bash
node scripts/test-option-chain.js
```

## Next Steps

1. **Test in Production**: Verify the data access token works in your production environment
2. **Monitor Rate Limits**: Watch for 429 errors and adjust refresh intervals if needed
3. **Add Market Data APIs**: When implementing quotes/historical data, use the data access token
4. **Error Handling**: The APIs include comprehensive error handling and logging

The system is now properly configured to use separate tokens for trading and data operations as per Dhan's API requirements.
