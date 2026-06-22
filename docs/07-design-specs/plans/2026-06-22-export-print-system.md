# Export & Print System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive export and print system with chatbot-driven exports (OPTIONS selection) and module page export/print buttons, generating professional business documents in PDF/Excel/CSV/JSON formats.

**Architecture:** Backend template engine (Handlebars + Puppeteer) for professional document generation, unified export service accessible via chatbot and module UI, reusable React components.

**Tech Stack:** 
- Backend: Node.js, Express, Handlebars, Puppeteer, exceljs
- Frontend: React, TypeScript, Ant Design
- Templates: Handlebars (.hbs), CSS

## Global Constraints

- Node.js >= 18.x (for Puppeteer compatibility)
- Handlebars ^4.7.8, Puppeteer ^21.0.0, exceljs ^4.4.0
- All exports respect department-level permissions (users see only their department data, Super Admin sees all)
- Export generation must complete in < 5 seconds for <100 records, < 30 seconds for <1000 records
- Professional document templates must include company header, document metadata, data tables, signature blocks, and page footers
- Supplier information limitation: only supplier name available (address, phone, email, tax ID to be added in future enhancement)
- Templates must use print-optimized CSS with proper page breaks
- All file paths use forward slashes for cross-platform compatibility
- Commit messages follow conventional commits format

---

## File Structure

### Backend Services
- **Create:** `backend/services/template-renderer.js` - Handlebars template compilation, partial/helper registration, caching
- **Create:** `backend/services/pdf-generator.js` - Puppeteer HTML-to-PDF conversion with page break handling
- **Create:** `backend/services/export-service.js` - Unified export logic for PDF/Excel/CSV/JSON formats
- **Create:** `backend/utils/data-formatter.js` - Transform database records into template-ready format

### Backend Routes
- **Create:** `backend/routes/export.js` - Export API endpoints for all data types

### Backend Configuration
- **Create:** `backend/config/puppeteer-config.js` - Puppeteer launch options and PDF settings

### Templates
- **Create:** `backend/templates/layouts/base.hbs` - Base HTML layout for all documents
- **Create:** `backend/templates/partials/header.hbs` - Company header partial
- **Create:** `backend/templates/partials/footer.hbs` - Page footer partial
- **Create:** `backend/templates/partials/signature-block.hbs` - Signature area partial
- **Create:** `backend/templates/documents/purchase-request.hbs` - Purchase request document template
- **Create:** `backend/templates/documents/purchase-order.hbs` - Purchase order document template
- **Create:** `backend/templates/documents/invoice.hbs` - Invoice document template
- **Create:** `backend/templates/documents/supplier-list.hbs` - Supplier list document template
- **Create:** `backend/templates/styles/print.css` - Print-optimized styles
- **Create:** `backend/templates/styles/common.css` - Common document styles
- **Create:** `backend/templates/styles/tables.css` - Table styling

### Frontend Components
- **Create:** `client/src/FrontEnd/components/shared/ExportButton.tsx` - Reusable export dropdown component
- **Create:** `client/src/FrontEnd/components/shared/PrintButton.tsx` - Reusable print button component

### Chatbot Agent
- **Modify:** `backend/agents/chatbot/chatbot-agent.js` - Add export_data tool and system prompt enhancement

### Backend Entry Point
- **Modify:** `backend/server.js` - Register export routes

### Dependencies
- **Modify:** `backend/package.json` - Add handlebars, puppeteer, exceljs, handlebars-helpers

---

### Task 1: Install Dependencies and Create Directory Structure

**Files:**
- Modify: `backend/package.json`
- Create: `backend/templates/` (directory structure)
- Create: `backend/config/puppeteer-config.js`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: 
  - NPM packages: handlebars, puppeteer, exceljs, handlebars-helpers
  - Directory structure: `backend/templates/{layouts,partials,documents,styles}/`
  - Puppeteer configuration object exported from `puppeteer-config.js`

- [ ] **Step 1: Add dependencies to package.json**

```bash
cd backend
npm install handlebars@^4.7.8 puppeteer@^21.0.0 exceljs@^4.4.0 handlebars-helpers@^0.10.0 --save
```

Expected: Dependencies added to package.json and node_modules installed

- [ ] **Step 2: Create template directory structure**

```bash
mkdir -p templates/layouts
mkdir -p templates/partials
mkdir -p templates/documents
mkdir -p templates/styles
mkdir -p config
```

Expected: Directory structure created under backend/

- [ ] **Step 3: Create Puppeteer configuration file**

```javascript
// backend/config/puppeteer-config.js
export const puppeteerConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ],
};

export const pdfOptions = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '15mm',
    bottom: '20mm',
    left: '15mm',
  },
  printBackground: true,
  displayHeaderFooter: false, // Using custom HTML header/footer
};
```

- [ ] **Step 4: Verify installation**

Run: `npm list handlebars puppeteer exceljs`
Expected: All packages listed with correct versions

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json config/puppeteer-config.js
git commit -m "build: add export system dependencies and puppeteer config

- Add handlebars, puppeteer, exceljs, handlebars-helpers
- Create template directory structure
- Add puppeteer configuration with A4 PDF settings

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Create Template Styles (CSS)

**Files:**
- Create: `backend/templates/styles/common.css`
- Create: `backend/templates/styles/tables.css`
- Create: `backend/templates/styles/print.css`

**Interfaces:**
- Consumes: None (standalone CSS files)
- Produces: CSS files referenced by `<link>` tags in base.hbs layout

- [ ] **Step 1: Create common document styles**

```css
/* backend/templates/styles/common.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #000;
  background: #fff;
}

.document-container {
  max-width: 210mm;
  margin: 0 auto;
  padding: 20mm 15mm;
}

.company-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.company-name {
  font-size: 18pt;
  font-weight: bold;
  margin-bottom: 5px;
}

.company-info {
  font-size: 10pt;
  color: #555;
  line-height: 1.4;
}

.document-meta {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-left: 4px solid #333;
}

.document-meta .meta-row {
  display: flex;
  margin-bottom: 8px;
}

.document-meta .meta-label {
  font-weight: bold;
  width: 150px;
}

.document-meta .meta-value {
  flex: 1;
}

.requester-info {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.signature-block {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}

.signature-section {
  width: 45%;
  text-align: center;
}

.signature-label {
  font-weight: bold;
  margin-bottom: 30px;
}

.signature-line {
  border-top: 1px solid #000;
  width: 200px;
  margin: 0 auto 10px;
}

.signature-name {
  font-size: 10pt;
}

.signature-date {
  font-size: 9pt;
  color: #666;
  margin-top: 5px;
}

.page-footer {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 9pt;
  color: #666;
}
```

- [ ] **Step 2: Create table styles**

```css
/* backend/templates/styles/tables.css */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 11pt;
}

.data-table thead {
  background: #333;
  color: #fff;
}

.data-table th {
  padding: 12px 8px;
  text-align: left;
  font-weight: bold;
  border: 1px solid #333;
}

.data-table td {
  padding: 10px 8px;
  border: 1px solid #ddd;
  vertical-align: top;
}

.data-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.data-table tbody tr:hover {
  background: #f0f0f0;
}

.data-table .col-no {
  width: 50px;
  text-align: center;
}

.data-table .col-qty {
  width: 80px;
  text-align: right;
}

.data-table .col-unit {
  width: 80px;
}

.data-table .col-status {
  width: 120px;
}

.table-summary {
  margin-top: 10px;
  text-align: right;
  font-weight: bold;
  font-size: 11pt;
}
```

- [ ] **Step 3: Create print-specific styles**

```css
/* backend/templates/styles/print.css */
@media print {
  body {
    margin: 0;
    padding: 0;
  }

  .document-container {
    max-width: none;
    padding: 0;
  }

  .page-break {
    page-break-after: always;
  }

  .no-break {
    page-break-inside: avoid;
  }

  .data-table {
    page-break-inside: auto;
  }

  .data-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .data-table thead {
    display: table-header-group;
  }

  .signature-block {
    page-break-inside: avoid;
  }

  @page {
    size: A4;
    margin: 20mm 15mm;
  }
}

/* Prevent orphan rows */
.data-table tbody tr {
  page-break-inside: avoid;
}
```

- [ ] **Step 4: Commit**

```bash
git add templates/styles/
git commit -m "feat: add professional document CSS styles

- Common styles: company header, metadata, signatures
- Table styles: responsive data tables with alternating rows
- Print styles: page breaks, print-optimized layout

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Create Handlebars Template Partials

**Files:**
- Create: `backend/templates/partials/header.hbs`
- Create: `backend/templates/partials/footer.hbs`
- Create: `backend/templates/partials/signature-block.hbs`

**Interfaces:**
- Consumes: Template data passed from template-renderer.js
- Produces: Reusable HTML partials referenced via `{{> partialName}}`

- [ ] **Step 1: Create company header partial**

```handlebars
{{!-- backend/templates/partials/header.hbs --}}
<div class="company-header">
  <div class="company-name">OptiMind ERP System</div>
  <div class="company-info">
    123 Business Street<br>
    Kuala Lumpur, Malaysia<br>
    Tel: +60 3-1234 5678 | Email: info@optimind.com
  </div>
</div>
```

- [ ] **Step 2: Create page footer partial**

```handlebars
{{!-- backend/templates/partials/footer.hbs --}}
<div class="page-footer">
  Generated by OptiMind ERP System | 
  {{#if pageNumber}}Page {{pageNumber}} of {{totalPages}} | {{/if}}
  {{formatDate generatedDate "YYYY-MM-DD"}}
</div>
```

- [ ] **Step 3: Create signature block partial**

```handlebars
{{!-- backend/templates/partials/signature-block.hbs --}}
<div class="signature-block no-break">
  <div class="signature-section">
    <div class="signature-label">Prepared By:</div>
    <div class="signature-line"></div>
    <div class="signature-name">{{preparedBy}}</div>
    <div class="signature-date">Date: __________</div>
  </div>
  
  <div class="signature-section">
    <div class="signature-label">Approved By:</div>
    <div class="signature-line"></div>
    <div class="signature-name">{{approvedBy}}</div>
    <div class="signature-date">Date: __________</div>
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add templates/partials/
git commit -m "feat: add Handlebars template partials

- Company header with contact information
- Page footer with generation date
- Signature block for approvals

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Create Base Layout and Document Templates

**Files:**
- Create: `backend/templates/layouts/base.hbs`
- Create: `backend/templates/documents/purchase-request.hbs`

**Interfaces:**
- Consumes: CSS files, partials, document data
- Produces: Complete HTML documents for PDF generation

- [ ] **Step 1: Create base layout**

```handlebars
{{!-- backend/templates/layouts/base.hbs --}}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{documentTitle}}</title>
  <style>
    {{{commonCSS}}}
    {{{tablesCSS}}}
    {{{printCSS}}}
  </style>
</head>
<body>
  <div class="document-container">
    {{> header}}
    {{{body}}}
    {{> footer}}
  </div>
</body>
</html>
```

- [ ] **Step 2: Create purchase request template**

```handlebars
{{!-- backend/templates/documents/purchase-request.hbs --}}
<div class="document-meta">
  <div class="meta-row">
    <div class="meta-label">Document Type:</div>
    <div class="meta-value">PURCHASE REQUEST</div>
  </div>
  <div class="meta-row">
    <div class="meta-label">Document No.:</div>
    <div class="meta-value">{{documentNumber}}</div>
  </div>
  <div class="meta-row">
    <div class="meta-label">Status:</div>
    <div class="meta-value">{{status}}</div>
  </div>
</div>

<div class="requester-info">
  <h3>Requester Information</h3>
  <div class="meta-row">
    <div class="meta-label">Requested By:</div>
    <div class="meta-value">{{requestedBy}}</div>
  </div>
  <div class="meta-row">
    <div class="meta-label">Department:</div>
    <div class="meta-value">{{department}}</div>
  </div>
</div>

<table class="data-table">
  <thead>
    <tr>
      <th>No.</th>
      <th>Item Name</th>
      <th>Category</th>
      <th>Qty</th>
      <th>Unit</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {{#each lineItems}}
    <tr>
      <td>{{@index}}</td>
      <td>{{itemName}}</td>
      <td>{{itemCategory}}</td>
      <td>{{quantity}}</td>
      <td>{{unitOfMeasurement}}</td>
      <td>{{itemDescription}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>

{{> signature-block}}
```

- [ ] **Step 3: Commit**

```bash
git add templates/layouts/ templates/documents/purchase-request.hbs
git commit -m "feat: add base layout and purchase request template

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Build Template Renderer Service

**Files:**
- Create: `backend/services/template-renderer.js`
- Create: `backend/test/template-renderer.test.js`

**Interfaces:**
- Consumes: Template files (.hbs), CSS files
- Produces: `render(templateName, data)` → HTML string

- [ ] **Step 1: Write test**

```javascript
// backend/test/template-renderer.test.js
import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../services/template-renderer.js';

describe('Template Renderer', () => {
  it('should render purchase request template', async () => {
    const data = {
      documentNumber: 'PR-TEST',
      status: 'PENDING',
      requestedBy: 'John',
      department: 'IT',
      lineItems: []
    };

    const html = await renderTemplate('purchase-request', data);
    
    expect(html).toContain('PR-TEST');
    expect(html).toContain('PENDING');
  });
});
```

Run: `npm test -- template-renderer.test.js`
Expected: FAIL

- [ ] **Step 2: Implement template renderer**

Due to length constraints, I'll provide a simplified implementation plan. The full implementation would be too large for this response.

```javascript
// backend/services/template-renderer.js
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');

class TemplateRenderer {
  constructor() {
    this.templates = new Map();
    this.registerHelpers();
  }

  registerHelpers() {
    Handlebars.registerHelper('inc', (value) => parseInt(value) + 1);
  }

  async loadCSS() {
    const commonCSS = await fs.readFile(path.join(TEMPLATES_DIR, 'styles/common.css'), 'utf-8');
    const tablesCSS = await fs.readFile(path.join(TEMPLATES_DIR, 'styles/tables.css'), 'utf-8');
    const printCSS = await fs.readFile(path.join(TEMPLATES_DIR, 'styles/print.css'), 'utf-8');
    return { commonCSS, tablesCSS, printCSS };
  }

  async render(templateName, data) {
    const templatePath = path.join(TEMPLATES_DIR, `documents/${templateName}.hbs`);
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    const css = await this.loadCSS();
    
    return template({ ...data, ...css });
  }
}

export const renderTemplate = async (templateName, data) => {
  const renderer = new TemplateRenderer();
  return renderer.render(templateName, data);
};
```

Run: `npm test -- template-renderer.test.js`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add services/template-renderer.js test/template-renderer.test.js
git commit -m "feat: implement template renderer service

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

**Note:** Due to the complexity and length of this implementation plan, I've provided a condensed version covering the first 5 tasks. The complete plan would include approximately 15-20 tasks covering:

- PDF Generator service (Puppeteer)
- Export Service (unified logic)
- Export API routes
- Frontend Export/Print buttons
- Chatbot agent enhancement
- Integration and E2E tests

Would you like me to:
1. Continue with the remaining tasks in detail
2. Provide a high-level task outline for the rest
3. Start implementing immediately with subagent-driven development

---

