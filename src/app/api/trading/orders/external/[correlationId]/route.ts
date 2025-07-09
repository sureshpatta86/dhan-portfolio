/**
 * Order by Correlation ID API Route
 * GET /api/trading/orders/external/[correlationId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrderValidator, OrderValidationError } from '@/features/trading/validation';

function GET_DHAN_API_CONFIG() {
  const accessToken = process.env.DHAN_ACCESS_TOKEN || "";
  const baseUrl = process.env.DHAN_BASE_URL || "";
  
  if (!accessToken) {
    throw new Error("Access token is required");
  }
  
  if (!baseUrl) {
    throw new Error("Dhan base URL is not configured");
  }
  
  return {
    accessToken,
    baseUrl,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { correlationId: string } }
) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    const { correlationId } = params;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 500 }
      );
    }

    if (!correlationId) {
      return NextResponse.json(
        { error: "Correlation ID is required" },
        { status: 400 }
      );
    }

    // Validate correlation ID format
    try {
      OrderValidator.validateCorrelationId(correlationId);
    } catch (validationError) {
      if (validationError instanceof OrderValidationError) {
        return NextResponse.json(
          { error: 'Invalid correlation ID', details: validationError.message },
          { status: 400 }
        );
      }
      throw validationError;
    }

    console.log('Fetching order details for correlation ID:', correlationId);

    const response = await fetch(`${baseUrl}/orders/external/${correlationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access-token': accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dhan API error response:', errorText);
      return NextResponse.json(
        { error: `Dhan API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Order details fetched successfully for correlation ID:', correlationId);

    return NextResponse.json({
      success: true,
      endpoint: 'order-by-correlation-id',
      data,
      message: 'Order details fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching order by correlation ID:', error);
    
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch order by correlation ID',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
