// Test script to verify API client functionality
const { internalApiClient } = require('./src/lib/api/client.ts');

async function testApiClient() {
    try {
        console.log('Testing API client...');
        
        // Test positions endpoint
        const positionsResponse = await internalApiClient.get('/portfolio/positions');
        console.log('Positions API response:', positionsResponse.success ? 'SUCCESS' : 'FAILED');
        
        // Test holdings endpoint
        const holdingsResponse = await internalApiClient.get('/portfolio/holdings');
        console.log('Holdings API response:', holdingsResponse.success ? 'SUCCESS' : 'FAILED');
        
        console.log('API client test completed successfully');
    } catch (error) {
        console.error('API client test failed:', error.message);
    }
}

testApiClient();
