/**
 * Test Dhan API connectivity and authentication
 * Usage: node scripts/test/api/test-dhan-connectivity.js
 */

const API_BASE = 'http://localhost:3000/api';

async function testDhanApiConnectivity() {
  console.log('🔍 Testing Dhan API Connectivity...');
  console.log('=====================================');

  // Test funds endpoint as it's simpler than super orders
  try {
    console.log('\n📊 Testing Funds API...');
    const response = await fetch(`${API_BASE}/trading/funds`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Dhan API connection working - funds retrieved successfully');
      return true;
    } else {
      console.log('❌ Dhan API connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testSuperOrderApiDirectly() {
  console.log('\n🎯 Testing Super Order API directly...');
  
  try {
    const response = await fetch(`${API_BASE}/trading/super-orders`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Super Order API working');
      return true;
    } else {
      console.log('❌ Super Order API failed');
      
      // Check for specific error patterns
      if (data.error && data.error.includes('No response data from Dhan API')) {
        console.log('\n🔍 Debugging info:');
        console.log('- This error suggests the external Dhan API call is not returning expected data');
        console.log('- Check server logs for more details about the actual API response');
        console.log('- Verify that your Dhan account has Super Order feature enabled');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function runConnectivityTests() {
  const fundsWorking = await testDhanApiConnectivity();
  const superOrderWorking = await testSuperOrderApiDirectly();
  
  console.log('\n📋 Summary:');
  console.log('=====================================');
  console.log(`Dhan API (Funds): ${fundsWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`Super Order API: ${superOrderWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (!fundsWorking) {
    console.log('\n💡 Recommendation: Fix basic Dhan API connectivity first');
  } else if (!superOrderWorking) {
    console.log('\n💡 Recommendation: Super Order feature may not be enabled for your account');
  } else {
    console.log('\n🎉 All APIs working correctly!');
  }
}

// Run tests
runConnectivityTests().catch(console.error);
