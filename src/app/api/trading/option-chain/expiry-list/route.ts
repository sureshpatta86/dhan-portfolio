/**
 * Option Chain Expiry List API Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { DHAN_CONFIG } from '@/lib/config/app';

const DHAN_BASE_URL = DHAN_CONFIG.baseUrl;
const DHAN_ACCESS_TOKEN = DHAN_CONFIG.accessToken;
const DHAN_CLIENT_ID = DHAN_CONFIG.clientId;

export async function POST(request: NextRequest) {
  try {
    if (!DHAN_ACCESS_TOKEN || !DHAN_CLIENT_ID) {
      return NextResponse.json(
        { 
          error: 'Missing Dhan API credentials',
          message: 'DHAN_ACCESS_TOKEN and DHAN_CLIENT_ID environment variables are required'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.UnderlyingScrip || !body.UnderlyingSeg) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          message: 'UnderlyingScrip and UnderlyingSeg are required'
        },
        { status: 400 }
      );
    }

    console.log('Expiry List API Request:', {
      url: `${DHAN_BASE_URL}/optionchain/expirylist`,
      headers: {
        'access-token': DHAN_ACCESS_TOKEN ? `${DHAN_ACCESS_TOKEN.substring(0, 20)}...` : 'missing',
        'client-id': DHAN_CLIENT_ID || 'missing'
      },
      body
    });

    const response = await fetch(`${DHAN_BASE_URL}/optionchain/expirylist`, {
      method: 'POST',
      headers: {
        'access-token': DHAN_ACCESS_TOKEN,
        'client-id': DHAN_CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('Dhan Expiry List API Response Status:', response.status);
    console.log('Dhan Expiry List API Response:', responseText.substring(0, 500));

    if (!response.ok) {
      let errorMessage = `Dhan API error: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }

      return NextResponse.json(
        { 
          error: 'Dhan API Error',
          message: errorMessage,
          status: response.status
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Dhan API response:', e);
      return NextResponse.json(
        { 
          error: 'Invalid API Response',
          message: 'Failed to parse response from Dhan API'
        },
        { status: 500 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { 
          error: 'No data received',
          message: 'No response data from Dhan API'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Expiry List API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
