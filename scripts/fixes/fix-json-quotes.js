const fs = require('fs');
const path = require('path');

function fixJsonFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any backslash-escaped quotes that shouldn't be there
    content = content.replace(/\\"/g, '"');

    // Now parse and re-stringify to ensure valid JSON
    // But first, we need to fix Chinese quotes in string values
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      // Match pattern: "key": "value with 中文引号"
      return line.replace(/: "([^"]*)"([^"]*)"([^"]*)",?$/g, (match, before, middle, after) => {
        return match.replace('"' + before + '"' + middle + '"', '"' + before + '\\"' + middle + '\\"');
      }).replace(/: "([^"]*)"([^"]*)"([^"]*)",?$/g, (match, before, middle, after) => {
        return match.replace('"' + before + '"' + middle + '"', '"' + before + '\\"' + middle + '\\"');
      });
    });

    content = fixedLines.join('\n');

    // Try to parse to validate
    try {
      JSON.parse(content);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
      return true;
    } catch (parseError) {
      console.error('Still invalid after fix:', filePath, parseError.message);
      return false;
    }
  } catch (error) {
    console.error('Error processing:', filePath, error.message);
    return false;
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.json')) {
      fixJsonFile(filePath);
    }
  });
}

const localesDir = path.join(__dirname, 'client', 'src', 'i18n', 'locales');
walkDir(localesDir);
