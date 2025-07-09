/**
 * Trades by Order ID API Route
 * GET /api/trading/trades-book/[orderId]
 */

import { NextRequest, NextResponse } from 'next/server';

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
  { params }: { params: { orderId: string } }
) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    const { orderId } = params;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 500 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    console.log('Fetching trades for order ID:', orderId);

    const response = await fetch(`${baseUrl}/trades/${orderId}`, {
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
    console.log('Trades fetched successfully for order ID:', orderId);

    return NextResponse.json({
      success: true,
      endpoint: 'trades-by-order',
      data,
      message: 'Trades fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching trades by order ID:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trades by order ID',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
