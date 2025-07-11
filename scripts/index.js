#!/usr/bin/env node

/**
 * Script Manager - Run all test scripts or specific ones
 * Usage: node scripts/index.js [script-name]
 */

const { spawn } = require('child_process');
const path = require('path');

const scripts = {
  'api': 'test/api/test-api-client.js',
  'connectivity': 'test/api/test-dhan-connectivity.js', 
  'orders': 'test/api/test-orders-api.js',
  'ledger': 'test/api/test-ledger-api.js',
  'super-orders': 'test/api/test-super-order-api.js',
  'debug': 'debug/debug-config.js'
};

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, scriptPath);
    const child = spawn('node', [fullPath], { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Available scripts:');
    Object.keys(scripts).forEach(name => {
      console.log(`  - ${name}: ${scripts[name]}`);
    });
    console.log('\n🚀 Usage: node scripts/index.js [script-name]');
    console.log('📄 Example: node scripts/index.js connectivity');
    return;
  }
  
  const scriptName = args[0];
  
  if (scriptName === 'all') {
    console.log('🔄 Running all test scripts...\n');
    for (const [name, scriptPath] of Object.entries(scripts)) {
      if (name !== 'debug') {
        console.log(`\n🧪 Running ${name}...`);
        try {
          await runScript(scriptPath);
          console.log(`✅ ${name} completed successfully`);
        } catch (error) {
          console.error(`❌ ${name} failed:`, error.message);
        }
      }
    }
    return;
  }
  
  if (!scripts[scriptName]) {
    console.error(`❌ Unknown script: ${scriptName}`);
    console.log('📋 Available scripts:', Object.keys(scripts).join(', '));
    process.exit(1);
  }
  
  console.log(`🧪 Running ${scriptName}...`);
  try {
    await runScript(scripts[scriptName]);
    console.log(`✅ ${scriptName} completed successfully`);
  } catch (error) {
    console.error(`❌ ${scriptName} failed:`, error.message);
    process.exit(1);
  }
}

main().catch(console.error);
