// Position conversion utility functions and API calls

export interface ConvertPositionRequest {
  dhanClientId: string;
  fromProductType: "CNC" | "INTRADAY" | "MARGIN" | "CO" | "BO";
  exchangeSegment: "NSE_EQ" | "NSE_FNO" | "NSE_CURRENCY" | "BSE_EQ" | "BSE_FNO" | "BSE_CURRENCY" | "MCX_COMM";
  positionType: "LONG" | "SHORT" | "CLOSED";
  securityId: string;
  tradingSymbol: string;
  convertQty: number;
  toProductType: "CNC" | "INTRADAY" | "MARGIN" | "CO" | "BO";
}

export interface ConvertPositionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Function to convert position
export async function convertPosition(request: ConvertPositionRequest): Promise<ConvertPositionResponse> {
  try {
    const response = await fetch('/api/tradingapi/portfolio/convert-position', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to convert position');
    }

    return {
      success: true,
      message: 'Position converted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to determine if conversion is allowed
export function canConvertPosition(fromProductType: string, toProductType: string): boolean {
  // Define conversion rules
  const conversionRules: Record<string, string[]> = {
    'INTRADAY': ['CNC'],
    'CNC': ['INTRADAY'],
    'MARGIN': ['CNC'],
    // Add more rules as needed
  };

  return conversionRules[fromProductType]?.includes(toProductType) || false;
}

// Get friendly names for product types
export function getProductTypeName(productType: string): string {
  const productTypeNames: Record<string, string> = {
    'CNC': 'Cash & Carry (Delivery)',
    'INTRADAY': 'Intraday',
    'MARGIN': 'Margin',
    'MTF': 'Margin Trading Facility',
    'CO': 'Cover Order',
    'BO': 'Bracket Order',
  };

  return productTypeNames[productType] || productType;
}

/**
 * Validates if a position conversion is allowed based on business rules
 */
export function validateConversion(
  fromProductType: string,
  toProductType: string,
  positionType: string,
  exchangeSegment: string
): { isValid: boolean; reason?: string } {
  // Cannot convert to the same product type
  if (fromProductType === toProductType) {
    return { isValid: false, reason: 'Cannot convert to the same product type' };
  }

  // F&O positions can only be converted between MARGIN and INTRADAY
  if (exchangeSegment.includes('FNO') || exchangeSegment.includes('CURRENCY')) {
    const validFOProductTypes = ['MARGIN', 'INTRADAY'];
    if (!validFOProductTypes.includes(fromProductType) || !validFOProductTypes.includes(toProductType)) {
      return { isValid: false, reason: 'F&O positions can only be converted between MARGIN and INTRADAY' };
    }
  }

  // Equity positions support all conversions
  if (exchangeSegment.includes('EQ')) {
    const validEQProductTypes = ['CNC', 'MARGIN', 'INTRADAY'];
    if (!validEQProductTypes.includes(fromProductType) || !validEQProductTypes.includes(toProductType)) {
      return { isValid: false, reason: 'Invalid product type for equity conversion' };
    }
  }

  // Additional business rules can be added here
  return { isValid: true };
}

/**
 * Gets available product types for conversion based on current position
 */
export function getAvailableProductTypes(
  currentProductType: string,
  exchangeSegment: string
): string[] {
  const allProductTypes = ['CNC', 'INTRADAY', 'MARGIN'];
  
  // Filter out current product type
  let availableTypes = allProductTypes.filter(type => type !== currentProductType);
  
  // For F&O, only allow MARGIN and INTRADAY
  if (exchangeSegment.includes('FNO') || exchangeSegment.includes('CURRENCY')) {
    availableTypes = availableTypes.filter(type => ['MARGIN', 'INTRADAY'].includes(type));
  }
  
  return availableTypes;
}
