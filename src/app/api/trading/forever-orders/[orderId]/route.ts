/**
 * Forever Order Management API Routes
 * PUT /api/trading/forever-orders/[orderId] - Modify forever order
 * DELETE /api/trading/forever-orders/[orderId] - Cancel forever order
 */

import { NextRequest, NextResponse } from 'next/server';

const DHAN_API_BASE = 'https://api.dhan.co';
const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('DHAN_ACCESS_TOKEN is not configured');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('Forever Order Modify API: PUT /api/trading/forever-orders/' + orderId);
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Dhan API access token not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Forever Order Modify API: Request body:', JSON.stringify(body, null, 2));

    const response = await fetch(`${DHAN_API_BASE}/v2/forever/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access-token': ACCESS_TOKEN,
      },
      body: JSON.stringify(body),
    });

    console.log('Forever Order Modify API: Dhan response status:', response.status);

    const responseText = await response.text();
    console.log('Forever Order Modify API: Dhan response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Forever Order Modify API: Failed to parse response:', parseError);
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
      console.error('Forever Order Modify API: Dhan API error:', response.status, data);
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

    console.log('Forever Order Modify API: Successfully modified forever order:', data);

    return NextResponse.json({
      success: true,
      endpoint: `/api/trading/forever-orders/${orderId}`,
      data,
      message: 'Forever order modified successfully'
    });

  } catch (error) {
    console.error('Forever Order Modify API: Error in PUT:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('Forever Order Cancel API: DELETE /api/trading/forever-orders/' + orderId);
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Dhan API access token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${DHAN_API_BASE}/v2/forever/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'access-token': ACCESS_TOKEN,
      },
    });

    console.log('Forever Order Cancel API: Dhan response status:', response.status);

    const responseText = await response.text();
    console.log('Forever Order Cancel API: Dhan response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Forever Order Cancel API: Failed to parse response:', parseError);
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
      console.error('Forever Order Cancel API: Dhan API error:', response.status, data);
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

    console.log('Forever Order Cancel API: Successfully cancelled forever order:', data);

    return NextResponse.json({
      success: true,
      endpoint: `/api/trading/forever-orders/${orderId}`,
      data,
      message: 'Forever order cancelled successfully'
    });

  } catch (error) {
    console.error('Forever Order Cancel API: Error in DELETE:', error);
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
