#!/usr/bin/env node

// Test script to verify ledger API functionality
const fetch = require('node-fetch');

async function testLedgerAPI() {
  const baseUrl = 'http://localhost:3000';
  const fromDate = '2025-06-10';
  const toDate = '2025-07-10';
  
  try {
    console.log('🔍 Testing Ledger API...');
    console.log(`📅 Date range: ${fromDate} to ${toDate}`);
    
    const response = await fetch(`${baseUrl}/api/trading/ledger?from-date=${fromDate}&to-date=${toDate}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Ledger API is working!');
      console.log(`📊 Total entries: ${data.count}`);
      console.log(`📈 Sample entry:`, data.data[0]);
      
      // Check if data structure is correct
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const entry = data.data[0];
        const requiredFields = ['dhanClientId', 'narration', 'voucherdate', 'exchange', 'debit', 'credit', 'runbal'];
        const hasAllFields = requiredFields.every(field => field in entry);
        
        if (hasAllFields) {
          console.log('✅ Data structure is valid');
        } else {
          console.log('⚠️  Missing required fields in data structure');
        }
      }
    } else {
      console.log('❌ Ledger API failed:', data);
    }
  } catch (error) {
    console.log('❌ Error testing ledger API:', error.message);
  }
}

testLedgerAPI();
