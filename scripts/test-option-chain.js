#!/usr/bin/env node

/**
 * Test script for Option Chain APIs
 * Tests both expiry list and option chain data fetching
 */

require('dotenv').config({ path: '.env.local' });

const DHAN_BASE_URL = process.env.DHAN_BASE_URL || 'https://api.dhan.co/v2';
const DHAN_DATA_ACCESS_TOKEN = process.env.DHAN_DATA_ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

console.log('🔍 Testing Option Chain APIs');
console.log('Base URL:', DHAN_BASE_URL);
console.log('Client ID:', DHAN_CLIENT_ID ? `${DHAN_CLIENT_ID.substring(0, 10)}...` : 'Missing');
console.log('Data Access Token:', DHAN_DATA_ACCESS_TOKEN ? `${DHAN_DATA_ACCESS_TOKEN.substring(0, 20)}...` : 'Missing');

if (!DHAN_DATA_ACCESS_TOKEN || !DHAN_CLIENT_ID) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Test data
const testUnderlying = {
  UnderlyingScrip: 13,
  UnderlyingSeg: 'IDX_I'
};

async function testExpiryList() {
  console.log('\n📅 Testing Expiry List API...');
  
  try {
    const response = await fetch(`${DHAN_BASE_URL}/optionchain/expirylist`, {
      method: 'POST',
      headers: {
        'access-token': DHAN_DATA_ACCESS_TOKEN,
        'client-id': DHAN_CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUnderlying),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw Response:', responseText.substring(0, 500));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Expiry List API Success');
    console.log('Expiry Count:', data.data?.length || 0);
    console.log('First few expiries:', data.data?.slice(0, 5) || []);
    
    return data.data?.[0]; // Return first expiry for option chain test
  } catch (error) {
    console.error('❌ Expiry List API Error:', error.message);
    return null;
  }
}

async function testOptionChain(expiry) {
  if (!expiry) {
    console.log('\n⚠️  Skipping Option Chain test - no expiry available');
    return;
  }

  console.log('\n📊 Testing Option Chain API...');
  
  try {
    const requestBody = {
      ...testUnderlying,
      Expiry: expiry
    };

    console.log('Request Body:', requestBody);

    const response = await fetch(`${DHAN_BASE_URL}/optionchain`, {
      method: 'POST',
      headers: {
        'access-token': DHAN_DATA_ACCESS_TOKEN,
        'client-id': DHAN_CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw Response Length:', responseText.length);
    console.log('Raw Response Preview:', responseText.substring(0, 200));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Option Chain API Success');
    console.log('Last Price:', data.data?.last_price);
    console.log('Strike Count:', Object.keys(data.data?.oc || {}).length);
    
    // Show a sample strike
    const strikes = Object.keys(data.data?.oc || {});
    if (strikes.length > 0) {
      const sampleStrike = strikes[Math.floor(strikes.length / 2)];
      console.log('Sample Strike:', sampleStrike);
      console.log('CE LTP:', data.data.oc[sampleStrike]?.ce?.last_price || 'N/A');
      console.log('PE LTP:', data.data.oc[sampleStrike]?.pe?.last_price || 'N/A');
    }
    
  } catch (error) {
    console.error('❌ Option Chain API Error:', error.message);
  }
}

async function testLocalAPIs() {
  console.log('\n🏠 Testing Local API Routes...');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test expiry list
    console.log('Testing local expiry list API...');
    const expiryResponse = await fetch(`${baseUrl}/api/trading/option-chain/expiry-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUnderlying),
    });

    if (expiryResponse.ok) {
      const expiryData = await expiryResponse.json();
      console.log('✅ Local Expiry List API Success');
      console.log('Expiry Count:', expiryData.data?.length || 0);
      
      // Test option chain if we have an expiry
      if (expiryData.data?.[0]) {
        console.log('Testing local option chain API...');
        const chainResponse = await fetch(`${baseUrl}/api/trading/option-chain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...testUnderlying,
            Expiry: expiryData.data[0]
          }),
        });

        if (chainResponse.ok) {
          const chainData = await chainResponse.json();
          console.log('✅ Local Option Chain API Success');
          console.log('Last Price:', chainData.data?.last_price);
          console.log('Strike Count:', Object.keys(chainData.data?.oc || {}).length);
        } else {
          console.error('❌ Local Option Chain API Error:', chainResponse.status);
        }
      }
    } else {
      console.error('❌ Local Expiry List API Error:', expiryResponse.status);
    }
  } catch (error) {
    console.error('❌ Local API Test Error:', error.message);
    console.log('💡 Make sure the Next.js development server is running on port 3000');
  }
}

async function main() {
  console.log('🚀 Starting Option Chain API Tests\n');
  
  // Test direct Dhan APIs
  const firstExpiry = await testExpiryList();
  await testOptionChain(firstExpiry);
  
  // Test local API routes
  await testLocalAPIs();
  
  console.log('\n✨ Testing complete!');
}

main().catch(console.error);
