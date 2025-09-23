#!/usr/bin/env node
/*
 * Comprehensive verification script for all FontAwesome versions (free and pro)
 * Validates that all icon sets are working correctly and pro icons are accessible.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scripts = [
  'verify:fa5',
  'verify:fa6', 
  'verify:fa7',
  'verify:fa5-pro',
  'verify:fa6-pro',
  'verify:fa7-pro'
];

function runScript(script) {
  console.log(`\n=== Running ${script} ===`);
  try {
    const output = execSync(`npm run ${script}`, { encoding: 'utf8', cwd: __dirname + '/..' });
    console.log(output);
    return { script, success: true, output };
  } catch (error) {
    console.error(`❌ ${script} FAILED:`);
    console.error(error.stdout || error.message);
    return { script, success: false, error: error.stdout || error.message };
  }
}

function main() {
  console.log('🔍 Running comprehensive FontAwesome icon verification...\n');
  
  const results = scripts.map(runScript);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  
  if (successes.length > 0) {
    console.log(`\n✅ PASSED (${successes.length}):`);
    successes.forEach(r => console.log(`  - ${r.script}`));
  }
  
  if (failures.length > 0) {
    console.log(`\n❌ FAILED (${failures.length}):`);
    failures.forEach(r => console.log(`  - ${r.script}`));
  }
  
  console.log(`\nTotal: ${results.length} verifications`);
  console.log(`Success Rate: ${Math.round(successes.length / results.length * 100)}%`);
  
  if (failures.length === 0) {
    console.log('\n🎉 ALL VERIFICATIONS PASSED!');
    console.log('FontAwesome Pro icons are now properly accessible.');
    process.exit(0);
  } else {
    console.log(`\n💥 ${failures.length} VERIFICATION(S) FAILED!`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}