const fs = require('fs');
const path = require('path');

function smartFixJson(filepath) {
  try {
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    // Strategy: Parse line by line and fix only string VALUES, not keys
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Match lines that look like: "key": "value with 中文引号"
      // We need to escape the Chinese quotes ONLY in the value part
      const match = line.match(/^(\s*"[^"]+"\s*:\s*)"([^"]*)"([^"]*)"(.*)$/);
      if (match) {
        // Found a line with Chinese quotes in the value
        const [, prefix, before, after, suffix] = match;
        return prefix + '"' + before + '\\"' + after.replace(/"/g, '\\"') + suffix;
      }

      const match2 = line.match(/^(\s*"[^"]+"\s*:\s*)"([^"]*)"([^"]*)"(.*)$/);
      if (match2) {
        const [, prefix, before, after, suffix] = match2;
        return prefix + '"' + before + '\\"' + after.replace(/"/g, '\\"') + suffix;
      }

      return line;
    });

    content = fixedLines.join('\n');

    // Now try to parse
    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      console.error('Still cannot parse', filepath);
      console.error('Error:', parseError.message);

      // Last resort: use regex to find and replace ALL Chinese quotes in values
      content = fs.readFileSync(filepath, 'utf8');
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }

      // More aggressive: replace in string values only
      content = content.replace(/: "([^"]*)"([^"]*?)"/g, (match, p1, p2) => {
        return `: "${p1}\\"${p2.replace(/"/g, '\\"')}"`;
      });

      content = content.replace(/: "([^"]*)"([^"]*?)"/g, (match, p1, p2) => {
        return `: "${p1}\\"${p2.replace(/"/g, '\\"')}"`;
      });

      data = JSON.parse(content);
    }

    // Success! Write back properly formatted JSON
    const fixed = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, fixed, 'utf8');
    console.log('✓ Fixed:', filepath);
    return true;
  } catch (error) {
    console.error('✗ Failed:', filepath, '-', error.message);
    return false;
  }
}

function processDirectory(dir) {
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
        if (smartFixJson(filepath)) {
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
processDirectory(localesDir);
