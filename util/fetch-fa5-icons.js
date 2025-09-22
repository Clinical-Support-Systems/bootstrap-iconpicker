#!/usr/bin/env node
/*
 * Fetch Font Awesome 5.15.4 icons metadata for bootstrap-iconpicker
 */
const https = require('https');
const fs = require('fs');

const FA_VERSION = '5.15.4';

// FontAwesome 5 uses a different metadata structure
// We'll try to get the metadata from GitHub
function fetchFA5Metadata() {
  console.log('Fetching FontAwesome 5.15.4 metadata...');
  
  // Try GitHub raw file first since it worked in our test
  const githubUrl = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/${FA_VERSION}/metadata/icons.json`;
  https.get(githubUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const icons = JSON.parse(data);
        console.log(`Found ${Object.keys(icons).length} icons from GitHub`);
        fs.writeFileSync('fa5-icons.json', JSON.stringify(icons, null, 2));
        generateIconList(icons);
      } catch (err) {
        console.error('Error with GitHub approach:', err.message);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('GitHub approach failed:', err.message);
    process.exit(1);
  });
}

function generateIconList(metadata) {
  const iconList = [];
  
  // Add empty first
  iconList.push('empty');
  
  for (const [name, info] of Object.entries(metadata)) {
    if (!info.styles) continue;
    
    const styleMap = {
      solid: 'fas',
      regular: 'far', 
      brands: 'fab'
    };
    
    // Add icons for each style
    for (const style of info.styles) {
      const prefix = styleMap[style];
      if (prefix) {
        iconList.push(`${prefix} fa-${name}`);
      }
    }
  }
  
  console.log(`Generated ${iconList.length} total icon entries`);
  
  // Preview first few icons
  console.log('First 10 icons:', iconList.slice(0, 10));
  
  return iconList;
}

if (require.main === module) {
  fetchFA5Metadata();
}

module.exports = { generateIconList };
