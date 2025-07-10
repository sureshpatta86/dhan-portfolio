/**
 * Super Orders Dynamic API Routes
 * 
 * Handles operations on specific super orders:
 * - PUT /api/trading/super-orders/[orderId]: Modify Super Order
 * - DELETE /api/trading/super-orders/[orderId]/[legName]: Cancel Super Order leg
 */

import { NextRequest, NextResponse } from 'next/server';
import { dhanApiClient } from '@/lib/api/client';
import type { 
  ModifySuperOrderRequest, 
  SuperOrderResponse,
  ModifySuperOrderResponse
} from '@/features/trading/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  let orderId = '';
  try {
    const resolvedParams = await params;
    orderId = resolvedParams.orderId;
    const modifyData: ModifySuperOrderRequest = await request.json();
    
    // Validate required fields
    if (!modifyData.dhanClientId || !modifyData.legName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields for super order modification'
      }, { status: 400 });
    }

    // Ensure orderId matches
    modifyData.orderId = orderId;

    // Make API call to Dhan
    const response = await dhanApiClient.put<SuperOrderResponse>(
      `/super/orders/${orderId}`,
      modifyData
    );

    if (!response.data) {
      throw new Error('No response data from Dhan API');
    }

    const successResponse: ModifySuperOrderResponse = {
      success: true,
      endpoint: `/super/orders/${orderId}`,
      data: response.data,
      message: 'Super order modified successfully'
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Super Order modification error:', error);
    
    // Check if it's a 400 error which usually means order can't be modified
    let errorMessage = 'Failed to modify super order';
    let statusCode = 500;
    
    if (error instanceof Error && error.message.includes('400')) {
      errorMessage = 'Order cannot be modified. It may be rejected, completed, or in a non-modifiable state.';
      statusCode = 400;
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : errorMessage,
      userMessage: errorMessage,
      endpoint: `/super/orders/${orderId}`
    }, { status: statusCode });
  }
}
