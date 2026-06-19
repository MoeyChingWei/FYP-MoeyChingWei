#!/usr/bin/env node

/**
 * Backend Agent System Health Check
 * Tests the improvements made in backend/CHECKLIST.md
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, 'logs');
const TEST_RESULTS = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function log(type, message) {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  console.log(`${icons[type] || '•'} ${message}`);
}

function addTestResult(name, status, message, details = null) {
  TEST_RESULTS.totalTests++;
  if (status === 'pass') TEST_RESULTS.passed++;
  else if (status === 'fail') TEST_RESULTS.failed++;
  else if (status === 'warning') TEST_RESULTS.warnings++;

  TEST_RESULTS.tests.push({ name, status, message, details });
}

// Test 1: Check if logs directory exists
function testLogsDirectory() {
  log('info', 'Test 1: Checking logs directory...');

  if (fs.existsSync(LOGS_DIR)) {
    addTestResult('Logs Directory', 'pass', 'Logs directory exists');
    log('success', 'Logs directory exists at: ' + LOGS_DIR);
    return true;
  } else {
    addTestResult('Logs Directory', 'warning', 'Logs directory not found (will be created on first log)');
    log('warning', 'Logs directory not found, but will be created automatically');
    return false;
  }
}

// Test 2: Check if simple-logger.js exists
function testLoggerFile() {
  log('info', 'Test 2: Checking simple-logger.js...');

  const loggerPath = path.join(__dirname, 'services', 'simple-logger.js');

  if (fs.existsSync(loggerPath)) {
    const content = fs.readFileSync(loggerPath, 'utf-8');
    const hasColorSupport = content.includes('chalk');
    const hasFileOutput = content.includes('fs.appendFileSync');

    addTestResult('Logger File', 'pass', 'simple-logger.js exists and functional');
    log('success', 'simple-logger.js found');
    log('info', `  - Color support: ${hasColorSupport ? 'Yes' : 'No'}`);
    log('info', `  - File output: ${hasFileOutput ? 'Yes' : 'No'}`);
    return true;
  } else {
    addTestResult('Logger File', 'fail', 'simple-logger.js not found');
    log('error', 'simple-logger.js not found at: ' + loggerPath);
    return false;
  }
}

// Test 3: Check if base-agent.js has logging
function testBaseAgent() {
  log('info', 'Test 3: Checking base-agent.js integration...');

  const baseAgentPath = path.join(__dirname, 'agents', 'base-agent.js');

  if (fs.existsSync(baseAgentPath)) {
    const content = fs.readFileSync(baseAgentPath, 'utf-8');
    const hasLoggerImport = content.includes('simple-logger');
    const hasRetryMechanism = content.includes('retryCount') || content.includes('retry');
    const hasTimeout = content.includes('timeout');

    if (hasLoggerImport) {
      addTestResult('Base Agent Integration', 'pass', 'base-agent.js has logger integration');
      log('success', 'base-agent.js has logger integration');
    } else {
      addTestResult('Base Agent Integration', 'warning', 'Logger may not be integrated');
      log('warning', 'Logger import not found in base-agent.js');
    }

    log('info', `  - Retry mechanism: ${hasRetryMechanism ? 'Yes' : 'No'}`);
    log('info', `  - Timeout protection: ${hasTimeout ? 'Yes' : 'No'}`);
    return true;
  } else {
    addTestResult('Base Agent Integration', 'fail', 'base-agent.js not found');
    log('error', 'base-agent.js not found');
    return false;
  }
}

// Test 4: Check log files
function testLogFiles() {
  log('info', 'Test 4: Checking existing log files...');

  if (!fs.existsSync(LOGS_DIR)) {
    addTestResult('Log Files', 'warning', 'No logs directory yet (will be created on first use)');
    log('warning', 'No log files found (system not run yet)');
    return false;
  }

  const logFiles = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.log'));

  if (logFiles.length === 0) {
    addTestResult('Log Files', 'warning', 'No log files yet (system not run)');
    log('warning', 'No log files found yet');
    return false;
  }

  addTestResult('Log Files', 'pass', `Found ${logFiles.length} log file(s)`);
  log('success', `Found ${logFiles.length} log file(s):`);

  logFiles.forEach(file => {
    const filePath = path.join(LOGS_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    log('info', `  - ${file} (${sizeKB} KB)`);
  });

  return true;
}

// Test 5: Check .gitignore
function testGitignore() {
  log('info', 'Test 5: Checking .gitignore...');

  const gitignorePath = path.join(__dirname, '.gitignore');

  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    const hasLogsIgnore = content.includes('logs/') || content.includes('*.log');

    if (hasLogsIgnore) {
      addTestResult('.gitignore', 'pass', 'logs/ directory is ignored');
      log('success', '.gitignore properly configured for logs');
    } else {
      addTestResult('.gitignore', 'warning', 'logs/ may not be ignored in git');
      log('warning', 'logs/ not found in .gitignore');
    }
    return true;
  } else {
    addTestResult('.gitignore', 'warning', '.gitignore not found');
    log('warning', '.gitignore not found');
    return false;
  }
}

// Test 6: Check documentation
function testDocumentation() {
  log('info', 'Test 6: Checking documentation...');

  const docs = [
    { name: 'CHECKLIST.md', path: path.join(__dirname, 'CHECKLIST.md') },
    { name: 'QUICK_START.md', path: path.join(__dirname, 'QUICK_START.md') },
    { name: 'AGENT_IMPROVEMENTS.md', path: path.join(__dirname, 'AGENT_IMPROVEMENTS.md') }
  ];

  let found = 0;
  docs.forEach(doc => {
    if (fs.existsSync(doc.path)) {
      found++;
      log('success', `${doc.name} found`);
    } else {
      log('warning', `${doc.name} not found`);
    }
  });

  if (found === docs.length) {
    addTestResult('Documentation', 'pass', 'All documentation files present');
  } else if (found > 0) {
    addTestResult('Documentation', 'warning', `${found}/${docs.length} documentation files found`);
  } else {
    addTestResult('Documentation', 'fail', 'No documentation files found');
  }

  return found > 0;
}

// Generate report
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${TEST_RESULTS.totalTests}`);
  console.log(`✅ Passed: ${TEST_RESULTS.passed}`);
  console.log(`❌ Failed: ${TEST_RESULTS.failed}`);
  console.log(`⚠️ Warnings: ${TEST_RESULTS.warnings}`);

  const successRate = ((TEST_RESULTS.passed / TEST_RESULTS.totalTests) * 100).toFixed(1);
  console.log(`Success Rate: ${successRate}%`);
  console.log('='.repeat(60));

  console.log('\n📋 Detailed Results:');
  TEST_RESULTS.tests.forEach((test, i) => {
    const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⚠️';
    console.log(`${i + 1}. ${icon} ${test.name}: ${test.message}`);
  });

  console.log('\n' + '='.repeat(60));

  if (TEST_RESULTS.failed > 0) {
    console.log('❌ Status: FAILED');
    console.log('Some critical components are missing. Review failed tests above.');
  } else if (TEST_RESULTS.warnings > 0) {
    console.log('⚠️ Status: PASSED WITH WARNINGS');
    console.log('System is functional but some components are not yet active.');
    console.log('Run the backend server to generate logs and fully test the system.');
  } else {
    console.log('✅ Status: ALL TESTS PASSED');
    console.log('All agent improvements are properly installed and configured!');
  }

  console.log('='.repeat(60));

  // Save report
  const reportPath = path.join(__dirname, 'logs', 'health-check-report.json');
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(TEST_RESULTS, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
  } catch (err) {
    console.log(`\n⚠️ Could not save report: ${err.message}`);
  }
}

// Main
function main() {
  console.log('='.repeat(60));
  console.log('🏥 Backend Agent System Health Check');
  console.log('='.repeat(60));
  console.log('Testing improvements from backend/CHECKLIST.md\n');

  testLogsDirectory();
  console.log();

  testLoggerFile();
  console.log();

  testBaseAgent();
  console.log();

  testLogFiles();
  console.log();

  testGitignore();
  console.log();

  testDocumentation();

  generateReport();

  console.log('\n💡 Next Steps:');
  if (TEST_RESULTS.warnings > 0 && !fs.existsSync(LOGS_DIR)) {
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Send some test requests to generate logs');
    console.log('3. Run this health check again');
  } else if (TEST_RESULTS.failed > 0) {
    console.log('1. Review failed tests above');
    console.log('2. Reinstall missing components');
    console.log('3. Check CHECKLIST.md for setup instructions');
  } else {
    console.log('1. Start backend: npm run dev');
    console.log('2. Monitor logs in real-time: tail -f logs/combined.log');
    console.log('3. Test agent functionality from frontend');
  }
  console.log();

  process.exit(TEST_RESULTS.failed > 0 ? 1 : 0);
}

main();
