const fs = require('fs');
const path = require('path');

const failedFiles = [
  'client/src/i18n/locales/en/purchasing.json',
  'client/src/i18n/locales/en/userGuide.json',
  'client/src/i18n/locales/ms/userGuide.json',
  'client/src/i18n/locales/zh/purchasing.json',
  'client/src/i18n/locales/zh/userGuide.json'
];

failedFiles.forEach(relPath => {
  const filepath = path.join(__dirname, relPath);

  try {
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    // Remove ALL backslashes and escaped quotes
    content = content.replace(/\\\\/g, '');
    content = content.replace(/\\"/g, '"');
    content = content.replace(/\\/g, '');

    // Parse and re-stringify
    const data = JSON.parse(content);
    const fixed = JSON.stringify(data, null, 2);

    fs.writeFileSync(filepath, fixed, 'utf8');
    console.log('✓ Fixed:', filepath);
  } catch (error) {
    console.error('✗ Error in', filepath, ':', error.message);
  }
});
