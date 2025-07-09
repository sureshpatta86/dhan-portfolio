/**
 * Test script for Orders API implementation
 * This script can be used to test the orders functionality
 */

const API_BASE_URL = 'http://localhost:3000/api/trading';

// Test data for order placement
const testOrderData = {
  dhanClientId: "1000000003",
  correlationId: "test_order_123",
  transactionType: "BUY",
  exchangeSegment: "NSE_EQ", 
  productType: "INTRADAY",
  orderType: "LIMIT",
  validity: "DAY",
  securityId: "11536",
  quantity: 5,
  price: 100.50,
  disclosedQuantity: 2,
  afterMarketOrder: false
};

// Test functions
async function testPlaceOrder() {
  console.log('Testing order placement...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });
    
    const result = await response.json();
    console.log('Place Order Response:', result);
    
    if (result.success && result.data.orderId) {
      return result.data.orderId;
    }
    throw new Error('Order placement failed');
  } catch (error) {
    console.error('Place Order Error:', error);
    return null;
  }
}

async function testGetOrderBook() {
  console.log('Testing order book retrieval...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const result = await response.json();
    console.log('Order Book Response:', result);
    return result.data;
  } catch (error) {
    console.error('Get Order Book Error:', error);
    return null;
  }
}

async function testGetOrderDetails(orderId) {
  console.log(`Testing order details for ID: ${orderId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const result = await response.json();
    console.log('Order Details Response:', result);
    return result.data;
  } catch (error) {
    console.error('Get Order Details Error:', error);
    return null;
  }
}

async function testModifyOrder(orderId) {
  console.log(`Testing order modification for ID: ${orderId}...`);
  const modifyData = {
    dhanClientId: testOrderData.dhanClientId,
    orderId: orderId,
    orderType: "LIMIT",
    validity: "DAY",
    quantity: 10, // Changed quantity
    price: 105.00 // Changed price
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifyData),
    });
    
    const result = await response.json();
    console.log('Modify Order Response:', result);
    return result.data;
  } catch (error) {
    console.error('Modify Order Error:', error);
    return null;
  }
}

async function testCancelOrder(orderId) {
  console.log(`Testing order cancellation for ID: ${orderId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    console.log('Cancel Order Response:', result);
    return result.data;
  } catch (error) {
    console.error('Cancel Order Error:', error);
    return null;
  }
}

async function testOrderByCorrelationId() {
  console.log('Testing order retrieval by correlation ID...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders/external/${testOrderData.correlationId}`);
    const result = await response.json();
    console.log('Order by Correlation ID Response:', result);
    return result.data;
  } catch (error) {
    console.error('Get Order by Correlation ID Error:', error);
    return null;
  }
}

async function testSlicedOrder() {
  console.log('Testing sliced order placement...');
  const slicedOrderData = {
    ...testOrderData,
    quantity: 50000, // Large quantity for slicing
    correlationId: "test_sliced_order_456"
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/slicing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slicedOrderData),
    });
    
    const result = await response.json();
    console.log('Sliced Order Response:', result);
    return result.data;
  } catch (error) {
    console.error('Sliced Order Error:', error);
    return null;
  }
}

async function testTradeBook() {
  console.log('Testing trade book retrieval...');
  try {
    const response = await fetch(`${API_BASE_URL}/trades-book`);
    const result = await response.json();
    console.log('Trade Book Response:', result);
    return result.data;
  } catch (error) {
    console.error('Get Trade Book Error:', error);
    return null;
  }
}

async function testTradesByOrderId(orderId) {
  console.log(`Testing trades by order ID: ${orderId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/trades/${orderId}`);
    const result = await response.json();
    console.log('Trades by Order ID Response:', result);
    return result.data;
  } catch (error) {
    console.error('Get Trades by Order ID Error:', error);
    return null;
  }
}

// Validation tests
async function testValidationErrors() {
  console.log('Testing validation errors...');
  
  // Test missing required fields
  const invalidOrder = {
    dhanClientId: "1000000003",
    // Missing required fields
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidOrder),
    });
    
    const result = await response.json();
    console.log('Validation Error Response:', result);
    
    if (response.status === 400) {
      console.log('✓ Validation working correctly');
    } else {
      console.log('✗ Validation not working as expected');
    }
  } catch (error) {
    console.error('Validation Test Error:', error);
  }
}

// Main test runner
async function runAllTests() {
  console.log('=== Starting Orders API Tests ===\n');
  
  // Test validation first
  await testValidationErrors();
  console.log('\n---\n');
  
  // Test order book (should work even without placing orders)
  await testGetOrderBook();
  console.log('\n---\n');
  
  // Test trade book
  await testTradeBook();
  console.log('\n---\n');
  
  // Note: The following tests require actual API access and may fail in development
  console.log('Note: The following tests require valid Dhan API credentials and may fail in development environment:\n');
  
  // Test order placement
  const orderId = await testPlaceOrder();
  console.log('\n---\n');
  
  if (orderId) {
    // Test order details
    await testGetOrderDetails(orderId);
    console.log('\n---\n');
    
    // Test order modification
    await testModifyOrder(orderId);
    console.log('\n---\n');
    
    // Test trades by order ID
    await testTradesByOrderId(orderId);
    console.log('\n---\n');
    
    // Test order cancellation (should be last)
    await testCancelOrder(orderId);
    console.log('\n---\n');
  }
  
  // Test correlation ID lookup
  await testOrderByCorrelationId();
  console.log('\n---\n');
  
  // Test sliced order
  await testSlicedOrder();
  
  console.log('\n=== Tests Completed ===');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Orders API Test Suite loaded. Call runAllTests() to start testing.');
} else {
  // Node.js environment
  runAllTests().catch(console.error);
}

// Export for use in other files (CommonJS)
module.exports = {
  testPlaceOrder,
  testGetOrderBook,
  testGetOrderDetails,
  testModifyOrder,
  testCancelOrder,
  testOrderByCorrelationId,
  testSlicedOrder,
  testTradeBook,
  testTradesByOrderId,
  testValidationErrors,
  runAllTests
};
