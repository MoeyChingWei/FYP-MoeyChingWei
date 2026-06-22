# Task 1: Install Dependencies and Create Directory Structure

## Goal
Set up the export system foundation by installing required NPM packages, creating the template directory structure, and configuring Puppeteer for PDF generation.

## Files to Create/Modify
- Modify: `backend/package.json` - Add handlebars, puppeteer, exceljs, handlebars-helpers
- Create: `backend/templates/{layouts,partials,documents,styles}/` - Directory structure
- Create: `backend/config/puppeteer-config.js` - Puppeteer configuration

## Dependencies to Install
```bash
npm install handlebars@^4.7.8 puppeteer@^21.0.0 exceljs@^4.4.0 handlebars-helpers@^0.10.0 --save
```

## Puppeteer Configuration
Export two objects:
- `puppeteerConfig`: Launch options (headless, sandbox flags)
- `pdfOptions`: PDF generation settings (A4, margins, printBackground)

## Steps
1. Install dependencies via npm
2. Create template directory structure (layouts, partials, documents, styles)
3. Create puppeteer-config.js with launch and PDF options
4. Verify installation with `npm list`
5. Commit with conventional commit message

## Success Criteria
- All 4 packages installed in package.json
- 4 template subdirectories exist
- puppeteer-config.js exports both config objects
- `npm list handlebars puppeteer exceljs` shows installed versions
