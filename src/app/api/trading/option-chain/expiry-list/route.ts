/**
 * Option Chain Expiry List API Route Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { DHAN_CONFIG } from '@/lib/config/app';

const DHAN_BASE_URL = DHAN_CONFIG.baseUrl;
const DHAN_DATA_ACCESS_TOKEN = DHAN_CONFIG.dataAccessToken;
const DHAN_CLIENT_ID = DHAN_CONFIG.clientId;

export async function POST(request: NextRequest) {
  try {
    if (!DHAN_DATA_ACCESS_TOKEN || !DHAN_CLIENT_ID) {
      return NextResponse.json(
        { 
          error: 'Missing Dhan API credentials',
          message: 'DHAN_DATA_ACCESS_TOKEN and DHAN_CLIENT_ID environment variables are required'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!body.UnderlyingScrip) missingFields.push('UnderlyingScrip');
    if (!body.UnderlyingSeg) missingFields.push('UnderlyingSeg');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          message: `The following fields are required: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400 }
      );
    }

    // Validate field types and values
    if (typeof body.UnderlyingScrip !== 'number' || body.UnderlyingScrip <= 0) {
      return NextResponse.json(
        { 
          error: 'Invalid parameter',
          message: 'UnderlyingScrip must be a positive number'
        },
        { status: 400 }
      );
    }

    if (typeof body.UnderlyingSeg !== 'string' || body.UnderlyingSeg.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Invalid parameter',
          message: 'UnderlyingSeg must be a non-empty string'
        },
        { status: 400 }
      );
    }

    console.log('Expiry List API Request:', {
      url: `${DHAN_BASE_URL}/optionchain/expirylist`,
      headers: {
        'access-token': DHAN_DATA_ACCESS_TOKEN ? `${DHAN_DATA_ACCESS_TOKEN.substring(0, 20)}...` : 'missing',
        'client-id': DHAN_CLIENT_ID || 'missing'
      },
      body
    });

    const response = await fetch(`${DHAN_BASE_URL}/optionchain/expirylist`, {
      method: 'POST',
      headers: {
        'access-token': DHAN_DATA_ACCESS_TOKEN,
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
