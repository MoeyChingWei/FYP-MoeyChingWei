# Export Purchase Requests Feature

## Overview

This feature allows users to export their purchase requests to CSV or JSON format directly from the ChatBot interface.

## Features

### 1. **Backend Export Utilities** (`backend/utils/export-purchase-requests.js`)
- **CSV Export**: Converts purchase requests to CSV format with all line items flattened
- **JSON Export**: Exports purchase requests in structured JSON format
- **Automatic Filename Generation**: Creates timestamped filenames with department prefix

### 2. **AI Assistant Integration** (`backend/agents/chatbot/chatbot-agent.js`)
- **New Tool**: `export_purchase_requests` tool for the AI assistant
- **Natural Language Commands**: Users can ask the chatbot to export purchase requests
- **Smart Filtering**: Supports filtering by status (ALL, PENDING, SUBMITTED, APPROVED, REJECTED)
- **Department Filtering**: Automatically filters by user's department (unless Super Admin)

### 3. **REST API Endpoint** (`backend/routes/chatbot.js`)
- **Endpoint**: `POST /api/chatbot/export-purchase-requests`
- **Parameters**:
  - `userId` (required): User ID
  - `format` (optional): 'csv' or 'json' (default: 'csv')
  - `status` (optional): 'ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED' (default: 'ALL')
  - `limit` (optional): Maximum number of records (default: 100)
- **Response**: File download with appropriate headers

### 4. **Frontend UI** (`client/src/FrontEnd/pages/ChatBotPage.tsx`)
- **Export Button**: Located in the chatbot sidebar below "New Chat" button
- **Format Selection**: Dropdown menu to choose CSV or JSON format
- **User Feedback**: Loading indicator and success/error messages
- **Automatic Download**: Browser automatically downloads the generated file

## How to Use

### Method 1: Using the Export Button
1. Open the ChatBot page
2. Look for the "Export Purchase Requests" button in the sidebar
3. Click the button and select your preferred format (CSV or JSON)
4. The file will automatically download to your browser's default download folder

### Method 2: Using Natural Language (AI Assistant)
1. Type a message like:
   - "Export all purchase requests"
   - "Download purchase requests as CSV"
   - "Export pending purchase requests"
   - "Give me a file of all approved purchase requests"
2. The AI will call the export tool and provide the data
3. *(Note: Direct file download through chat is not yet implemented, but the data is prepared)*

## Export Data Structure

### CSV Format
The CSV export includes the following columns:
- **PR Number**: Purchase request number
- **Status**: PENDING, SUBMITTED, APPROVED, or REJECTED
- **Department**: Requesting department
- **Requested By**: Name of requester
- **Request Date**: Date of request
- **Email**: Requester's email
- **Currency**: Currency code (e.g., MYR)
- **Urgency**: normal, urgent, or critical
- **Item #**: Line item number
- **Item Name**: Name of the item
- **Category**: Item category
- **Description**: Item description
- **Quantity**: Quantity requested
- **Unit**: Unit of measurement
- **Unit Price**: Price per unit
- **Total Price**: Total price (Quantity × Unit Price)
- **Supplier Name**: Supplier name (if assigned)
- **Supplier Email**: Supplier email (if assigned)
- **Procurement Notes**: Additional notes from procurement

### JSON Format
The JSON export maintains the hierarchical structure:
```json
[
  {
    "prNumber": "PR-20260621-001",
    "status": "PENDING",
    "department": "IT",
    "requestBy": "John Doe",
    "requestDate": "2026-06-21",
    "createdByEmail": "john@example.com",
    "currency": "MYR",
    "urgency": "normal",
    "procurementNotes": "",
    "lineItems": [
      {
        "itemName": "Laptop",
        "itemCategory": "IT Equipment",
        "quantity": 5,
        "unitOfMeasurement": "piece",
        "itemDescription": "Buy Laptop - for new employees",
        "unitPrice": 3500,
        "supplierName": "Tech Supplier Co",
        "supplierEmail": "sales@techsupplier.com"
      }
    ]
  }
]
```

## Technical Implementation

### Dependencies Added
- **json2csv**: Used for converting JSON data to CSV format
  ```bash
  npm install json2csv
  ```

### File Changes
1. `backend/package.json` - Added json2csv dependency
2. `backend/utils/export-purchase-requests.js` - New export utility functions
3. `backend/agents/chatbot/chatbot-agent.js` - Added export tool and updated system prompt
4. `backend/routes/chatbot.js` - Added export endpoint
5. `client/src/FrontEnd/shared/api/chatbot.ts` - Added exportPurchaseRequests function
6. `client/src/FrontEnd/pages/chatbot-api.ts` - Re-exported the function
7. `client/src/FrontEnd/pages/ChatBotPage.tsx` - Added UI button and handler

### Security Features
- **Department Filtering**: Non-admin users only see their department's requests
- **User Authentication**: Requires valid userId
- **Input Validation**: Validates all parameters before processing
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Future Enhancements

1. **Direct File Download in Chat**: Allow users to download files directly from chat messages
2. **Excel Format**: Add support for .xlsx format with formatting
3. **Custom Filters**: Allow filtering by date range, requester, or specific items
4. **Scheduled Exports**: Automatic periodic exports via email
5. **Export Templates**: Pre-configured export formats for different use cases
6. **Batch Export**: Export multiple departments or status types in one request

## Testing

### Manual Testing Steps
1. **Login** as a user with purchase requests
2. **Navigate** to the ChatBot page
3. **Click** the "Export Purchase Requests" button
4. **Select** CSV or JSON format
5. **Verify** the file downloads successfully
6. **Open** the file and verify the data is correct
7. **Test** with different user roles (regular user vs Super Admin)
8. **Test** the AI assistant by typing "export purchase requests"

### Expected Behavior
- ✅ Users can export their department's purchase requests
- ✅ Super Admins can export all purchase requests
- ✅ CSV files open correctly in Excel/Google Sheets
- ✅ JSON files are valid and well-formatted
- ✅ Filenames include timestamp and department name
- ✅ Loading indicators show during export
- ✅ Success/error messages are displayed
- ✅ Export respects department permissions

## Troubleshooting

### Issue: "No purchase requests found to export"
- **Cause**: User has no purchase requests or all are filtered out
- **Solution**: Create some purchase requests first or check filter settings

### Issue: Export button not visible
- **Cause**: User not logged in or page not loaded
- **Solution**: Refresh the page and ensure you're logged in

### Issue: File downloads as .txt instead of .csv
- **Cause**: Browser settings or MIME type issue
- **Solution**: Check backend Content-Type headers and browser download settings

### Issue: Permission denied
- **Cause**: User doesn't have access to the requested data
- **Solution**: Verify user permissions and department assignments

## API Example

### cURL Command
```bash
curl -X POST http://localhost:3001/api/chatbot/export-purchase-requests \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "format": "csv",
    "status": "ALL",
    "limit": 100
  }' \
  --output purchase_requests.csv
```

### JavaScript Example
```javascript
const result = await exportPurchaseRequests({
  userId: 1,
  format: 'csv',
  status: 'PENDING',
  limit: 50
});

console.log(`Exported ${result.recordCount} records to ${result.filename}`);
```

## Summary

The Export Purchase Requests feature provides a complete solution for exporting purchase request data in multiple formats. It integrates seamlessly with both the UI and AI assistant, providing users with flexible options for accessing their data.

**Key Benefits:**
- 📊 Easy data export for reporting and analysis
- 🤖 AI-powered natural language interface
- 🔒 Secure with department-level access control
- 📁 Multiple format support (CSV, JSON)
- ⚡ Fast and efficient export process
