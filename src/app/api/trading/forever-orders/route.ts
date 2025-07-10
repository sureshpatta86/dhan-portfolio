/**
 * Forever Orders API Routes
 * GET /api/trading/forever-orders - Get all forever orders
 * POST /api/trading/forever-orders - Place new forever order
 */

import { NextRequest, NextResponse } from 'next/server';

const DHAN_API_BASE = 'https://api.dhan.co';
const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('DHAN_ACCESS_TOKEN is not configured');
}

export async function GET() {
  try {
    console.log('Forever Orders API: GET /api/trading/forever-orders');
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Dhan API access token not configured', data: [] },
        { status: 500 }
      );
    }

    const response = await fetch(`${DHAN_API_BASE}/v2/forever/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'access-token': ACCESS_TOKEN,
      },
    });

    console.log('Forever Orders API: Dhan response status:', response.status);

    // Handle 404 specifically - Forever Orders might not be enabled
    if (response.status === 404) {
      console.log('Forever Orders API: 404 - Forever Orders feature may not be enabled for this account');
      return NextResponse.json({
        success: true,
        endpoint: '/api/trading/forever-orders',
        data: [],
        count: 0,
        message: 'Forever Orders feature is not available for this account'
      });
    }

    const responseText = await response.text();
    console.log('Forever Orders API: Dhan response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Forever Orders API: Failed to parse response:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid response from Dhan API',
          data: [],
          error: responseText 
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Forever Orders API: Dhan API error:', response.status, data);
      return NextResponse.json(
        { 
          success: false, 
          message: `Dhan API error: ${response.status}`,
          data: [],
          error: data 
        },
        { status: response.status }
      );
    }

    console.log('Forever Orders API: Successfully fetched forever orders:', data);

    return NextResponse.json({
      success: true,
      endpoint: '/api/trading/forever-orders',
      data: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0
    });

  } catch (error) {
    console.error('Forever Orders API: Error in GET:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Forever Orders API: POST /api/trading/forever-orders');
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Dhan API access token not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Forever Orders API: Request body:', JSON.stringify(body, null, 2));

    // Handle 404 case for POST as well
    const response = await fetch(`${DHAN_API_BASE}/v2/forever/orders`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access-token': ACCESS_TOKEN,
      },
      body: JSON.stringify(body),
    });

    console.log('Forever Orders API: Dhan response status:', response.status);

    // Handle 404 specifically for POST
    if (response.status === 404) {
      console.log('Forever Orders API: 404 - Forever Orders feature may not be enabled for this account');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Forever Orders feature is not available for this account. Please contact Dhan support to enable this feature.',
          error: 'Feature not enabled' 
        },
        { status: 404 }
      );
    }

    const responseText = await response.text();
    console.log('Forever Orders API: Dhan response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Forever Orders API: Failed to parse response:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid response from Dhan API',
          error: responseText 
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('Forever Orders API: Dhan API error:', response.status, data);
      return NextResponse.json(
        { 
          success: false, 
          message: `Dhan API error: ${response.status}`,
          data,
          error: data 
        },
        { status: response.status }
      );
    }

    console.log('Forever Orders API: Successfully placed forever order:', data);

    return NextResponse.json({
      success: true,
      endpoint: '/api/trading/forever-orders',
      data,
      message: 'Forever order placed successfully'
    });

  } catch (error) {
    console.error('Forever Orders API: Error in POST /api/trading/forever-orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
