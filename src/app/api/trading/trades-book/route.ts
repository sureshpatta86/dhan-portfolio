/**
 * Trade Book API Route
 * GET /api/trading/trades - Get all trades
 * GET /api/trading/trades/[orderId] - Get trades for specific order
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

export async function GET(request: NextRequest) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 500 }
      );
    }

    console.log('Fetching trade book from Dhan API');

    const response = await fetch(`${baseUrl}/trades`, {
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
    console.log('Trade book fetched successfully, count:', data?.length || 0);

    return NextResponse.json({
      success: true,
      endpoint: 'trade-book',
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error fetching trade book:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trade book',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
