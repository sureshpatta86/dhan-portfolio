import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const { params: pathParams } = resolvedParams;
    
    // Expected format: [from-date, to-date, page]
    if (!pathParams || pathParams.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid parameters. Expected format: /trades/{from-date}/{to-date}/{page}' },
        { status: 400 }
      );
    }

    const [fromDate, toDate, page] = pathParams;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate page number
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 0) {
      return NextResponse.json(
        { error: 'Invalid page number. Must be a non-negative integer' },
        { status: 400 }
      );
    }

    const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.dhan.co/v2/trades/${fromDate}/${toDate}/${page}`,
      {
        headers: {
          'Accept': 'application/json',
          'access-token': ACCESS_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dhan API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch trade history from Dhan API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trade history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
