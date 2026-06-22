# Task 10: Export API Routes

## Goal
Create REST API endpoints for export functionality.

## Files to Create
- `backend/routes/export.js` - Export API routes

## Files to Modify
- `backend/server.js` - Register export routes

## API Endpoints

**POST /api/export/:dataType**

Path parameter:
- `dataType`: purchase-requests | purchase-orders | invoices | suppliers

Request body:
```json
{
  "format": "pdf" | "excel" | "csv" | "json",
  "filters": {
    "status": "string",
    "department": "string",
    "dateFrom": "YYYY-MM-DD",
    "dateTo": "YYYY-MM-DD"
  }
}
```

Response:
- PDF/Excel: Binary file with appropriate Content-Type and Content-Disposition headers
- CSV: text/csv with UTF-8 encoding
- JSON: application/json

## Implementation Requirements

1. **Query data from database** using filters
2. **Apply department permissions** (users see only their department, Super Admin sees all)
3. **Call ExportService** with appropriate method
4. **Stream response** with correct headers
5. **Error handling** (400, 403, 404, 500)
6. **Validation** (dataType, format, filters)

## Success Criteria
- Routes registered in server.js
- All 4 data types supported
- All 4 formats working
- Permission checks working
- Proper error responses
- Tested with manual API calls
- Committed with conventional format
