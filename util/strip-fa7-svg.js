#!/usr/bin/env node
/*
 * strip-fa7-svg.js
 * Removes the `svg` property from each entry in fa7-icons.json to avoid
 * distributing raw SVG path data while keeping lightweight metadata used
 * by verification scripts.
 *
 * Usage:
 *   node util/strip-fa7-svg.js
 *
 * Writes a timestamped backup:
 *   util/fa7-icons.json.bak-<epoch>
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'fa7-icons.json');

function main() {
  if (!fs.existsSync(FILE)) {
    console.error('Could not find fa7-icons.json at', FILE);
    process.exit(1);
  }
  const raw = fs.readFileSync(FILE, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(1);
  }
  let removed = 0; let total = 0;
  for (const key of Object.keys(data)) {
    const def = data[key];
    if (def && typeof def === 'object') {
      total++;
      if (Object.prototype.hasOwnProperty.call(def, 'svg')) {
        delete def.svg;
        removed++;
      }
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  const beforeKB = (raw.length / 1024).toFixed(1);
  const afterRaw = fs.readFileSync(FILE, 'utf8');
  const afterKB = (afterRaw.length / 1024).toFixed(1);
  console.log(`Processed ${total} icon definitions.`);
  console.log(`Removed svg property from ${removed} entries.`);
  console.log(`Size: before ${beforeKB} KB -> after ${afterKB} KB`);
  console.log('Done.');
}

if (require.main === module) {
  main();
}

module.exports = {};
