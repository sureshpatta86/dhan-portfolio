/**
 * Test script for Super Order API endpoints
 * Run with: node test-super-order-api.js
 */

const API_BASE = 'http://localhost:3001/api';

// Mock data for testing
const testSuperOrder = {
  dhanClientId: 'TEST_CLIENT_123',
  correlationId: `super_test_${Date.now()}`,
  transactionType: 'BUY',
  exchangeSegment: 'NSE_EQ',
  productType: 'CNC',
  orderType: 'LIMIT',
  securityId: '11536', // HDFCBANK from API docs
  quantity: 5,
  price: 1500,
  targetPrice: 1600,
  stopLossPrice: 1400,
  trailingJump: 10
};

const testModifyData = {
  dhanClientId: 'TEST_CLIENT_123',
  legName: 'TARGET_LEG',
  targetPrice: 1650,
  trailingJump: 15
};

// Utility function to make API calls
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return {
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function testPlaceSuperOrder() {
  console.log('\n🚀 Testing Place Super Order...');
  
  const result = await makeRequest('/trading/super-orders', {
    method: 'POST',
    body: JSON.stringify(testSuperOrder)
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.ok && result.data.success) {
    console.log('✅ Super order placed successfully');
    return result.data.data.orderId;
  } else {
    console.log('❌ Failed to place super order');
    return null;
  }
}

async function testGetSuperOrderBook() {
  console.log('\n📋 Testing Get Super Order Book...');
  
  const result = await makeRequest('/trading/super-orders');
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.ok) {
    console.log('✅ Super order book retrieved successfully');
    return result.data.data || [];
  } else {
    console.log('❌ Failed to get super order book');
    return [];
  }
}

async function testModifySuperOrder(orderId) {
  if (!orderId) {
    console.log('\n⏭️  Skipping modify test - no order ID');
    return;
  }
  
  console.log('\n✏️  Testing Modify Super Order...');
  
  const result = await makeRequest(`/trading/super-orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...testModifyData,
      orderId
    })
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.ok && result.data.success) {
    console.log('✅ Super order modified successfully');
  } else {
    console.log('❌ Failed to modify super order');
  }
}

async function testCancelSuperOrder(orderId) {
  if (!orderId) {
    console.log('\n⏭️  Skipping cancel test - no order ID');
    return;
  }
  
  console.log('\n🗑️  Testing Cancel Super Order...');
  
  const result = await makeRequest(`/trading/super-orders/${orderId}/ENTRY_LEG`, {
    method: 'DELETE'
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.ok && result.data.success) {
    console.log('✅ Super order cancelled successfully');
  } else {
    console.log('❌ Failed to cancel super order');
  }
}

// Main test function
async function runTests() {
  console.log('🔬 Starting Super Order API Tests...');
  console.log('=====================================');
  
  // Test 1: Get Super Order Book (should work even with no orders)
  const initialOrders = await testGetSuperOrderBook();
  
  // Test 2: Place Super Order
  const orderId = await testPlaceSuperOrder();
  
  // Test 3: Get Super Order Book again
  await testGetSuperOrderBook();
  
  // Test 4: Modify Super Order (if we have an order ID)
  await testModifySuperOrder(orderId);
  
  // Test 5: Cancel Super Order (if we have an order ID)
  await testCancelSuperOrder(orderId);
  
  console.log('\n🏁 Tests completed!');
  console.log('=====================================');
  console.log('\nNote: These tests will likely fail with the actual Dhan API');
  console.log('because they require valid authentication and real security IDs.');
  console.log('The tests are primarily to verify our API structure and error handling.');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testPlaceSuperOrder,
  testGetSuperOrderBook,
  testModifySuperOrder,
  testCancelSuperOrder
};
