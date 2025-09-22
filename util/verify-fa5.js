#!/usr/bin/env node
/*
 * Verification script for Font Awesome 5.15.4 icon list in iconset-fontawesome-5-all.js
 * Compares local array against upstream metadata (fa5-icons.json) restricted to FREE styles.
 */
const fs = require('fs');
const path = require('path');

const META_PATH = path.join(__dirname, 'fa5-icons.json');
const ICONSET_PATH = path.join(__dirname, '..', 'src', 'js', 'iconset', 'iconset-fontawesome-5-all.js');

function loadMeta() {
  const raw = fs.readFileSync(META_PATH, 'utf8');
  return JSON.parse(raw);
}

function buildExpected(meta) {
  const expected = new Set();
  for (const [name, def] of Object.entries(meta)) {
    if (!def || typeof def !== 'object') continue;
    if (!Array.isArray(def.free)) continue; // skip if no free styles
    const free = new Set(def.free);
    // mapping style -> prefix
    const mapping = { brands: 'fab', solid: 'fas', regular: 'far' };
    for (const style of free) {
      const prefix = mapping[style];
      if (!prefix) continue; // ignore styles we don't list (e.g., duotone, light, thin) in free
      expected.add(`${prefix} fa-${name}`);
    }
  }
  return expected;
}

function extractLocalList() {
  const js = fs.readFileSync(ICONSET_PATH, 'utf8');
  const versionIdx = js.indexOf("version: '5.15.4'");
  if (versionIdx === -1) throw new Error('Could not locate version 5.15.4 declaration.');
  const slice = js.slice(versionIdx);
  const iconsStart = slice.indexOf('icons:');
  if (iconsStart === -1) throw new Error('Could not locate icons: key after version 5.15.4');
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
  const iconRegex = /'([^']+)'/g;
  const local = [];
  let match;
  while ((match = iconRegex.exec(arrayBody)) !== null) {
    local.push(match[1]);
  }
  return local;
}

function main() {
  console.log('Loading FontAwesome 5.15.4 metadata...');
  const meta = loadMeta();
  console.log(`Loaded ${Object.keys(meta).length} icon definitions`);

  console.log('Building expected icon list from metadata (free icons only)...');
  const expected = buildExpected(meta);
  console.log(`Expected ${expected.size} free icons`);

  console.log('Extracting local icon list from iconset file...');
  const local = extractLocalList();
  console.log(`Found ${local.length} icons in local file`);

  const localSet = new Set(local);
  const missing = [...expected].filter(icon => !localSet.has(icon));
  const extra = local.filter(icon => icon !== 'empty' && !expected.has(icon));

  console.log('\n=== VERIFICATION RESULTS ===');
  console.log(`Expected: ${expected.size} icons`);
  console.log(`Local: ${local.length} icons (including 'empty')`);
  console.log(`Missing: ${missing.length} icons`);
  console.log(`Extra: ${extra.length} icons`);

  if (missing.length > 0) {
    console.log('\nMISSING ICONS:');
    missing.slice(0, 10).forEach(icon => console.log(`  - ${icon}`));
    if (missing.length > 10) console.log(`  ... and ${missing.length - 10} more`);
  }

  if (extra.length > 0) {
    console.log('\nEXTRA ICONS:');
    extra.slice(0, 10).forEach(icon => console.log(`  + ${icon}`));
    if (extra.length > 10) console.log(`  ... and ${extra.length - 10} more`);
  }

  if (missing.length === 0 && extra.length === 0) {
    console.log('\n✅ VERIFICATION PASSED: All icons match!');
    process.exit(0);
  } else {
    console.log('\n❌ VERIFICATION FAILED: Icon lists do not match');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildExpected, extractLocalList, loadMeta };