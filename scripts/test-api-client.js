#!/usr/bin/env node

/**
 * Simple test to verify API client works
 */

const { internalApiClient } = require('../src/lib/api/client');

async function testApiClient() {
  try {
    console.log('Testing internal API client...');
    
    const response = await internalApiClient.post('/api/trading/option-chain/expiry-list', {
      UnderlyingScrip: 13,
      UnderlyingSeg: 'IDX_I'
    });

    console.log('Response:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response || {}));
    
    if (response && response.data) {
      console.log('Data:', response.data);
      console.log('Data length:', response.data.length);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testApiClient();
