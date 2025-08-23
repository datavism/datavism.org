#!/usr/bin/env node

// DATAVISM Platform Verification Script
// Run with: node verify-system.js
// Or in browser console after loading Level 1

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

const runNodeVerification = () => {
  log('\n🔍 DATAVISM PLATFORM VERIFICATION (Node.js)', 'bold');
  log('='.repeat(50), 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };
  
  const test = (name, condition, severity = 'error') => {
    const symbol = condition ? '✅' : (severity === 'warning' ? '⚠️' : '❌');
    const status = condition ? 'PASS' : (severity === 'warning' ? 'WARN' : 'FAIL');
    
    log(`${symbol} ${name}: ${status}`, condition ? 'green' : (severity === 'warning' ? 'yellow' : 'red'));
    
    results.details.push({ name, status, condition });
    
    if (condition) {
      results.passed++;
    } else if (severity === 'warning') {
      results.warnings++;
    } else {
      results.failed++;
    }
  };
  
  // Test 1: Check if we're in the right directory
  const fs = require('fs');
  const path = require('path');
  
  test('Project directory structure', 
    fs.existsSync('package.json') && fs.existsSync('app') && fs.existsSync('components'));
  
  // Test 2: Package.json validation
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    test('Zod version fixed (not 4.x)', 
      packageJson.dependencies.zod === '^3.22.4');
    
    test('React version stable (18.x)', 
      packageJson.dependencies.react === '^18.2.0');
    
    test('Turbopack flags removed', 
      !packageJson.scripts.dev.includes('--turbopack') && !packageJson.scripts.build.includes('--turbopack'));
    
    test('@types/react version matching', 
      packageJson.devDependencies['@types/react'] === '^18');
  } else {
    test('Package.json exists', false);
  }
  
  // Test 3: Next.js config validation
  if (fs.existsSync('next.config.ts')) {
    const configContent = fs.readFileSync('next.config.ts', 'utf8');
    
    test('Next.js config enhanced', 
      configContent.includes('Cross-Origin-Embedder-Policy'));
    
    test('Webpack fallbacks configured', 
      configContent.includes('config.resolve.fallback'));
  } else {
    test('Next.js config exists', false);
  }
  
  // Test 4: Pyodide service validation
  const pyodideServicePath = 'lib/services/pyodide.ts';
  if (fs.existsSync(pyodideServicePath)) {
    const serviceContent = fs.readFileSync(pyodideServicePath, 'utf8');
    
    test('Pyodide service hardened', 
      serviceContent.includes('PYODIDE_CDNS') && serviceContent.includes('_loadPyodideWithFallback'));
    
    test('CDN fallback system', 
      serviceContent.includes('jsdelivr.net') && serviceContent.includes('unpkg.com'));
    
    test('Enhanced resistance toolkit', 
      serviceContent.includes('ResistanceToolkit') && serviceContent.includes('OutputCapture'));
  } else {
    test('Pyodide service exists', false);
  }
  
  // Test 5: usePython hook validation
  const usePythonPath = 'lib/hooks/usePython.ts';
  if (fs.existsSync(usePythonPath)) {
    const hookContent = fs.readFileSync(usePythonPath, 'utf8');
    
    test('usePython hook updated', 
      hookContent.includes('getLoadingState') && !hookContent.includes('RESISTANCE_TOOLKIT = `'));
  } else {
    test('usePython hook exists', false);
  }
  
  // Test 6: Level 1 component validation
  const level1Path = 'app/bootcamp/level/1/page.tsx';
  if (fs.existsSync(level1Path)) {
    const componentContent = fs.readFileSync(level1Path, 'utf8');
    test('Level 1 component exists', true);
  } else {
    test('Level 1 component exists', false);
  }
  
  // Test 7: Backup files created
  test('Package.json backup created', fs.existsSync('package.json.backup'));
  test('Next.js config backup created', fs.existsSync('next.config.ts.backup'));
  
  // Results Summary
  log('\\n' + '='.repeat(50), 'blue');
  log('📊 VERIFICATION SUMMARY', 'bold');
  log('='.repeat(50), 'blue');
  log(`✅ Tests Passed: ${results.passed}`, 'green');
  log(`❌ Tests Failed: ${results.failed}`, 'red');
  log(`⚠️ Warnings: ${results.warnings}`, 'yellow');
  
  const totalTests = results.passed + results.failed + results.warnings;
  const successRate = (results.passed / totalTests * 100).toFixed(1);
  log(`📈 Success Rate: ${successRate}%`, 'blue');
  
  // Overall Status
  let overallStatus;
  if (results.failed === 0 && results.warnings <= 2) {
    overallStatus = '🚀 PLATFORM READY FOR PRODUCTION';
    log('\\n' + overallStatus, 'green');
  } else if (results.failed <= 2) {
    overallStatus = '⚠️ PLATFORM FUNCTIONAL WITH MINOR ISSUES';
    log('\\n' + overallStatus, 'yellow');
  } else {
    overallStatus = '🚨 PLATFORM NEEDS IMMEDIATE ATTENTION';
    log('\\n' + overallStatus, 'red');
  }
  
  log('='.repeat(50), 'blue');
  
  // Recommendations
  if (results.failed > 0) {
    log('\\n🔧 ISSUES TO FIX:', 'red');
    results.details.forEach(test => {
      if (test.status === 'FAIL') {
        log(`- ${test.name}`, 'red');
      }
    });
  }
  
  if (results.warnings > 0) {
    log('\\n💡 SUGGESTED IMPROVEMENTS:', 'yellow');
    results.details.forEach(test => {
      if (test.status === 'WARN') {
        log(`- ${test.name}`, 'yellow');
      }
    });
  }
  
  log('\\n🎯 NEXT STEPS:', 'blue');
  if (results.failed === 0) {
    log('1. Run: npm install', 'blue');
    log('2. Run: npm run dev', 'blue');
    log('3. Test: http://localhost:3000/bootcamp/level/1', 'blue');
    log('4. Verify Python loads and executes code', 'blue');
  } else {
    log('1. Fix failed tests above', 'red');
    log('2. Re-run verification', 'blue');
    log('3. Use rollback if needed: node rollback.js', 'yellow');
  }
  
  return results;
};

// Browser verification function (for when loaded in browser)
const runBrowserVerification = () => {
  console.log('%c🔍 DATAVISM PLATFORM VERIFICATION (Browser)', 'font-size: 16px; font-weight: bold; color: #00ff00;');
  console.log('='.repeat(50));
  
  const results = { passed: 0, failed: 0, warnings: 0, details: [] };
  
  const test = (name, condition, severity = 'error') => {
    const symbol = condition ? '✅' : (severity === 'warning' ? '⚠️' : '❌');
    const status = condition ? 'PASS' : (severity === 'warning' ? 'WARN' : 'FAIL');
    const color = condition ? 'color: #00ff00' : (severity === 'warning' ? 'color: #ffff00' : 'color: #ff0000');
    
    console.log(`%c${symbol} ${name}: ${status}`, color);
    
    if (condition) results.passed++;
    else if (severity === 'warning') results.warnings++;
    else results.failed++;
  };
  
  // Test React version
  test('React 18.x loaded', 
    window.React && window.React.version && window.React.version.startsWith('18'));
  
  // Test Next.js
  test('Next.js router available', 
    window.next && window.next.router);
  
  // Test Python environment
  const codeEditor = document.querySelector('textarea[placeholder*="resistance"]');
  test('Code editor present', codeEditor !== null);
  
  const challengeTitle = document.querySelector('h2');
  test('Challenge content loaded', 
    challengeTitle && challengeTitle.textContent.includes('📱'));
  
  // Test local storage
  let localStorageWorking = false;
  try {
    localStorage.setItem('test', 'test');
    localStorageWorking = localStorage.getItem('test') === 'test';
    localStorage.removeItem('test');
  } catch (e) {
    localStorageWorking = false;
  }
  test('Progress persistence available', localStorageWorking);
  
  console.log('\\n📊 BROWSER VERIFICATION COMPLETE');
  console.log(`✅ Passed: ${results.passed} | ❌ Failed: ${results.failed} | ⚠️ Warnings: ${results.warnings}`);
  
  return results;
};

// Export functions for both environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  if (require.main === module) {
    runNodeVerification();
  }
  module.exports = { runNodeVerification, runBrowserVerification };
} else {
  // Browser environment
  window.datavismVerify = runBrowserVerification;
  console.log('%cTo run verification, type: datavismVerify()', 'color: #00ff00; font-weight: bold;');
}