#!/usr/bin/env node
/*
 * Verification script for Font Awesome 7.0.1 icon list in iconset-fontawesome-7-all.js
 * Compares local array against upstream metadata (fa7-icons.json) restricted to FREE styles.
 */
const fs = require('fs');
const path = require('path');

const META_PATH = path.join(__dirname, 'fa7-icons.json');
const ICONSET_PATH = path.join(__dirname, '..', 'src', 'js', 'iconset', 'iconset-fontawesome-7-all.js');

function loadMeta() {
  const raw = fs.readFileSync(META_PATH, 'utf8');
  return JSON.parse(raw);
}

function buildExpected(meta) {
  const expected = new Set();
  for (const [name, def] of Object.entries(meta)) {
    if (!def || typeof def !== 'object') continue;
    if (!Array.isArray(def.free)) continue; // skip if no free styles (shouldn't happen)
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
  // Find the 7.0.1 version block first icons array
  // We'll locate the start of the 'version: '7.0.1'' block, then find the following 'icons: [' line
  const versionIdx = js.indexOf("version: '7.0.1'");
  if (versionIdx === -1) throw new Error('Could not locate version 7.0.1 declaration.');
  const slice = js.slice(versionIdx);
  const iconsStart = slice.indexOf('icons:');
  if (iconsStart === -1) throw new Error('Could not locate icons: key after version 7.0.1');
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
  // Split by lines, extract quoted strings
  const iconRegex = /"([^"]+)"/g;
  const local = [];
  let m;
  while ((m = iconRegex.exec(arrayBody)) !== null) {
    const val = m[1];
    if (val === 'empty') continue; // sentinel
    local.push(val.trim());
  }
  return local;
}

function main() {
  const failOnMissing = process.argv.includes('--fail-on-missing');
  const meta = loadMeta();
  const expected = buildExpected(meta);
  const local = extractLocalList();
  const localSet = new Set(local);

  const missing = [...expected].filter(x => !localSet.has(x)).sort();
  const extra = [...localSet].filter(x => !expected.has(x)).sort();

  // Additional heuristic: ensure we don't have style variants for icons that are not free for that style
  const styleErrors = [];
  for (const icon of local) {
    const parts = icon.split(' '); // e.g. ['fas','fa-address-book']
    if (parts.length !== 2) continue;
    const [prefix, nameClass] = parts;
    const iconName = nameClass.replace(/^fa-/, '');
    const def = meta[iconName];
    if (!def) {
      styleErrors.push({ icon, reason: 'Icon not found in metadata' });
      continue;
    }
    const reverse = { fab: 'brands', fas: 'solid', far: 'regular' };
    const style = reverse[prefix];
    if (style && !def.free.includes(style)) {
      styleErrors.push({ icon, reason: `Style '${style}' not free for this icon` });
    }
  }

  const summary = {
    counts: {
      expected: expected.size,
      local: localSet.size,
      missing: missing.length,
      extra: extra.length,
      styleErrors: styleErrors.length
    }
  };

  console.log('Font Awesome 7.0.1 Verification Summary');
  console.log(JSON.stringify(summary, null, 2));

  if (missing.length) {
    console.log('\nMissing (expected but absent locally):');
    console.log(missing.join('\n'));
  }
  if (extra.length) {
    console.log('\nExtra (present locally but not expected free icons):');
    console.log(extra.join('\n'));
  }
  if (styleErrors.length) {
    console.log('\nStyle errors:');
    for (const e of styleErrors) {
      console.log(`${e.icon} - ${e.reason}`);
    }
  }

  if (failOnMissing && missing.length > 0) {
    console.error(`\nFAIL: ${missing.length} missing Font Awesome 7 free icon(s).`);
    process.exit(1);
  }
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
