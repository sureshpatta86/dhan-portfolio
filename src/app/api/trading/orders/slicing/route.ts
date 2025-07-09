/**
 * Order Slicing API Route
 * POST /api/trading/orders/slicing
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePlaceOrderRequest, OrderValidationError } from '@/features/trading/validation';

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

export async function POST(request: NextRequest) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 500 }
      );
    }

    const requestBody = await request.json();
    const orderData = validatePlaceOrderRequest(requestBody);

    console.log('Placing sliced order via Dhan API:', orderData);

    const response = await fetch(`${baseUrl}/orders/slicing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': accessToken,
      },
      body: JSON.stringify(orderData),
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
    console.log('Sliced order placed successfully:', data);

    return NextResponse.json({
      success: true,
      endpoint: 'order-slicing',
      data: data || [],
      count: data?.length || 0,
      message: 'Sliced order placed successfully'
    });

  } catch (error) {
    console.error('Error placing sliced order:', error);
    
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to place sliced order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
