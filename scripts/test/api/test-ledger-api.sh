#!/bin/bash

# Test script to verify the ledger API and component functionality
echo "Testing ledger API endpoints..."

# Test without dates (should return 400)
echo "1. Testing without dates (should return 400):"
curl -s "http://localhost:3002/api/trading/ledger" | jq '.'

echo -e "\n2. Testing with valid dates (should return 200):"
curl -s "http://localhost:3002/api/trading/ledger?from-date=2024-01-01&to-date=2024-01-31" | jq '.success, .count'

echo -e "\n3. Testing with current month dates:"
FROM_DATE=$(date -v-30d '+%Y-%m-%d')
TO_DATE=$(date '+%Y-%m-%d')
curl -s "http://localhost:3002/api/trading/ledger?from-date=$FROM_DATE&to-date=$TO_DATE" | jq '.success, .count'

echo -e "\nAPI tests completed."
