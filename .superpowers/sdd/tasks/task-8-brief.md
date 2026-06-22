# Task 8: Export Service (Unified Export Logic)

## Goal
Create the unified export service that orchestrates template rendering, PDF generation, and Excel/CSV/JSON export.

## Files to Create
- `backend/services/export-service.js` - Export service class
- `backend/test/export-service.test.js` - Unit tests

## Requirements

### ExportService Class

**exportToPDF(dataType, records)**
- Format data using data-formatter
- Render template using template-renderer
- Generate PDF using pdf-generator
- Return PDF buffer

**exportToExcel(dataType, records)**
- Format data using data-formatter
- Create Excel workbook using exceljs
- Add worksheet with data table
- Return Excel buffer

**exportToCSV(dataType, records)**
- Format data using data-formatter
- Convert to CSV string
- Return CSV string

**exportToJSON(records)**
- Format data using data-formatter
- Convert to JSON string (pretty print)
- Return JSON string

### Supported Data Types
- purchase-requests
- purchase-orders
- invoices
- suppliers

### Tests
- Test all 4 formats for each data type
- Test empty data handling
- Test invalid data type
- Run with vitest

## Success Criteria
- ExportService class implemented
- All 4 export methods working
- Tests written first (TDD)
- All tests pass
- Proper integration with prior services
- Committed with conventional format
