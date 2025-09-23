#!/usr/bin/env node
/*
 * Verification script for Font Awesome 7.0.1 Pro icon list in iconset-fontawesome-7-all.js
 * Validates that Pro icons are accessible and includes critical pro-only icons.
 */
const fs = require('fs');
const path = require('path');

const ICONSET_PATH = path.join(__dirname, '..', 'src', 'js', 'iconset', 'iconset-fontawesome-7-all.js');

function extractProList() {
  const js = fs.readFileSync(ICONSET_PATH, 'utf8');
  const versionIdx = js.indexOf("version: '7.0.1_pro'");
  if (versionIdx === -1) throw new Error('Could not locate version 7.0.1_pro declaration.');
  const slice = js.slice(versionIdx);
  const iconsStart = slice.indexOf('icons:');
  if (iconsStart === -1) throw new Error('Could not locate icons: key after version 7.0.1_pro');
  const afterIcons = slice.slice(iconsStart);
  const bracketStart = afterIcons.indexOf('[');
  if (bracketStart === -1) throw new Error('No opening [ for icons array');
  let depth = 0; let i = bracketStart; let endIndex = -1;
  for (; i < afterIcons.length; i++) {
    const ch = afterIcons[i];
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { endIndex = i; break; } }
  }
  if (endIndex === -1) throw new Error('Failed to find matching ] for icons array');
  const arrayBody = afterIcons.slice(bracketStart + 1, endIndex);
  const iconRegex = /"([^"]+)"/g;
  const local = [];
  let match;
  while ((match = iconRegex.exec(arrayBody)) !== null) {
    const val = match[1];
    if (val === 'empty') continue;
    local.push(val);
  }
  return local;
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
  console.log('Loading FontAwesome 7.0.1 Pro icon list...');
  const proIcons = extractProList();
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