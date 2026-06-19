const fs = require('fs');
const path = require('path');

function cleanTrailingBackslashes(filepath) {
  try {
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    // Remove trailing backslashes before quotes in values
    // Match pattern: "value\\" and replace with "value"
    content = content.replace(/\\\\"/g, '"');

    // Parse and reformat
    const data = JSON.parse(content);
    const fixed = JSON.stringify(data, null, 2);

    fs.writeFileSync(filepath, fixed, 'utf8');
    console.log('✓ Cleaned:', filepath);
    return true;
  } catch (error) {
    console.error('✗ Error:', filepath, error.message);
    return false;
  }
}

function walkDir(dir) {
  let fixed = 0;
  let failed = 0;

  function walk(directory) {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
      const filepath = path.join(directory, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        walk(filepath);
      } else if (file.endsWith('.json')) {
        if (cleanTrailingBackslashes(filepath)) {
          fixed++;
        } else {
          failed++;
        }
      }
    });
  }

  walk(dir);
  console.log('\n' + '='.repeat(60));
  console.log('Total fixed:', fixed);
  console.log('Total failed:', failed);
  console.log('='.repeat(60));
}

const localesDir = path.join(__dirname, 'client', 'src', 'i18n', 'locales');
walkDir(localesDir);
