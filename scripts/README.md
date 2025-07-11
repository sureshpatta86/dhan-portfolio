# Scripts Directory

This directory contains development, testing, and utility scripts for the portfolio analysis application.

## Directory Structure

```
scripts/
├── test/                  # Testing scripts
│   └── api/              # API testing scripts
│       ├── test-api-client.js          # Internal API client tests
│       ├── test-dhan-connectivity.js   # Dhan API connectivity tests
│       ├── test-orders-api.js          # Orders API functionality tests
│       ├── test-ledger-api.js          # Ledger API tests
│       ├── test-super-order-api.js     # Super Order API tests
│       └── test-ledger-api.sh          # Shell script for ledger API testing
├── debug/                # Debug utilities
│   └── debug-config.js   # Environment variables debug
└── README.md            # This file
```

## Script Categories

### API Testing Scripts (`test/api/`)

These scripts test various API endpoints and functionality:

#### `test-api-client.js`
- Tests internal API client functionality
- Verifies positions and holdings endpoints
- Usage: `node scripts/test/api/test-api-client.js`

#### `test-dhan-connectivity.js`
- Tests connectivity to Dhan API
- Verifies authentication and basic endpoints
- Usage: `node scripts/test/api/test-dhan-connectivity.js`

#### `test-orders-api.js`
- Comprehensive testing of orders API
- Tests order placement, modification, and retrieval
- Usage: `node scripts/test/api/test-orders-api.js`

#### `test-ledger-api.js`
- Tests ledger and funds API endpoints
- Verifies balance and transaction data
- Usage: `node scripts/test/api/test-ledger-api.js`

#### `test-super-order-api.js`
- Tests super order functionality
- Verifies complex order operations
- Usage: `node scripts/test/api/test-super-order-api.js`

#### `test-ledger-api.sh`
- Shell script for ledger API testing
- Can be used in CI/CD pipelines
- Usage: `chmod +x scripts/test/api/test-ledger-api.sh && ./scripts/test/api/test-ledger-api.sh`

### Debug Scripts (`debug/`)

#### `debug-config.js`
- Debugs environment variable configuration
- Checks for missing or incorrect environment variables
- Usage: `node scripts/debug/debug-config.js`

## Running Scripts

### Prerequisites
- Ensure the application is running: `npm run dev`
- Set up proper environment variables in `.env.local`
- Ensure Dhan API credentials are configured

### Quick Test Commands

```bash
# Test all APIs sequentially
npm run test:api

# Test specific API endpoint
node scripts/test/api/test-orders-api.js

# Debug configuration
node scripts/debug/debug-config.js

# Test connectivity
node scripts/test/api/test-dhan-connectivity.js
```

## Adding New Scripts

When adding new scripts:

1. **API Tests**: Place in `scripts/test/api/`
2. **Debug Tools**: Place in `scripts/debug/`
3. **Utilities**: Create new subdirectory as needed
4. **Follow naming convention**: `{purpose}-{feature}.js`
5. **Add documentation**: Update this README

## Script Guidelines

### File Naming
- Use kebab-case: `test-orders-api.js`
- Be descriptive: Include purpose and target
- Add file extension: `.js` for JavaScript, `.sh` for shell

### Code Standards
- Add descriptive comments
- Include error handling
- Log meaningful output
- Use async/await for promises
- Include usage instructions in comments

### Environment Variables
Scripts should:
- Check for required environment variables
- Provide helpful error messages
- Use the same environment variables as the main app

## Integration with Package.json

Add script shortcuts to `package.json`:

```json
{
  "scripts": {
    "test:api": "node scripts/test/api/test-api-client.js",
    "test:orders": "node scripts/test/api/test-orders-api.js",
    "test:connectivity": "node scripts/test/api/test-dhan-connectivity.js",
    "debug:config": "node scripts/debug/debug-config.js"
  }
}
```

## Best Practices

1. **Make scripts idempotent**: Can be run multiple times safely
2. **Use environment variables**: Don't hardcode sensitive data
3. **Provide clear output**: Use colors and formatting for better UX
4. **Handle errors gracefully**: Exit with proper codes
5. **Document usage**: Include help text and examples
