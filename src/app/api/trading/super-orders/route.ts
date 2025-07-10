/**
 * Super Orders API Routes
 * 
 * Handles CRUD operations for Super Orders
 * - POST: Place Super Order
 * - GET: Get Super Order Book
 */

import { NextRequest, NextResponse } from 'next/server';
import { dhanApiClient } from '@/lib/api/client';
import { DHAN_CONFIG } from '@/lib/config/app';
import type { 
  PlaceSuperOrderRequest, 
  DhanSuperOrder, 
  SuperOrderResponse,
  PlaceSuperOrderResponse,
  SuperOrderBookResponse
} from '@/features/trading/types';

export async function POST(request: NextRequest) {
  try {
    const orderData: PlaceSuperOrderRequest = await request.json();
    
    // Validate required fields
    if (!orderData.dhanClientId || !orderData.securityId || !orderData.quantity || 
        !orderData.price || !orderData.targetPrice || !orderData.stopLossPrice || 
        !orderData.trailingJump) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields for super order placement'
      }, { status: 400 });
    }

    // Set default client ID if not provided
    if (!orderData.dhanClientId) {
      orderData.dhanClientId = DHAN_CONFIG.clientId || '';
    }

    // Make API call to Dhan
    const response = await dhanApiClient.post<SuperOrderResponse>(
      '/super/orders',
      orderData
    );

    // The Dhan API client returns the data directly
    const orderResult = response as SuperOrderResponse;

    const successResponse: PlaceSuperOrderResponse = {
      success: true,
      endpoint: '/super/orders',
      data: orderResult,
      message: 'Super order placed successfully'
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Super Order placement error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to place super order',
      endpoint: '/super/orders'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Making request to Dhan API for super orders...');
    
    // Make API call to Dhan to get super order book
    const response = await dhanApiClient.get<DhanSuperOrder[]>('/super/orders');

    console.log('Dhan API Response type:', typeof response);
    console.log('Is response an array?', Array.isArray(response));
    
    // The Dhan API client returns the data directly
    const superOrders: DhanSuperOrder[] = Array.isArray(response) ? response : [];

    console.log(`Successfully retrieved ${superOrders.length} super orders`);

    const successResponse: SuperOrderBookResponse = {
      success: true,
      endpoint: '/super/orders',
      data: superOrders,
      count: superOrders.length
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Super Order book fetch error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch super order book';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      endpoint: '/super/orders',
      data: [],
      count: 0
    }, { status: 500 });
  }
}
