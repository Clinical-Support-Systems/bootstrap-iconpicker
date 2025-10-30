#!/usr/bin/env node
/*
 * Verification script for Font Awesome 7.0.1 Pro icon list in iconset-fontawesome-7-all.js
 * Validates that Pro icons are accessible and includes critical pro-only icons.
 */
const fs = require('fs');
const path = require('path');

const vm = require('vm');
const ICONSET_PATH = path.join(__dirname, '..', 'src', 'js', 'iconset', 'iconset-fontawesome-7-all.js');

function loadIconsetData() {
  const code = fs.readFileSync(ICONSET_PATH, 'utf8');
  const sandbox = { jQuery: function () {}, console };
  sandbox.jQuery.fn = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const data = sandbox.jQuery.iconset_fontawesome_7;
  if (!data || !Array.isArray(data.allVersions)) {
    throw new Error('Iconset data not found after evaluating iconset file.');
  }
  return data;
}

function extractProList() {
  const data = loadIconsetData();
  const proEntry = data.allVersions.find(v => typeof v.version === 'string' && v.version.endsWith('_pro'));
  if (!proEntry) {
    throw new Error('Could not locate a *_pro version entry in Font Awesome 7 iconset.');
  }
  return {
    version: proEntry.version,
    icons: (proEntry.icons || []).filter(icon => icon !== 'empty')
  };
}

function validateProIcons(icons) {
  const errors = [];
  const iconSet = new Set(icons);
  
  // Critical pro-only icons that should be available
  const criticalProIcons = [
    'fat fa-tombstone',
    'fal fa-tombstone',
    'fad fa-tombstone'
  ];
  
  // Check for critical icons
  const missing = criticalProIcons.filter(icon => !iconSet.has(icon));
  if (missing.length > 0) {
    errors.push(`Missing critical pro icons: ${missing.join(', ')}`);
  }
  
  // Check for pro-style prefixes
  const proStyles = icons.filter(icon => icon.match(/^fa[ltd] /));
  if (proStyles.length === 0) {
    errors.push('No pro-style icons found (fal, fat, fad)');
  }
  
  // Count icons by style
  const styleCounts = {};
  icons.forEach(icon => {
    const prefix = icon.split(' ')[0];
    styleCounts[prefix] = (styleCounts[prefix] || 0) + 1;
  });
  
  return { errors, styleCounts, totalIcons: icons.length };
}

function main() {
  const { icons: proIcons, version } = extractProList();
  console.log(`Loading FontAwesome ${version} Pro icon list...`);
  console.log(`Found ${proIcons.length} pro icons`);
  
  const validation = validateProIcons(proIcons);
  
  console.log('\n=== FA7 PRO VERIFICATION RESULTS ===');
  console.log(`Total Pro Icons: ${validation.totalIcons}`);
  console.log('Style Distribution:');
  Object.entries(validation.styleCounts).forEach(([style, count]) => {
    console.log(`  ${style}: ${count} icons`);
  });
  
  if (validation.errors.length === 0) {
    console.log('\n✅ VERIFICATION PASSED: All pro icons validated!');
    process.exit(0);
  } else {
    console.log('\n❌ VERIFICATION FAILED:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
    process.exit(1);
  }
}

if (require.main === module) {
  try { 
    main(); 
  } catch (e) { 
    console.error('ERROR:', e.message); 
    process.exit(1); 
  }
}

module.exports = { extractProList, validateProIcons };