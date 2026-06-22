# Task 8 Brief: Export Service (Unified Export Logic)

## Objective
Create a unified export service that orchestrates data formatting, template rendering, and document generation across multiple formats (PDF, Excel, CSV, JSON).

## Requirements

### Core Functionality
The ExportService must provide methods to export data in 4 formats:
1. **PDF** - Using template renderer + PDF generator
2. **Excel** - Using exceljs library
3. **CSV** - Simple comma-separated values
4. **JSON** - Raw formatted data

### Supported Data Types
All export methods (except JSON) must support 4 data types:
- Purchase Requests
- Purchase Orders
- Invoices
- Suppliers

### Service Methods

#### 1. exportToPDF(dataType, data, outputPath, options)
- Integrates: data-formatter → template-renderer → pdf-generator
- Parameters:
  - `dataType`: 'purchase-request' | 'purchase-order' | 'invoice' | 'supplier'
  - `data`: Database record
  - `outputPath`: Where to save the PDF
  - `options`: { preparedBy, approvedBy } (passed to formatter)
- Returns: `{ success: true, outputPath, format: 'pdf' }`

#### 2. exportToExcel(dataType, data, outputPath, options)
- Uses exceljs to create spreadsheet
- Parameters: Same as exportToPDF
- Creates formatted Excel file with:
  - Header row with company name
  - Document info section
  - Data table with headers
  - Footer with prepared/approved by
- Returns: `{ success: true, outputPath, format: 'excel' }`

#### 3. exportToCSV(dataType, data, outputPath, options)
- Simple CSV export
- Parameters: Same as exportToPDF
- First row: headers
- Subsequent rows: data
- Returns: `{ success: true, outputPath, format: 'csv' }`

#### 4. exportToJSON(data, outputPath)
- Raw JSON export (no formatting needed)
- Parameters:
  - `data`: Any JSON-serializable data
  - `outputPath`: Where to save the JSON
- Returns: `{ success: true, outputPath, format: 'json' }`

### Template Naming Convention
Map dataType to template names:
- `'purchase-request'` → `'documents/purchase-request'`
- `'purchase-order'` → `'documents/purchase-order'`
- `'invoice'` → `'documents/invoice'`
- `'supplier'` → `'documents/supplier'`

### Formatter Mapping
Map dataType to formatter functions:
- `'purchase-request'` → `formatPurchaseRequest()`
- `'purchase-order'` → `formatPurchaseOrder()`
- `'invoice'` → `formatInvoice()`
- `'supplier'` → `formatSupplier()`

### Error Handling
- Validate dataType is supported
- Validate required parameters
- Wrap errors with descriptive messages
- Clean up resources on failure

## Global Constraints
- Must integrate: template-renderer, pdf-generator, data-formatter
- Must support 4 formats: PDF, Excel, CSV, JSON
- Must support 4 data types for PDF/Excel/CSV
- Use exceljs ^4.4.0 for Excel generation
- Follow TDD: write tests first, then implementation
- Use conventional commit format

## Dependencies
- `services/data-formatter.js` (Task 7)
- `services/template-renderer.js` (Task 5)
- `services/pdf-generator.js` (Task 6)
- `exceljs` package (already installed)
- `fs/promises` for file operations

## Test Requirements
Write comprehensive tests covering:
1. **PDF Export Tests** (4 data types)
   - Successful PDF generation for each data type
   - File exists after export
   - Error handling for invalid data type

2. **Excel Export Tests** (4 data types)
   - Successful Excel generation for each data type
   - File exists and has correct extension
   - Error handling

3. **CSV Export Tests** (4 data types)
   - Successful CSV generation for each data type
   - CSV structure validation
   - Error handling

4. **JSON Export Tests**
   - Successful JSON export
   - Valid JSON structure
   - Error handling

5. **Integration Tests**
   - Complete workflow for each format
   - Resource cleanup

## Success Criteria
- All tests passing (minimum 16 tests)
- All 4 formats implemented
- All 4 data types supported (except JSON)
- Clean integration with existing services
- Proper error handling
- Code follows project conventions
