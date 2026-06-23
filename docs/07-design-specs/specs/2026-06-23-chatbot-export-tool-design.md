# Chatbot export_data Tool Integration Design

**Date:** 2026-06-23  
**Version:** 1.0  
**Status:** Approved  
**Author:** Claude (with User)

---

## Executive Summary

Enhance the OptiMind ERP chatbot with intelligent export functionality. Users can request data exports through natural language, receive OPTIONS buttons for format selection, and get download links — all within the chat interface.

**Key Goals:**
- Upgrade existing `export_purchase_requests` tool to universal `export_data` tool
- Support 4 data types: Purchase Requests, Purchase Orders, Invoices, Suppliers
- Support 4 formats: PDF, Excel, CSV, JSON
- Show OPTIONS buttons when format not specified
- Provide download links with file metadata

**Implementation Strategy:** Extend existing chatbot tool infrastructure, integrate with completed backend export API, maintain backward compatibility.

---

## Current State Analysis

### Existing Infrastructure

**Chatbot Agent (`backend/agents/chatbot/chatbot-agent.js`):**
- Uses DeepSeek AI service for LLM
- Has `export_purchase_requests` tool (CSV/JSON only)
- System prompt in `CHATBOT_SYSTEM_PROMPT` constant
- OPTIONS button support already implemented

**Backend Export API:**
- ✅ Complete: `POST /api/export/:dataType`
- ✅ Supports: purchase-requests, purchase-orders, invoices, suppliers
- ✅ Formats: pdf, excel, csv, json
- ✅ Department-level permissions
- ✅ Filter support

**Frontend:**
- ✅ ExportButton and PrintButton components complete
- ✅ Integrated into PurchaseOrderReview page

### Gaps to Address

1. **Limited Data Types:** Current tool only exports purchase requests
2. **Limited Formats:** Only CSV and JSON, missing PDF and Excel
3. **No Format Selection UI:** No OPTIONS buttons for format choice
4. **Inconsistent Experience:** Chatbot export differs from UI button export

---

## Design Decisions

### Chosen Approach: Extend Existing Tool (Method A)

**Rationale:**
1. Unified user experience across chatbot and UI
2. Leverage completed backend API
3. Maintain backward compatibility
4. OPTIONS buttons for friendly format selection
5. Support natural language: "导出PDF格式的采购订单"

**Alternative Approaches Considered:**
- **Method B (Dual Tools):** Keep old tool + add new tool — rejected due to confusion and redundancy
- **Method C (Prompt Only):** No tool changes, guide users to UI — rejected as missed opportunity for intelligent exports

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User in Chat Interface                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        Natural Language: "导出采购申请"
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Chatbot Agent (chatbot-agent.js)               │
│  • Detects export intent                                    │
│  • Extracts: dataType, format (if specified), filters       │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
   Format specified?           Format NOT specified
         │                           │
         │                           ▼
         │              ┌────────────────────────┐
         │              │  Return OPTIONS        │
         │              │  📄 PDF | 📊 Excel    │
         │              │  📋 CSV | 💾 JSON     │
         │              └────────────────────────┘
         │                           │
         │                           ▼
         │              User clicks format option
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           export_data Tool Handler                          │
│  • Calls: POST /api/export/:dataType                        │
│  • Payload: { userId, userRole, format, filters }           │
│  • Receives: Binary blob (file data)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Save Temporary File                            │
│  • Generate filename: {dataType}-{timestamp}.{ext}          │
│  • Save to: temp/exports/                                   │
│  • Create download URL: /api/exports/download/{filename}    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Return to User                                    │
│  ✅ Export ready!                                           │
│  📄 purchase-requests-1719187200000.pdf                     │
│  🔗 [Download Link]                                         │
│  📊 10 records, 2.3 MB                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tool Definition

### export_data Tool

```javascript
{
  name: 'export_data',
  description: 'Export system data in various formats (PDF, Excel, CSV, JSON) for purchase requests, orders, invoices, and suppliers',
  input_schema: {
    type: 'object',
    properties: {
      dataType: {
        type: 'string',
        enum: ['purchase-requests', 'purchase-orders', 'invoices', 'suppliers'],
        description: 'Type of data to export'
      },
      format: {
        type: 'string',
        enum: ['pdf', 'excel', 'csv', 'json'],
        description: 'Export format: pdf (professional document), excel (spreadsheet), csv (simple data), json (raw data)'
      },
      filters: {
        type: 'object',
        description: 'Optional filters to apply',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status (e.g., PENDING, APPROVED)'
          },
          dateFrom: {
            type: 'string',
            description: 'Start date (YYYY-MM-DD)'
          },
          dateTo: {
            type: 'string',
            description: 'End date (YYYY-MM-DD)'
          }
        }
      }
    },
    required: ['dataType', 'format']
  }
}
```

---

## System Prompt Enhancement

### New Export Section

Add to `CHATBOT_SYSTEM_PROMPT` (replaces existing "Exporting Purchase Requests" section):

```markdown
## Exporting Data

You can export various types of data for users. When users request to "export", "download", or ask for "a file":

### Step 1: Detect Data Type

Identify what they want to export:
- **Purchase Requests** - "采购申请", "purchase requests", "PR"
- **Purchase Orders** - "采购订单", "purchase orders", "PO"
- **Invoices** - "发票", "invoices"
- **Suppliers** - "供应商", "suppliers", "vendor list"

### Step 2: Detect Format (if specified)

- **PDF** 📄 - "PDF", "document", "打印"
- **Excel** 📊 - "Excel", "spreadsheet", "表格"
- **CSV** 📋 - "CSV", "逗号分隔"
- **JSON** 💾 - "JSON", "raw data", "原始数据"

### Step 3: If Format NOT Specified - Show OPTIONS

Use this exact format to display format selection buttons:

```
请选择导出格式：

OPTIONS:
- 📄 PDF (专业文档)
- 📊 Excel (电子表格)
- 📋 CSV (简单数据)
- 💾 JSON (原始数据)
```

The frontend will render these as clickable buttons.

### Step 4: Call export_data Tool

Once you have both dataType and format:

```javascript
export_data({
  dataType: "purchase-requests",
  format: "pdf",
  filters: {
    status: "PENDING",  // if user mentioned status
    dateFrom: "2024-01-01",  // if user mentioned date range
    dateTo: "2024-12-31"
  }
})
```

### Step 5: Present Results

After successful export, format response like this:

```
✅ 导出完成！

**文件信息：**
📄 文件名：purchase-requests-1719187200000.pdf
📊 记录数：25条
💾 文件大小：1.8 MB
🔗 [点击下载]({{downloadUrl}})

导出包含了您部门的所有待审批采购申请。
```

### Error Handling

- **Permission Error:** "抱歉，您没有权限导出此数据。"
- **No Data:** "没有找到符合条件的数据可以导出。"
- **Server Error:** "导出失败，请稍后重试。"

### Natural Language Examples

- "导出采购申请" → Show OPTIONS
- "export purchase orders as PDF" → Direct export as PDF
- "下载Excel格式的发票" → Direct export as Excel
- "我要供应商列表的CSV文件" → Direct export as CSV
```

---

## Implementation Details

### File Structure

**Files to Modify:**
- `backend/agents/chatbot/chatbot-agent.js` - Add export_data tool handler
- `backend/routes/chatbot.js` - Add download endpoint

**Files to Create:**
- `backend/utils/export-handler.js` - Unified export logic for chatbot

### export_data Tool Handler

```javascript
async handleExportData(toolInput, userId, userRole, userDepartment) {
  const { dataType, format, filters = {} } = toolInput;

  try {
    // Call backend export API
    const response = await axios.post(
      `http://localhost:3000/api/export/${dataType}`,
      {
        userId,
        userRole,
        format,
        filters: {
          ...filters,
          department: userRole === 'Super Admin' ? undefined : userDepartment
        }
      },
      {
        responseType: 'blob',
        timeout: 60000
      }
    );

    // Generate filename
    const timestamp = Date.now();
    const extension = format === 'excel' ? 'xlsx' : format;
    const filename = `${dataType}-${timestamp}.${extension}`;

    // Save temporary file
    const tempDir = path.join(__dirname, '../../temp/exports');
    await fs.promises.mkdir(tempDir, { recursive: true });
    const filePath = path.join(tempDir, filename);
    await fs.promises.writeFile(filePath, response.data);

    // Get file stats
    const stats = await fs.promises.stat(filePath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    // Return metadata
    return {
      success: true,
      filename,
      downloadUrl: `/api/chatbot/download/${filename}`,
      fileSize: `${fileSizeMB} MB`,
      format: format.toUpperCase(),
      timestamp: new Date().toLocaleString('zh-CN')
    };

  } catch (error) {
    console.error('Export error:', error);
    
    if (error.response?.status === 403) {
      return {
        success: false,
        error: 'permission_denied',
        message: '您没有权限导出此数据。'
      };
    } else if (error.response?.status === 404) {
      return {
        success: false,
        error: 'no_data',
        message: '没有找到符合条件的数据。'
      };
    } else {
      return {
        success: false,
        error: 'server_error',
        message: '导出失败，请稍后重试。'
      };
    }
  }
}
```

### Download Endpoint

```javascript
// Add to backend/routes/chatbot.js
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../temp/exports', filename);

  // Security: validate filename
  if (!filename.match(/^[a-zA-Z0-9-]+\.(pdf|xlsx|csv|json)$/)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  // Check file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Set headers
  const extension = path.extname(filename).slice(1);
  const contentType = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    json: 'application/json'
  }[extension] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Stream file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  // Clean up after download
  fileStream.on('end', () => {
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
    }, 5000); // Delete after 5 seconds
  });
});
```

---

## OPTIONS Button Format

### Frontend Handling

The chatbot frontend already supports OPTIONS format. When the tool returns OPTIONS data, the UI renders clickable buttons:

```javascript
// Response format for OPTIONS
{
  success: true,
  message: "请选择导出格式：",
  options: [
    { label: "📄 PDF", value: "pdf", description: "专业文档格式" },
    { label: "📊 Excel", value: "excel", description: "电子表格" },
    { label: "📋 CSV", value: "csv", description: "简单数据格式" },
    { label: "💾 JSON", value: "json", description: "原始数据" }
  ],
  context: {
    action: 'export_data',
    dataType: 'purchase-requests',
    filters: {
      status: 'PENDING'
    }
  }
}
```

When user clicks a button, the frontend sends:
```javascript
{
  message: "pdf",  // Selected value
  context: { /* preserved from OPTIONS response */ }
}
```

The agent then calls `export_data` with the selected format.

---

## Data Flow

### Scenario 1: Format Specified

```
User: "导出PDF格式的采购订单"
  ↓
Agent: Detects dataType="purchase-orders", format="pdf"
  ↓
Agent: Calls export_data({ dataType: "purchase-orders", format: "pdf" })
  ↓
Backend: Generates PDF
  ↓
Agent: Returns download link
  ↓
User: Receives "✅ 导出完成！[下载链接]"
```

### Scenario 2: Format NOT Specified

```
User: "导出采购申请"
  ↓
Agent: Detects dataType="purchase-requests", format=undefined
  ↓
Agent: Returns OPTIONS buttons
  ↓
User: Sees [📄 PDF] [📊 Excel] [📋 CSV] [💾 JSON]
  ↓
User: Clicks "📊 Excel"
  ↓
Agent: Calls export_data({ dataType: "purchase-requests", format: "excel" })
  ↓
Backend: Generates Excel file
  ↓
Agent: Returns download link
```

---

## Error Handling

### Common Error Scenarios

1. **Permission Denied (403)**
   - Message: "抱歉，您没有权限导出此数据。请联系管理员。"
   - Action: Log error, inform user

2. **No Data Found (404)**
   - Message: "没有找到符合条件的数据可以导出。请调整筛选条件。"
   - Action: Suggest modifying filters

3. **Server Error (500)**
   - Message: "导出失败，请稍后重试。如果问题持续，请联系技术支持。"
   - Action: Log error with details

4. **Timeout**
   - Message: "导出数据量较大，处理时间较长。请稍后重试。"
   - Action: Suggest exporting smaller date ranges

5. **Invalid Data Type**
   - Message: "抱歉，暂不支持导出该类型的数据。支持的类型：采购申请、采购订单、发票、供应商。"
   - Action: List supported types

---

## Security Considerations

1. **File Access Control**
   - Validate filename format (prevent path traversal)
   - Check file exists before serving
   - Auto-delete temp files after download

2. **Permission Enforcement**
   - Respect department-level permissions
   - Super Admin sees all data
   - Regular users see only their department

3. **Input Validation**
   - Validate dataType against whitelist
   - Validate format against whitelist
   - Sanitize filter inputs

4. **Rate Limiting**
   - Limit export frequency per user
   - Prevent abuse of download endpoint

---

## Backward Compatibility

### Migration Strategy

**Phase 1: Add export_data tool**
- Keep existing `export_purchase_requests` tool
- Add new `export_data` tool
- Update system prompt to prefer new tool

**Phase 2: Internal redirect (optional)**
- Make old tool call new tool internally
- Maintain same response format

**Phase 3: Deprecation (future)**
- After 1-2 months, remove old tool
- Update any hardcoded references

---

## Testing Strategy

### Unit Tests

1. **Tool Handler Tests:**
   - Test with all data types
   - Test with all formats
   - Test filter application
   - Test error scenarios

2. **Download Endpoint Tests:**
   - Test valid downloads
   - Test invalid filenames (security)
   - Test missing files
   - Test file cleanup

### Integration Tests

1. **End-to-End Export Flow:**
   - User request → OPTIONS → Selection → Download
   - Direct export (format specified)
   - With filters applied

2. **Permission Tests:**
   - Super Admin exports all data
   - Regular user exports only their department
   - Permission denied scenarios

### Manual Testing Checklist

- [ ] Natural language: "导出采购申请" shows OPTIONS
- [ ] Direct format: "export as PDF" skips OPTIONS
- [ ] All 4 data types work
- [ ] All 4 formats generate correctly
- [ ] Download links work
- [ ] Files auto-delete after download
- [ ] Error messages display correctly
- [ ] Permissions enforced
- [ ] Multi-language support (EN, ZH, MS)

---

## Success Criteria

### Functional Success

✅ Users can export 4 data types via chatbot  
✅ OPTIONS buttons show when format not specified  
✅ All 4 formats generate successfully  
✅ Download links work reliably  
✅ Error messages are clear and helpful  
✅ Permissions enforced correctly  
✅ Natural language requests work smoothly

### Non-Functional Success

✅ Export completes in < 5 seconds for <100 records  
✅ Temp files auto-delete to prevent disk fill  
✅ No memory leaks from file streaming  
✅ Chatbot response time < 2 seconds

---

## Future Enhancements

### Phase 2 Features (Optional)

1. **Export Preview:** Show record count before generating
2. **Scheduled Exports:** "Email me daily export of pending PRs"
3. **Batch Export:** "Export all purchase orders from last month"
4. **Custom Columns:** "Export only PR number, status, and date"
5. **Export History:** "Show my recent exports"
6. **Email Delivery:** "Send export to my email"

---

**End of Design Document**
