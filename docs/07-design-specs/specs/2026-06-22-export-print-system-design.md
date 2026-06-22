# OptiMind Export & Print System Design

**Date:** 2026-06-22  
**Version:** 1.0  
**Status:** Design Phase  
**Author:** Claude (with User)

---

## Executive Summary

This design document outlines a comprehensive **Export & Print System** for the OptiMind ERP platform. The system provides two entry points for exporting data: (1) intelligent chatbot-driven exports with dynamic option selection, and (2) dedicated export/print buttons in each module's list page. Both entry points use a unified backend template system to generate professional business documents.

**Key Goals:**
- Enable chatbot-driven exports with OPTIONS button selection (like purchase request creation flow)
- Add Export and Print buttons to all module pages (Purchase Requests, Orders, Invoices, Suppliers)
- Generate professional business documents with company headers, signatures, and proper formatting
- Support multiple export formats: PDF, Excel, CSV, JSON
- Use professional templates optimized for printing
- Create a maintainable and extensible template system

**Implementation Strategy:** Backend template engine with Handlebars + Puppeteer for professional document generation.

---

## Table of Contents

1. [Current System Overview](#current-system-overview)
2. [Requirements](#requirements)
3. [System Architecture](#system-architecture)
4. [Chatbot Intelligent Export](#chatbot-intelligent-export)
5. [Module Page Export/Print Buttons](#module-page-exportprint-buttons)
6. [Professional Document Templates](#professional-document-templates)
7. [Database & Data Flow](#database--data-flow)
8. [Technical Implementation](#technical-implementation)
9. [Future Enhancements](#future-enhancements)
10. [Testing Strategy](#testing-strategy)

---

## Current System Overview

### Existing Export Functionality

**Current State:**
- ✅ Purchase Request export to CSV/JSON (via chatbot)
- ✅ Basic data export from chatbot
- ❌ No module page export buttons
- ❌ No professional document templates
- ❌ No print-optimized layouts

### Gaps to Address

1. **No visual export options** - Users must type format names
2. **No module-level exports** - Must use chatbot for all exports
3. **Basic CSV format only** - No professional PDF documents
4. **No print functionality** - Can't directly print formatted documents
5. **Inconsistent UX** - Export experience varies by data type

---

## Requirements

### Functional Requirements

**FR-1: Chatbot Intelligent Export**
- Detect export intent from user messages
- Display dynamic OPTIONS buttons for format selection
- Support all major data types (PR, PO, Invoice, Supplier)
- Return download links with file metadata

**FR-2: Module Page Export Buttons**
- Add Export dropdown button to list pages
- Add Print button to list pages
- Apply current filters/search to exports
- Show export progress indicator

**FR-3: Professional Document Templates**
- Company header with logo and contact info
- Document metadata (number, date, status)
- Clean, readable data tables
- Signature blocks for approval workflows
- Page headers and footers with page numbers

**FR-4: Multiple Export Formats**
- PDF (professional documents)
- Excel (.xlsx) for data analysis
- CSV (simple data export)
- JSON (raw data for developers)

**FR-5: Print Functionality**
- Print-optimized CSS
- Proper page breaks
- Professional formatting

### Non-Functional Requirements

**NFR-1: Performance**
- Export generation < 5 seconds for datasets under 100 records
- Export generation < 30 seconds for datasets under 1000 records
- Support pagination for large datasets

**NFR-2: Security**
- Users can only export data from their department
- Super Admin can export all data
- Validate all user inputs

**NFR-3: Usability**
- Clear visual feedback during export generation
- Intuitive button placement
- Consistent UX across all modules

**NFR-4: Maintainability**
- Reusable template components
- Easy to add new document types
- Clear separation of concerns

### Known Limitations

⚠️ **Supplier Information Incomplete**
- Current database only stores supplier **name**
- Missing: address, phone, email, tax ID
- **Impact**: Purchase Order templates will show placeholder text for missing fields
- **Future Work**: Design and implement Supplier detail management feature

---

## System Architecture

### Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  1. ChatBot Intelligent Export                           │
│     - User says "export"                                 │
│     - AI displays OPTIONS buttons                        │
│     - User selects data type + format                    │
│                                                          │
│  2. Module Page Export/Print Buttons                     │
│     - Purchase Request List → [Export▼] [Print]         │
│     - Purchase Order List → [Export▼] [Print]           │
│     - Invoice List → [Export▼] [Print]                  │
│     - Supplier List → [Export▼] [Print]                 │
└─────────────────────────────────────────────────────────┘
                            ↓ HTTP POST
┌─────────────────────────────────────────────────────────┐
│                 Backend (Node.js/Express)                │
├─────────────────────────────────────────────────────────┤
│  Export Service                                          │
│  ├── Template Renderer (Handlebars)                     │
│  ├── PDF Generator (Puppeteer)                          │
│  ├── Excel Generator (exceljs)                          │
│  └── Data Formatter                                      │
│                                                          │
│  API Routes:                                             │
│  POST /api/export/purchase-requests                      │
│  POST /api/export/purchase-orders                        │
│  POST /api/export/invoices                              │
│  POST /api/export/suppliers                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Template System                       │
├─────────────────────────────────────────────────────────┤
│  backend/templates/                                      │
│  ├── layouts/base.hbs                                    │
│  ├── partials/                                           │
│  │   ├── header.hbs                                      │
│  │   ├── footer.hbs                                      │
│  │   └── signature-block.hbs                             │
│  ├── documents/                                          │
│  │   ├── purchase-request.hbs                            │
│  │   ├── purchase-order.hbs                              │
│  │   ├── invoice.hbs                                     │
│  │   └── supplier-list.hbs                               │
│  └── styles/                                             │
│      ├── print.css                                       │
│      ├── common.css                                      │
│      └── tables.css                                      │
└─────────────────────────────────────────────────────────┘
```

### Core Components

**1. ChatBot Agent Enhancement**
- New `export_data` tool for handling export requests
- OPTIONS button rendering in responses
- Download link presentation

**2. Export Service** (`backend/services/export-service.js`)
- Unified export logic for all data types
- Format conversion (PDF/Excel/CSV/JSON)
- Template rendering coordination

**3. Template Renderer** (`backend/services/template-renderer.js`)
- Handlebars template compilation and caching
- Partial registration (header, footer, etc.)
- Helper function registration (date formatting, currency, etc.)

**4. PDF Generator** (`backend/services/pdf-generator.js`)
- Puppeteer-based HTML to PDF conversion
- Print-optimized configuration
- Page break handling

**5. Module UI Components**
- `ExportButton.tsx` - Reusable export dropdown
- `PrintButton.tsx` - Reusable print trigger
- Export progress modal

---

## Chatbot Intelligent Export

### User Interaction Flow

**Scenario 1: Export with format specified**
```
User: "export purchase requests as PDF"
  ↓
ChatBot: Immediately calls export_data tool
  ↓
AI: "✅ Export complete!
     📄 Purchase Requests Report
     Format: PDF | Records: 25 | Size: 1.2 MB
     [Download PDF]"
```

**Scenario 2: Export without format (Shows OPTIONS)**
```
User: "export purchase requests"
  ↓
ChatBot: Detects missing format
  ↓
AI: "Sure! I'll help you export Purchase Requests.

Which format would you like?

OPTIONS:
- PDF (Professional document with company header)
- Excel (.xlsx) - For data analysis
- CSV (Simple data export)
- JSON (Raw data)"
  ↓
User: Clicks "PDF" or types "pdf"
  ↓
ChatBot: Calls export_data tool
  ↓
AI: "✅ Export complete! [Download link and details]"
```

**Scenario 3: Ambiguous request**
```
User: "export"
  ↓
AI: "What would you like to export?

OPTIONS:
- Purchase Requests
- Purchase Orders
- Invoices
- Suppliers"
  ↓
User: Clicks "Purchase Requests"
  ↓
AI: "Which format? [Shows format OPTIONS]"
```

### ChatBot Agent Tool Definition

**New Tool: `export_data`**

```javascript
{
  name: 'export_data',
  description: 'Export system data (purchase requests, orders, invoices, suppliers) in various formats',
  input_schema: {
    type: 'object',
    properties: {
      dataType: {
        type: 'string',
        enum: ['purchase_requests', 'purchase_orders', 'invoices', 'suppliers'],
        description: 'Type of data to export'
      },
      format: {
        type: 'string',
        enum: ['pdf', 'excel', 'csv', 'json'],
        description: 'Export format'
      },
      filters: {
        type: 'object',
        description: 'Optional filters',
        properties: {
          status: { type: 'string' },
          department: { type: 'string' },
          dateFrom: { type: 'string', format: 'date' },
          dateTo: { type: 'string', format: 'date' }
        }
      }
    },
    required: ['dataType', 'format']
  }
}
```

### System Prompt Enhancement

Add to `chatbot-agent.js` system prompt:

```
## Exporting Data

When users request to "export" or "download" data:

1. Identify data type: Purchase Requests, Purchase Orders, Invoices, or Suppliers
2. Identify format: PDF, Excel, CSV, or JSON
3. If format not specified, show OPTIONS with format choices
4. Call export_data tool with dataType, format, and optional filters
5. Present download link with file metadata

Use emojis: 📄 PDF, 📊 Excel, 📋 CSV, 💾 JSON
```

### OPTIONS Button Rendering

The existing `parseAssistantOptions()` function in ChatBotPage.tsx already supports this pattern.

---

## Module Page Export/Print Buttons

### UI Component Design

**Export Button Component:**
```tsx
// components/shared/ExportButton.tsx
- Dropdown with PDF/Excel/CSV/JSON options
- Calls /api/export/:dataType endpoint
- Shows loading state
- Triggers browser download
```

**Print Button Component:**
```tsx
// components/shared/PrintButton.tsx
- Generates PDF optimized for printing
- Opens print dialog
- Uses print-friendly CSS
```

### Integration Points

Add to these pages:
1. Purchase Requests List
2. Purchase Orders List
3. Invoices List
4. Suppliers List

Placement: Top-right corner next to search/filter controls

---

## Professional Document Templates

### Template Structure

```
backend/templates/
├── layouts/
│   └── base.hbs                    # Base layout
├── partials/
│   ├── header.hbs                  # Company header
│   ├── footer.hbs                  # Page footer
│   └── signature-block.hbs         # Signature area
├── documents/
│   ├── purchase-request.hbs        # PR template
│   ├── purchase-order.hbs          # PO template
│   ├── invoice.hbs                 # Invoice template
│   └── supplier-list.hbs           # Supplier list
└── styles/
    ├── print.css                   # Print styles
    ├── common.css                  # Common styles
    └── tables.css                  # Table styles
```

### Document Format Standard

Each professional document includes:

**1. Company Header**
```
┌─────────────────────────────────────────────┐
│  [LOGO]        OptiMind ERP System          │
│                123 Business Street          │
│                Kuala Lumpur, Malaysia       │
│                Tel: +60 3-1234 5678         │
│                Email: info@optimind.com     │
└─────────────────────────────────────────────┘
```

**2. Document Metadata**
```
Document Type: PURCHASE REQUEST
Document No.: PR-20260622-A3X9
Date: June 22, 2026
Status: PENDING APPROVAL
```

**3. Requester Information**
```
Requested By: [User Name]
Department: [Department]
Email: [Email]
Request Date: [Date]
```

**4. Data Table**
```
┌────┬──────────┬──────────┬─────┬──────┬─────────┐
│ No │ Item     │ Category │ Qty │ Unit │ Desc    │
├────┼──────────┼──────────┼─────┼──────┼─────────┤
│ 1  │ Printer  │ IT Equip │ 2   │ unit │ HP      │
│ 2  │ Paper    │ Office   │ 10  │ box  │ A4 size │
└────┴──────────┴──────────┴─────┴──────┴─────────┘
```

**5. Signature Block**
```
Prepared By:                Approved By:

_________________          _________________
[User Name]                [Manager Name]
Date: __________          Date: __________
```

**6. Page Footer**
```
Generated by OptiMind ERP | Page 1 of 2 | 2026-06-22
```

### Design Guidelines

- **Typography**: Professional sans-serif font (Arial, Helvetica)
- **Colors**: Black text, subtle gray borders
- **Spacing**: Generous padding for readability
- **Tables**: Clear headers, alternating row colors
- **Page breaks**: Avoid splitting tables across pages
- **Margins**: 20mm top/bottom, 15mm left/right

### Supplier Information Limitation

⚠️ **Current Limitation:**
- Database only stores supplier name
- Missing: address, phone, email, tax ID

**Temporary Solution:**
- Purchase Order template shows supplier name
- Placeholder text for missing fields:
  ```
  Supplier: [Supplier Name]
  Address: [To be added]
  Contact: [To be added]
  ```

**Future Enhancement Required:**
- Design Supplier detail management feature
- Add fields: address, phone, email, tax ID, payment terms
- Update templates when data available

---

## Database & Data Flow

### No New Tables Required

This system uses existing tables:
- `PurchaseRequestRecord` - PR data
- `PurchaseOrder` - PO data
- `Invoice` - Invoice data
- `Supplier` - Supplier data

No persistent storage needed for exports.

### Data Flow

```
User triggers export
    ↓
Frontend sends request
POST /api/export/:dataType
{
  format: 'pdf',
  filters: { status: 'PENDING', department: 'IT' }
}
    ↓
Backend processes
1. Validate user permissions
2. Query database with filters
3. Format data for template
4. Render Handlebars template
5. Generate file based on format:
   - PDF: Puppeteer (HTML → PDF)
   - Excel: exceljs
   - CSV: String builder
   - JSON: JSON.stringify
6. Return file stream
    ↓
Frontend receives response
- Triggers browser download
- Shows success message
```

### API Endpoint Design

```javascript
// Generic export endpoint
POST /api/export/:dataType

// Path parameter
:dataType = 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers'

// Request body
{
  format: 'pdf' | 'excel' | 'csv' | 'json',
  filters: {
    status?: string,
    department?: string,
    dateFrom?: string,
    dateTo?: string
  },
  options?: {
    includeDetails: boolean,
    groupBy?: string,
    sortBy?: string
  }
}

// Response
Success: File stream with appropriate content-type
Error: { success: false, message: string }
```

### Permission Control

- Users export only their department's data
- Super Admin exports all departments
- Applied at query level (WHERE department = ?)

---

## Technical Implementation

### NPM Dependencies

**Backend:**
```json
{
  "handlebars": "^4.7.8",
  "puppeteer": "^21.0.0",
  "exceljs": "^4.4.0",
  "handlebars-helpers": "^0.10.0"
}
```

### Service Architecture

**1. Template Renderer Service**
```javascript
// backend/services/template-renderer.js
class TemplateRenderer {
  constructor() {
    this.templates = new Map();
    this.registerPartials();
    this.registerHelpers();
  }

  registerPartials() {
    // Load header.hbs, footer.hbs, etc.
  }

  registerHelpers() {
    // formatDate, formatCurrency, etc.
  }

  render(templateName, data) {
    // Compile and render template
    // Return HTML string
  }
}
```

**2. Export Service**
```javascript
// backend/services/export-service.js
class ExportService {
  async exportToPDF(data, templateName) {
    const html = renderer.render(templateName, data);
    return pdfGenerator.generate(html);
  }

  async exportToExcel(data, sheetName) {
    // Use exceljs to create workbook
  }

  async exportToCSV(data) {
    // Convert to CSV string
  }

  async exportToJSON(data) {
    return JSON.stringify(data, null, 2);
  }
}
```

**3. PDF Generator**
```javascript
// backend/services/pdf-generator.js
class PDFGenerator {
  async generate(html) {
    const browser = await puppeteer.launch(config);
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      printBackground: true
    });
    await browser.close();
    return pdf;
  }
}
```

### Puppeteer Configuration

```javascript
// backend/config/puppeteer-config.js
module.exports = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  pdfOptions: {
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    printBackground: true,
    displayHeaderFooter: false  // We use custom header/footer in HTML
  }
};
```

### Performance Optimization

1. **Template Caching**
   - Cache compiled templates in memory
   - Invalidate on file changes (dev mode)

2. **Puppeteer Connection Pool**
   - Reuse browser instances
   - Max 3 concurrent instances

3. **Pagination for Large Datasets**
   - Auto-paginate > 1000 records
   - PDF: 50 records per page

4. **Async Generation for Large Files**
   - Use job queue for > 5000 records
   - Return task ID, poll for completion

### Error Handling

```javascript
// Common error scenarios
1. No data found → Return friendly message
2. Puppeteer fails → Fallback to simple HTML
3. Permission denied → Return 403
4. Timeout → Return 504 and log
```

### Deployment Considerations

⚠️ **Puppeteer requires system dependencies:**

**Docker:**
```dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils
```

**Environment Variable:**
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

## Future Enhancements

### Phase 2: Advanced Features

1. **Supplier Detail Management**
   - Add supplier CRUD interface
   - Fields: address, phone, email, tax ID, payment terms
   - Update PO template to use real data

2. **Custom Templates**
   - Allow admin to customize templates
   - Template editor UI
   - Save custom templates per user/department

3. **Batch Export**
   - Select multiple records
   - Export as single PDF or zip file

4. **Scheduled Exports**
   - Automated daily/weekly reports
   - Email delivery

5. **Export History**
   - Track all exports
   - Re-download previous exports

---

## Testing Strategy

### Unit Tests

**Template Rendering:**
- Test each template with sample data
- Verify all partials render correctly
- Test helper functions

**Export Service:**
- Test each format generator
- Verify file output is correct
- Test error handling

### Integration Tests

**API Endpoints:**
- Test each export endpoint
- Verify permissions work correctly
- Test filter application

**Chatbot Integration:**
- Test OPTIONS display
- Test export_data tool call
- Verify download links work

### E2E Tests

**User Workflows:**
1. User exports from chatbot
2. User exports from module page
3. User prints document
4. User filters then exports

### Manual Testing Checklist

- [ ] All templates render correctly
- [ ] PDF print quality acceptable
- [ ] Excel files open correctly
- [ ] CSV files formatted properly
- [ ] Chatbot OPTIONS buttons work
- [ ] Module export buttons work
- [ ] Print button opens print dialog
- [ ] Permissions enforced correctly
- [ ] Large datasets handled (1000+ records)
- [ ] Error messages clear and helpful

---

## Success Criteria

### Functional Success

✅ Users can export via chatbot with OPTIONS selection  
✅ All module pages have Export and Print buttons  
✅ PDF documents look professional and print-ready  
✅ Excel exports open and analyze correctly  
✅ CSV exports import into other tools  
✅ Permission controls work correctly  

### Performance Success

✅ < 5 seconds for small datasets (<100 records)  
✅ < 30 seconds for large datasets (<1000 records)  
✅ No server crashes under load  

### Usability Success

✅ Users understand how to export (clear UI)  
✅ Loading states provide feedback  
✅ Error messages are helpful  
✅ Documents look professional  

---

**End of Design Document**
