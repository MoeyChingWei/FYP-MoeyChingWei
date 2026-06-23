# Task 3: Create Export Handler Utility - Report

**Status:** COMPLETED

**Date:** 2026-06-23

## Summary

Successfully created `backend/utils/chatbot-export-handler.js` with comprehensive export handling functionality. The utility manages export requests from the chatbot to the backend export API with robust error handling and file management.

## Implementation

### File Created
- **Path:** `backend/utils/chatbot-export-handler.js`
- **Lines:** 288 lines
- **Functions:** 3 exported functions

### Core Functionality

#### 1. handleExport Function
Main export handler that:
- Validates data type and format inputs
- Authenticates user credentials (userId, userRole)
- Calls backend export API via axios
- Handles file download and storage
- Returns metadata with download URL

**Parameters:**
```javascript
{
  dataType: 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers',
  format: 'pdf' | 'excel' | 'csv' | 'json',
  filters: {
    status: 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED',
    dateRange: string,
    department: string,
    limit: number
  },
  userId: number,
  userRole: string,
  userDepartment: string
}
```

**Return Value:**
```javascript
{
  success: true,
  dataType: string,
  format: string,
  filename: string,
  filePath: string,
  downloadUrl: string,
  recordCount: number,
  filters: object,
  timestamp: string,
  message: string
}
```

#### 2. Error Handling

Comprehensive error handling for all specified scenarios:

| Error Type | HTTP Code | Error Code | User Message |
|------------|-----------|------------|--------------|
| Permission Denied | 403 | PERMISSION_DENIED | "You do not have permission to export this data. Contact your administrator." |
| No Data Found | 404 | NO_DATA | "No records found matching your criteria. Try adjusting your filters." |
| Bad Request | 400 | BAD_REQUEST | "Invalid export request. Please check your parameters." |
| Server Error | 500/502/503 | SERVER_ERROR | "Export service error: {message}. Please try again later." |
| Timeout | ETIMEDOUT | TIMEOUT | "Export request timed out. Try exporting fewer records or contact support." |
| Connection Refused | ECONNREFUSED | CONNECTION_REFUSED | "Unable to connect to export service. Please try again later." |
| Invalid Data Type | - | INVALID_DATA_TYPE | "Invalid data type. Supported types: ..." |
| Invalid Format | - | INVALID_FORMAT | "Invalid format. Supported formats: ..." |
| Missing Auth | - | MISSING_AUTH | "User authentication required for export" |

#### 3. File Management

**Directory Structure:**
- Temp directory: `backend/temp/exports/`
- Auto-created with `fs.mkdir(..., { recursive: true })`

**File Naming Convention:**
```
{dataType}-{timestamp}.{extension}
```
Example: `purchase-requests-2026-06-23T12-30-45-123Z.csv`

**Download URL Format:**
```
/api/chatbot/download/{filename}
```

#### 4. Utility Functions

**cleanupOldExports():**
- Deletes export files older than 1 hour
- Returns number of files deleted
- Runs asynchronously for maintenance

**getExportFile(filename):**
- Retrieves file info from temp directory
- Returns file metadata (size, timestamps)
- Returns null if file not found

### Technical Specifications

#### Axios Configuration
```javascript
axios.post(url, payload, {
  responseType: 'arraybuffer',
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})
```

#### Backend API Endpoint
```
POST {BACKEND_API_BASE}/api/export/{dataType}
```

#### Environment Variables
- `BACKEND_API_BASE` - Backend server URL (default: `http://localhost:5000`)

#### Format Extensions
- pdf → .pdf
- excel → .xlsx
- csv → .csv
- json → .json

## Alignment with Requirements

✅ **Data Types:** Supports all 4 data types (purchase-requests, purchase-orders, invoices, suppliers)

✅ **Export Formats:** Supports all 4 formats (pdf, excel, csv, json)

✅ **Error Handling:**
- 403 Permission Denied
- 404 No Data Found
- 400 Bad Request
- 500/502/503 Server Errors
- Timeout errors
- Connection errors

✅ **File Management:**
- Saves to `temp/exports/` directory
- Generates timestamped filenames
- Returns download URL

✅ **Axios Configuration:**
- responseType: 'arraybuffer'
- timeout: 60000ms

✅ **API Integration:**
- POST /api/export/:dataType
- Passes userId, userRole, userDepartment for permissions

## Commit

**Hash:** 8dfb019

**Message:**
```
feat: add chatbot export handler utility

- Implement handleExport function with axios
- Support all 4 data types and 4 formats
- Add comprehensive error handling:
  - 403 Permission Denied
  - 404 No Data Found
  - 400 Bad Request
  - 500/502/503 Server Errors
  - TIMEOUT and CONNECTION_REFUSED
- Save files to temp/exports/ directory
- Return metadata with download URL
- Add cleanupOldExports utility for maintenance
- Add getExportFile utility for file retrieval

Technical specs:
- axios with responseType: 'arraybuffer'
- timeout: 60000ms
- POST /api/export/:dataType
- File naming: {dataType}-{timestamp}.{extension}
- Temp dir: backend/temp/exports/
```

## Code Quality

- **Modular Design:** Three focused functions with clear responsibilities
- **Input Validation:** Validates all required parameters before API call
- **Error Recovery:** Graceful error handling with user-friendly messages
- **Logging:** Console logs for debugging and monitoring
- **Maintainability:** Clean code structure with comments and documentation
- **Extensibility:** Easy to add new data types or formats

## Testing Considerations

The utility is ready for:
1. Unit testing with mocked axios calls
2. Integration testing with real backend API
3. Error scenario testing (timeout, 404, 403, etc.)
4. File system testing (save, cleanup, retrieve)

## Next Steps

Task 4 will integrate this utility into the chatbot agent's tool handlers, making it callable by DeepSeek AI when users request exports.

---

Generated: 2026-06-23
