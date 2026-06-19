const fs = require('fs');
const path = require('path');

function fixJsonQuotes(filepath) {
  try {
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    // Replace Chinese quotes with escaped ASCII quotes
    content = content.replace(/"/g, '\\"');
    content = content.replace(/"/g, '\\"');

    // Parse to validate and reformat
    const data = JSON.parse(content);
    const fixed = JSON.stringify(data, null, 2);

    fs.writeFileSync(filepath, fixed, 'utf8');
    console.log('✓ Fixed:', filepath);
    return true;
  } catch (error) {
    console.error('✗ Error in', filepath, ':', error.message);
    return false;
  }
}

// Fix all locale files
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixed = 0;
  let errors = 0;

  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      const result = walkDir(filepath);
      fixed += result.fixed;
      errors += result.errors;
    } else if (file.endsWith('.json')) {
      if (fixJsonQuotes(filepath)) {
        fixed++;
      } else {
        errors++;
      }
    }
  });

  return { fixed, errors };
}

const localesDir = path.join(__dirname, 'client', 'src', 'i18n', 'locales');
const result = walkDir(localesDir);

console.log('\n' + '='.repeat(60));
console.log('Total fixed:', result.fixed);
console.log('Total errors:', result.errors);
console.log('='.repeat(60));
