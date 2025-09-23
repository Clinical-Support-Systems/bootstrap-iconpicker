#!/usr/bin/env node
/*
 * strip-fa6-svg.js
 * Removes the heavy `svg` property from each entry in fa6-icons.json to avoid
 * redistributing raw SVG path data while preserving lightweight metadata
 * (styles, unicode, search terms, etc.) used by verification scripts.
 *
 * Usage:
 *   node util/strip-fa6-svg.js
 *
 * A timestamped backup of the original file is written alongside:
 *   util/fa6-icons.json.bak-<epoch>
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'fa6-icons.json');

function main() {
  if (!fs.existsSync(FILE)) {
    console.error('Could not find fa6-icons.json at', FILE);
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
