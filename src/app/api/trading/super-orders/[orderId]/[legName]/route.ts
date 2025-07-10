/**
 * Super Orders Cancel API Route
 * 
 * Handles cancellation of specific super order legs:
 * - DELETE /api/trading/super-orders/[orderId]/[legName]: Cancel Super Order leg
 */

import { NextRequest, NextResponse } from 'next/server';
import { dhanApiClient } from '@/lib/api/client';
import type { 
  SuperOrderResponse,
  CancelSuperOrderResponse
} from '@/features/trading/types';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string; legName: string }> }
) {
  let orderId = '';
  let legName = '';
  try {
    const resolvedParams = await params;
    orderId = resolvedParams.orderId;
    legName = resolvedParams.legName;
    
    // Validate leg name
    const validLegNames = ['ENTRY_LEG', 'TARGET_LEG', 'STOP_LOSS_LEG'];
    if (!validLegNames.includes(legName)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid leg name. Must be one of: ENTRY_LEG, TARGET_LEG, STOP_LOSS_LEG'
      }, { status: 400 });
    }

    // Make API call to Dhan
    const response = await dhanApiClient.delete<SuperOrderResponse>(
      `/super/orders/${orderId}/${legName}`
    );

    if (!response.data) {
      throw new Error('No response data from Dhan API');
    }

    const successResponse: CancelSuperOrderResponse = {
      success: true,
      endpoint: `/super/orders/${orderId}/${legName}`,
      data: response.data,
      message: `Super order ${legName} cancelled successfully`
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Super Order cancellation error:', error);
    
    // Check if it's a 400 error which usually means order can't be cancelled
    let errorMessage = 'Failed to cancel super order';
    let statusCode = 500;
    
    if (error instanceof Error && error.message.includes('400')) {
      errorMessage = 'Order cannot be cancelled. It may be rejected, completed, or already cancelled.';
      statusCode = 400;
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : errorMessage,
      userMessage: errorMessage,
      endpoint: `/super/orders/${orderId}/${legName}`
    }, { status: statusCode });
  }
}
