# Chatbot Export System - User Guide

## Overview

The chatbot export system enables users to export procurement data in multiple formats through the intelligent chatbot interface. Users can request exports in natural language, and the system handles all validation, permission checks, and file generation.

## Supported Data Types

The export system supports four core data types:

1. **Purchase Requests** (`purchase-requests`)
   - Sourcing requests initiated by departments
   - Includes status, amounts, timestamps
   - Available filters: status, date range, department

2. **Purchase Orders** (`purchase-orders`)
   - Approved procurement orders sent to suppliers
   - Includes PO number, supplier, delivery dates
   - Available filters: status, date range, department

3. **Invoices** (`invoices`)
   - Supplier invoices for payment processing
   - Includes invoice number, amount, due date
   - Available filters: status, date range, department

4. **Suppliers** (`suppliers`)
   - Vendor information and contacts
   - Includes company name, contact details, categories
   - Available filters: department, category

## Supported Export Formats

### 1. PDF (`pdf`)
- Professional formatted documents
- Suitable for printing and archiving
- Includes headers, footers, and page numbers
- Best for: Reports, presentations, official records

### 2. Excel (`excel`)
- Spreadsheet format (.xlsx)
- Supports formulas and formatting
- Multiple sheets per file (if applicable)
- Best for: Data analysis, pivot tables, further processing

### 3. CSV (`csv`)
- Comma-separated values format
- Universal compatibility
- Plain text, no formatting
- Best for: Data import/export, system integration

### 4. JSON (`json`)
- Structured data format
- Complete metadata preservation
- Suitable for APIs and programmatic access
- Best for: System integration, API consumption

## Getting Started

### Via Chatbot Interface

Simply ask the chatbot to export data:

```
"Export all purchase requests in PDF format"
"Generate an Excel file of May invoices"
"Give me a CSV of all suppliers"
"Export Q2 purchase orders as JSON"
```

### Required Permissions

Users can only export data from their own department unless they have admin privileges.

**Permission Levels:**
- **Department Users**: Can export their department's data
- **Department Heads**: Can export all data within their department
- **Finance Team**: Can export cross-departmental procurement data
- **Administrators**: Can export all company data

## Usage Examples

### Example 1: Export Recent Purchase Requests (PDF)

**User Request:**
```
"Can you export the purchase requests from the last 30 days as a PDF?"
```

**Chatbot Response:**
```
✅ 采购申请数据导出成功！

📊 格式: PDF
📦 记录数: 42
📂 文件名: purchase-requests-2026-06-23T14-30-45-123Z.pdf
🔗 下载链接: /api/chatbot/download/purchase-requests-2026-06-23T14-30-45-123Z.pdf
⏰ 生成时间: 2026/6/23 22:30:45
```

**What you get:**
- Professional PDF report with all purchase request details
- Formatted with company header and branding
- Paginated for easy printing
- Download link ready in the chatbot interface

### Example 2: Export Pending Purchase Orders (Excel)

**User Request:**
```
"Export pending purchase orders from IT department as Excel"
```

**Chatbot Response:**
```
✅ 采购订单数据导出成功！

📊 格式: EXCEL
📦 记录数: 18
📂 文件名: purchase-orders-2026-06-23T14-32-15-456Z.xlsx
🔗 下载链接: /api/chatbot/download/purchase-orders-2026-06-23T14-32-15-456Z.xlsx
⏰ 生成时间: 2026/6/23 22:32:15
```

**What you get:**
- Spreadsheet with columns for all purchase order fields
- Sortable and filterable data
- Ready for pivot table analysis
- Export formulas for calculations

### Example 3: Export Invoices (CSV)

**User Request:**
```
"Give me a CSV file of all May invoices for accounting"
```

**Chatbot Response:**
```
✅ 发票数据导出成功！

📊 格式: CSV
📦 记录数: 156
📂 文件名: invoices-2026-06-23T14-35-20-789Z.csv
🔗 下载链接: /api/chatbot/download/invoices-2026-06-23T14-35-20-789Z.csv
⏰ 生成时间: 2026/6/23 22:35:20
```

**What you get:**
- Plain text CSV file
- Importable into any accounting system
- All data fields preserved
- No formatting overhead

### Example 4: Export Suppliers (JSON)

**User Request:**
```
"Export all active suppliers as JSON for system integration"
```

**Chatbot Response:**
```
✅ 供应商数据导出成功！

📊 格式: JSON
📦 记录数: 87
📂 文件名: suppliers-2026-06-23T14-40-05-012Z.json
🔗 下载链接: /api/chatbot/download/suppliers-2026-06-23T14-40-05-012Z.json
⏰ 生成时间: 2026/6/23 22:40:05
```

**What you get:**
- Structured JSON with complete metadata
- Ready for API consumption
- Includes all field information
- Can be parsed programmatically

## Filtering Options

When requesting exports, you can apply filters to narrow down results:

### Status Filter
```
"Export APPROVED purchase orders"
"Export PENDING invoices"
"Export REJECTED purchase requests"
```

**Valid statuses depend on data type:**
- Purchase Requests: PENDING, APPROVED, REJECTED, CANCELLED
- Purchase Orders: DRAFT, SENT, ACKNOWLEDGED, COMPLETED
- Invoices: PENDING, PAID, OVERDUE, CANCELLED
- Suppliers: ACTIVE, INACTIVE, BLOCKED

### Date Range Filter
```
"Export purchase requests from June 1-15"
"Export invoices between May 1 and May 31"
"Export Q2 purchase orders"
```

### Department Filter
```
"Export IT department purchase orders"
"Export Finance department suppliers"
"Export all departments' invoices"
```
*(Only available to Finance Team and Administrators)*

### Record Limit
```
"Export the top 50 purchase requests"
"Give me the last 100 invoices"
```

## Error Messages and Troubleshooting

### Error: Invalid Data Type
```
❌ 数据类型无效

The data type you requested is not supported.
Supported types: purchase-requests, purchase-orders, invoices, suppliers
```

**Solution:** Use one of the four supported data types listed above.

### Error: Invalid Format
```
❌ 导出格式无效

The export format you requested is not supported.
Supported formats: PDF, Excel, CSV, JSON
```

**Solution:** Choose one of the four supported formats.

### Error: Permission Denied
```
🚫 权限不足

You do not have permission to export this data.
Contact your administrator.
```

**Solution:** 
- You can only export data from your department
- Department Heads can export department data
- Contact Finance Team for cross-departmental exports
- Contact your administrator to request elevated permissions

### Error: No Data Found
```
📭 没有找到数据

No records found matching your criteria.
Try adjusting your filters.
```

**Solution:**
- Check your date range filters
- Verify the department name is correct
- Try removing filters to get all records
- Contact support if you believe data should exist

### Error: Export Timeout
```
⏰ 导出超时

Export request timed out. Try exporting fewer records or contact support.
```

**Solution:**
- Reduce the number of records (use date range filters)
- Break the export into multiple smaller requests
- Try again during off-peak hours
- Contact IT support if the issue persists

### Error: Server Error
```
🔧 服务器错误

Export service error. Please try again later.
```

**Solution:**
- Wait a few minutes and try again
- Try with a smaller dataset
- Contact IT support if the error continues

## Technical Details

### File Storage and Lifecycle

**Location:** `backend/temp/exports/`

**Filename Format:** `{dataType}-{timestamp}.{extension}`

Example: `purchase-requests-2026-06-23T14-30-45-123Z.pdf`

**Retention:**
- Files are automatically deleted 5 seconds after download completes
- Old files (> 1 hour old) are cleaned up automatically
- No manual cleanup required

### API Integration

#### Export Request
```
POST /api/export/{dataType}
Content-Type: application/json

{
  "format": "pdf|excel|csv|json",
  "filters": {
    "status": "PENDING|APPROVED|REJECTED|ALL",
    "dateRange": {
      "start": "2026-05-01",
      "end": "2026-05-31"
    },
    "department": "string",
    "limit": 100
  },
  "userId": number,
  "userRole": "string",
  "userDepartment": "string"
}
```

#### Download Request
```
GET /api/chatbot/download/{filename}

Response: Binary file with appropriate Content-Type header
```

### Security Features

1. **Filename Validation**
   - Pattern: `^[a-zA-Z0-9-]+\.(pdf|xlsx|csv|json)$`
   - Prevents directory traversal attacks
   - Only allows safe characters

2. **Permission Checks**
   - Department-level access control
   - Role-based authorization
   - Audit trail logging

3. **Content-Type Validation**
   - Verified before download
   - Prevents content type spoofing
   - Proper headers set for each format

4. **Auto-Cleanup**
   - Files removed after download
   - No persistent storage of exports
   - Old files cleaned up hourly

## Best Practices

### 1. Be Specific with Requests
✅ Good: "Export approved purchase orders from June 2026"
❌ Poor: "Export purchase orders"

### 2. Use Date Ranges for Large Datasets
✅ Good: "Export May invoices in CSV"
❌ Poor: "Export all invoices" (may timeout)

### 3. Choose the Right Format
- **PDF**: When you need a professional report
- **Excel**: When you need to analyze data further
- **CSV**: When you need to import into another system
- **JSON**: When you need programmatic access

### 4. Check Permissions First
If you get a permission error, request the appropriate role from your administrator or Department Head.

### 5. Large Exports
If exporting large datasets:
- Use date range filters to break it into smaller chunks
- Schedule exports during off-peak hours
- Export to Excel or CSV instead of PDF for faster generation

## Common Scenarios

### Scenario 1: Monthly Accounting Reconciliation
```
User: "Export all invoices from June in Excel format"
System: Generates spreadsheet with all June invoices ready for accounting review
```

### Scenario 2: Supplier Audit
```
User: "Export all active suppliers as JSON for our system"
System: Generates structured JSON file for system integration
```

### Scenario 3: Department Report
```
User: "Generate a PDF report of IT department purchase orders from Q2"
System: Creates formatted PDF with company branding for presentation
```

### Scenario 4: Data Backup
```
User: "Export all purchase requests from 2026 as CSV"
System: Generates CSV file for data archival and backup
```

## Support and Escalation

### Common Issues

**Issue:** Download link doesn't work
- Solution: Links are valid for 5 seconds after generation; request a new export

**Issue:** File is corrupted
- Solution: Try exporting again with the same parameters

**Issue:** Export takes too long
- Solution: Reduce data scope using filters (date range, status)

### Contact Support

For technical issues or questions:
- Email: support@company.com
- Internal Portal: IT Support Portal
- Slack: #procurement-support

## FAQs

**Q: How long do exported files stay on the server?**
A: Files are automatically deleted 5 seconds after download. If you need to keep the file, save it immediately after download.

**Q: Can I export data from other departments?**
A: Only if you have Finance Team or Administrator privileges. Contact your Department Head or administrator to request access.

**Q: What's the maximum number of records I can export?**
A: There's no hard limit, but very large exports (10,000+ records) may timeout. Use date range filters to break it into smaller chunks.

**Q: Can I schedule recurring exports?**
A: Not through the chatbot interface. Contact IT support for recurring export requirements.

**Q: Which format is best for data analysis?**
A: Excel (.xlsx) is best for analysis, sorting, and pivot tables.

**Q: Can I export to other formats?**
A: Currently supported formats are PDF, Excel, CSV, and JSON. Contact support if you need additional formats.

**Q: Is there an audit trail for exports?**
A: Yes, all exports are logged with user ID, timestamp, data type, and format for security and compliance purposes.

## Release Notes

### Version 1.0 (2026-06-23)
- Initial release of chatbot export system
- Support for 4 data types (purchase requests, purchase orders, invoices, suppliers)
- Support for 4 export formats (PDF, Excel, CSV, JSON)
- Permission-based access control
- Automatic file cleanup
- Comprehensive error handling

---

**Last Updated:** 2026-06-23
**Document Version:** 1.0
