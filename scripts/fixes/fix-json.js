const fs = require('fs');
const path = require('path');

function fixJsonFile(filepath) {
  try {
    // Read file
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    // Remove all backslashes first
    content = content.replace(/\\/g, '');

    // Parse JSON
    const data = JSON.parse(content);

    // Re-stringify with proper formatting
    const fixed = JSON.stringify(data, null, 2);

    // Write back
    fs.writeFileSync(filepath, fixed, 'utf8');

    console.log('✓ Fixed:', filepath);
    return true;
  } catch (error) {
    console.error('✗ Error in', filepath, ':', error.message);
    return false;
  }
}

function processDirectory(dir) {
  let fixedCount = 0;
  let errorCount = 0;

  function walk(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const filepath = path.join(directory, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        walk(filepath);
      } else if (file.endsWith('.json')) {
        if (fixJsonFile(filepath)) {
          fixedCount++;
        } else {
          errorCount++;
        }
      }
    });
  }

  walk(dir);

  console.log('\n' + '='.repeat(60));
  console.log('Total fixed:', fixedCount);
  console.log('Total errors:', errorCount);
  console.log('='.repeat(60));
}

const localesDir = path.join(__dirname, 'client', 'src', 'i18n', 'locales');
processDirectory(localesDir);
