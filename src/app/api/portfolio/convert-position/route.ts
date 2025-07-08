import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Parse request body
    const requestBody = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'dhanClientId',
      'fromProductType',
      'exchangeSegment',
      'positionType',
      'securityId',
      'tradingSymbol',
      'convertQty',
      'toProductType'
    ];
    
    for (const field of requiredFields) {
      if (!requestBody[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate product types
    const validProductTypes = ['CNC', 'INTRADAY', 'MARGIN', 'CO', 'BO'];
    if (!validProductTypes.includes(requestBody.fromProductType) || 
        !validProductTypes.includes(requestBody.toProductType)) {
      return NextResponse.json(
        { error: 'Invalid product type. Must be one of: CNC, INTRADAY, MARGIN, CO, BO' },
        { status: 400 }
      );
    }

    // Validate position type
    const validPositionTypes = ['LONG', 'SHORT'];
    if (!validPositionTypes.includes(requestBody.positionType)) {
      return NextResponse.json(
        { error: 'Invalid position type. Must be LONG or SHORT' },
        { status: 400 }
      );
    }

    // Call Dhan API
    const dhanResponse = await fetch('https://api.dhan.co/v2/positions/convert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'access-token': ACCESS_TOKEN,
      },
      body: JSON.stringify(requestBody),
    });

    // Handle 202 Accepted (successful conversion request)
    if (dhanResponse.status === 202) {
      return NextResponse.json({
        success: true,
        message: 'Position conversion request accepted'
      });
    }

    // Handle error responses
    if (!dhanResponse.ok) {
      let errorMessage = 'Failed to convert position';
      try {
        const errorData = await dhanResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      
      console.error('Dhan API error:', dhanResponse.status, errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: dhanResponse.status }
      );
    }

    // Handle any other successful responses
    let responseData = null;
    try {
      responseData = await dhanResponse.json();
    } catch {
      // Response might be empty for successful requests
    }

    return NextResponse.json({
      success: true,
      message: 'Position converted successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error converting position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
