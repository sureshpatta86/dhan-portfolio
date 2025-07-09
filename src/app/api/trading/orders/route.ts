/**
 * Orders API Route - Place Order
 * POST /api/trading/orders
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

    console.log('Placing order via Dhan API:', orderData);

    const response = await fetch(`${baseUrl}/orders`, {
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
    console.log('Order placed successfully:', data);

    return NextResponse.json({
      success: true,
      endpoint: 'place-order',
      data,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Error placing order:', error);
    
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to place order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 500 }
      );
    }

    console.log('Fetching order book from Dhan API');

    const response = await fetch(`${baseUrl}/orders`, {
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
    console.log('Order book fetched successfully, count:', data?.length || 0);

    return NextResponse.json({
      success: true,
      endpoint: 'order-book',
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error fetching order book:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order book',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
