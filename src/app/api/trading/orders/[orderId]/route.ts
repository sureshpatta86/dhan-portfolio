/**
 * Individual Order API Route
 * GET /api/trading/orders/[orderId] - Get order by ID
 * PUT /api/trading/orders/[orderId] - Modify order
 * DELETE /api/trading/orders/[orderId] - Cancel order
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateModifyOrderRequest, OrderValidator, OrderValidationError } from '@/features/trading/validation';

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
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    const { orderId } = await params;
    
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

    // Validate order ID format
    try {
      OrderValidator.validateOrderId(orderId);
    } catch (validationError) {
      if (validationError instanceof OrderValidationError) {
        return NextResponse.json(
          { error: 'Invalid order ID', details: validationError.message },
          { status: 400 }
        );
      }
      throw validationError;
    }

    console.log('Fetching order details for ID:', orderId);

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
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
    console.log('Order details fetched successfully for ID:', orderId);

    return NextResponse.json({
      success: true,
      endpoint: 'order-details',
      data,
      message: 'Order details fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    const { orderId } = await params;
    
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

    const requestBody = await request.json();
    const modifyData = validateModifyOrderRequest(requestBody);
    
    // Validate order ID format
    OrderValidator.validateOrderId(orderId);

    // Ensure the orderId in the request matches the URL parameter
    if (modifyData.orderId !== orderId) {
      return NextResponse.json(
        { error: "Order ID mismatch" },
        { status: 400 }
      );
    }

    console.log('Modifying order via Dhan API:', orderId, modifyData);

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'access-token': accessToken,
      },
      body: JSON.stringify(modifyData),
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
    console.log('Order modified successfully:', data);

    return NextResponse.json({
      success: true,
      endpoint: 'modify-order',
      data,
      message: 'Order modified successfully'
    });

  } catch (error) {
    console.error('Error modifying order:', error);
    
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to modify order',
        details: error instanceof Error ? error.message : 'Unknown error'
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
    const { accessToken, baseUrl } = GET_DHAN_API_CONFIG();
    const { orderId } = await params;
    
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

    // Validate order ID format
    try {
      OrderValidator.validateOrderId(orderId);
    } catch (validationError) {
      if (validationError instanceof OrderValidationError) {
        return NextResponse.json(
          { error: 'Invalid order ID', details: validationError.message },
          { status: 400 }
        );
      }
      throw validationError;
    }

    console.log('Cancelling order via Dhan API:', orderId);

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'DELETE',
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
    console.log('Order cancelled successfully:', data);

    return NextResponse.json({
      success: true,
      endpoint: 'cancel-order',
      data,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to cancel order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
