#!/usr/bin/env node

// DATAVISM Platform Emergency Rollback Script
// Run with: node rollback.js

const fs = require('fs');
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(colors[color] + message + colors.reset);
};

const rollback = () => {
  log('\n🔄 DATAVISM PLATFORM EMERGENCY ROLLBACK', 'bold');
  log('='.repeat(50), 'red');
  
  let rollbackCount = 0;
  
  // Rollback package.json
  if (fs.existsSync('package.json.backup')) {
    fs.copyFileSync('package.json.backup', 'package.json');
    log('✅ package.json restored from backup', 'green');
    rollbackCount++;
  } else {
    log('⚠️ package.json.backup not found', 'yellow');
  }
  
  // Rollback next.config.ts
  if (fs.existsSync('next.config.ts.backup')) {
    fs.copyFileSync('next.config.ts.backup', 'next.config.ts');
    log('✅ next.config.ts restored from backup', 'green');
    rollbackCount++;
  } else {
    log('⚠️ next.config.ts.backup not found', 'yellow');
  }
  
  // Rollback pyodide service
  if (fs.existsSync('lib/services/pyodide.ts.backup')) {
    fs.copyFileSync('lib/services/pyodide.ts.backup', 'lib/services/pyodide.ts');
    log('✅ pyodide.ts restored from backup', 'green');
    rollbackCount++;
  } else {
    log('⚠️ pyodide.ts.backup not found', 'yellow');
  }
  
  log('\\n' + '='.repeat(50), 'blue');
  log(`📊 ROLLBACK SUMMARY: ${rollbackCount} files restored`, 'blue');
  log('='.repeat(50), 'blue');
  
  if (rollbackCount > 0) {
    log('\\n🎯 NEXT STEPS AFTER ROLLBACK:', 'blue');
    log('1. rm -rf node_modules package-lock.json', 'yellow');
    log('2. npm install', 'yellow');
    log('3. npm run dev', 'yellow');
    log('4. Test platform functionality', 'yellow');
    log('\\n⚠️ Note: You may encounter the original issues again', 'yellow');
  } else {
    log('\\n❌ No backup files found - manual restoration needed', 'red');
  }
};

// Run rollback if called directly
if (require.main === module) {
  rollback();
}

module.exports = { rollback };