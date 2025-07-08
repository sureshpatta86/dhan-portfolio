# Convert Position Feature - Implementation Guide

## Overview
The Convert Position feature allows users to convert their open trading positions between different product types (e.g., Intraday ↔ Delivery) using the DhanHQ API.

## Features Implemented

### 1. API Integration (`/src/app/api/tradingapi/portfolio/convert-position/route.ts`)
- ✅ POST endpoint that interfaces with DhanHQ's `/positions/convert` API
- ✅ Comprehensive validation for all required fields
- ✅ Error handling with descriptive messages
- ✅ Handles 202 Accepted response from DhanHQ API

### 2. TypeScript Types (`/src/types/index.ts`)
- ✅ `ConvertPositionRequest` interface
- ✅ `ConvertPositionResponse` interface
- ✅ Proper type safety throughout the application

### 3. React Hook (`/src/hooks/useConvertPosition.ts`)
- ✅ Custom hook for position conversion
- ✅ Loading, error, and success state management
- ✅ Async conversion request handling

### 4. UI Components (`/src/components/ConvertPosition.tsx`)
- ✅ Main `ConvertPosition` component listing convertible positions
- ✅ Modal dialog for conversion details
- ✅ Confirmation dialog for conversion safety
- ✅ Real-time validation and error feedback
- ✅ Toast notifications for success/error states

### 5. Business Logic (`/src/utils/positionUtils.ts`)
- ✅ Position conversion validation rules
- ✅ Product type availability based on exchange segment
- ✅ F&O vs Equity specific conversion rules

### 6. Navigation Integration
- ✅ Added to dashboard navigation menu
- ✅ Properly integrated into main SPA routing system
- ✅ Activated from "coming-soon" status

## API Integration Details

### Request Format
```typescript
{
  dhanClientId: string;
  fromProductType: 'CNC' | 'INTRADAY' | 'MARGIN' | 'CO' | 'BO';
  exchangeSegment: string;
  positionType: 'LONG' | 'SHORT';
  securityId: string;
  tradingSymbol: string;
  convertQty: number;
  toProductType: 'CNC' | 'INTRADAY' | 'MARGIN' | 'CO' | 'BO';
}
```

### Response
- **Success**: 202 Accepted with success message
- **Error**: Appropriate HTTP status with error details

## User Experience Flow

1. **Access**: Navigate to Portfolio → Convert Position from the sidebar
2. **View Positions**: See all convertible open positions
3. **Select Position**: Click "Convert" button on desired position
4. **Configure Conversion**:
   - Select quantity (default: full position)
   - Choose target product type (filtered based on current type and exchange)
   - Real-time validation prevents invalid conversions
5. **Confirm**: Review conversion details in confirmation dialog
6. **Submit**: Process conversion with loading feedback
7. **Result**: Success/error notification with automatic position refresh

## Validation Rules

### General Rules
- Cannot convert to the same product type
- Quantity must be positive and ≤ available quantity
- All required fields must be present

### Exchange-Specific Rules
- **Equity (NSE_EQ/BSE_EQ)**: Supports CNC ↔ INTRADAY ↔ MARGIN conversions
- **F&O (NSE_FNO/BSE_FNO)**: Limited to MARGIN ↔ INTRADAY conversions
- **Currency**: Similar to F&O, MARGIN ↔ INTRADAY only

## Error Handling

### Client-Side
- Form validation prevents invalid submissions
- Real-time feedback for validation errors
- Toast notifications for success/error states
- Loading states during API calls

### Server-Side
- Comprehensive field validation
- DhanHQ API error forwarding
- Proper HTTP status codes
- Detailed error messages

## Security Considerations
- API access token stored securely in environment variables
- Request validation prevents malformed data
- Confirmation dialog prevents accidental conversions
- No sensitive data exposure in client-side code

## Testing Recommendations

### Unit Tests
- Validation functions in `positionUtils.ts`
- Hook functionality in `useConvertPosition.ts`
- API route validation and error handling

### Integration Tests
- End-to-end conversion flow
- Error scenario handling
- UI component interactions

### Manual Testing Scenarios
1. Convert INTRADAY to CNC position
2. Convert CNC to INTRADAY position  
3. Attempt invalid conversions (same type, F&O to CNC)
4. Test with insufficient quantity
5. Test API error responses
6. Test network failures

## Environment Setup
Ensure `DHAN_ACCESS_TOKEN` is set in `.env.local`:
```
DHAN_ACCESS_TOKEN=your_dhan_api_token_here
```

## Dependencies
- DhanHQ API v2.0
- Next.js 15.3.4
- React 18+
- TypeScript
- Tailwind CSS
- Heroicons

## File Structure
```
src/
├── app/
│   ├── api/tradingapi/portfolio/convert-position/route.ts
│   └── page.tsx (routing integration)
├── components/
│   ├── ConvertPosition.tsx (main component)
│   └── ui/Toast.tsx (notifications)
├── hooks/
│   ├── useConvertPosition.ts
│   └── index.ts (exports)
├── types/
│   └── index.ts (TypeScript interfaces)
└── utils/
    └── positionUtils.ts (business logic)
```

## Future Enhancements
- [ ] Batch conversion for multiple positions
- [ ] Conversion history tracking
- [ ] Advanced conversion strategies
- [ ] Mobile-optimized UI
- [ ] Real-time position updates via WebSocket
- [ ] Conversion cost calculation
- [ ] Market hours validation
