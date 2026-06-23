# Chatbot export_data Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add universal export_data tool to chatbot for exporting 4 data types in 4 formats with OPTIONS button UI.

**Architecture:** Extend existing chatbot tool infrastructure, add export_data tool that calls backend export API, implement file download endpoint, enhance system prompt for natural language export handling.

**Tech Stack:** Node.js, DeepSeek AI, axios, Express, fs/promises

## Global Constraints

- DeepSeek AI service for LLM (existing)
- Backend API: POST /api/export/:dataType (already complete)
- Supported data types: purchase-requests, purchase-orders, invoices, suppliers
- Supported formats: pdf, excel, csv, json
- File naming: {dataType}-{timestamp}.{extension}
- Temp file storage: backend/temp/exports/ (auto-cleanup after download)
- axios timeout: 60000ms
- Conventional commit messages

---

## File Structure

### Files to Modify
- `backend/agents/chatbot/chatbot-agent.js` (lines ~100-150 system prompt, ~400-410 tool definition, ~665+ tool handlers)
- `backend/routes/chatbot.js` (add download endpoint after line 50)

### Files to Create
- `backend/utils/chatbot-export-handler.js` - Unified export logic for chatbot

### Directories to Create
- `backend/temp/exports/` - Temporary file storage

---

### Task 1: Update System Prompt with Export Instructions

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js:103-150` (CHATBOT_SYSTEM_PROMPT)

**Interfaces:**
- Consumes: Existing CHATBOT_SYSTEM_PROMPT constant
- Produces: Enhanced system prompt with export instructions for use by DeepSeek AI

- [ ] **Step 1: Replace export section in system prompt**

Find the section starting with "## Exporting Purchase Requests" (around line 133) and replace with:

```javascript
// In CHATBOT_SYSTEM_PROMPT constant, replace existing export section with:

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

When format is not specified, respond with OPTIONS like this:

"请选择导出格式：

OPTIONS:
- 📄 PDF (专业文档)
- 📊 Excel (电子表格)
- 📋 CSV (简单数据)
- 💾 JSON (原始数据)"

The system will render these as clickable buttons.

### Step 4: Call export_data Tool

Once you have both dataType and format:

\`\`\`
Use export_data tool with:
- dataType: "purchase-requests" | "purchase-orders" | "invoices" | "suppliers"
- format: "pdf" | "excel" | "csv" | "json"
- filters: { status, dateFrom, dateTo } (optional)
\`\`\`

### Step 5: Present Results

After successful export:

✅ 导出完成！

**文件信息：**
📄 文件名：[filename]
📊 记录数：[count]条
💾 文件大小：[size]
🔗 [点击下载](downloadUrl)

### Error Handling

- Permission Error: "抱歉，您没有权限导出此数据。"
- No Data: "没有找到符合条件的数据可以导出。"
- Server Error: "导出失败，请稍后重试。"
```

- [ ] **Step 2: Commit system prompt update**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat(chatbot): enhance system prompt with universal export instructions

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Add export_data Tool Definition

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js:404-410` (tools array)

**Interfaces:**
- Consumes: Existing this.tools array structure
- Produces: export_data tool definition for DeepSeek AI to call

- [ ] **Step 1: Add export_data tool to tools array**

Find the tools array (around line 404) and add after existing tools:

```javascript
// Add to this.tools array (after export_purchase_requests)
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
},
```

- [ ] **Step 2: Commit tool definition**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat(chatbot): add export_data tool definition

Supports 4 data types and 4 formats

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Create Export Handler Utility

**Files:**
- Create: `backend/utils/chatbot-export-handler.js`

**Interfaces:**
- Consumes: None (utility function)
- Produces: `handleExport(dataType, format, filters, userId, userRole, userDepartment)` async function returning `{ success, filename, downloadUrl, fileSize, format }` or error object

- [ ] **Step 1: Create export handler utility**

```javascript
// backend/utils/chatbot-export-handler.js
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handle export request from chatbot
 * @param {string} dataType - Type of data to export
 * @param {string} format - Export format
 * @param {object} filters - Optional filters
 * @param {number} userId - User ID
 * @param {string} userRole - User role
 * @param {string} userDepartment - User department
 * @returns {Promise<object>} Export result with download URL
 */
export async function handleExport(dataType, format, filters = {}, userId, userRole, userDepartment) {
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
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Generate filename
    const timestamp = Date.now();
    const extension = format === 'excel' ? 'xlsx' : format;
    const filename = `${dataType}-${timestamp}.${extension}`;

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp/exports');
    await fs.mkdir(tempDir, { recursive: true });

    // Save file
    const filePath = path.join(tempDir, filename);
    await fs.writeFile(filePath, Buffer.from(response.data));

    // Get file stats
    const stats = await fs.stat(filePath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    // Return success response
    return {
      success: true,
      filename,
      downloadUrl: `/api/chatbot/download/${filename}`,
      fileSize: `${fileSizeMB} MB`,
      format: format.toUpperCase(),
      timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Kuala_Lumpur' })
    };

  } catch (error) {
    console.error('Export error:', error.message);
    
    // Handle specific error codes
    if (error.response?.status === 403) {
      return {
        success: false,
        error: 'permission_denied',
        message: '您没有权限导出此数据。请联系管理员。'
      };
    } else if (error.response?.status === 404) {
      return {
        success: false,
        error: 'no_data',
        message: '没有找到符合条件的数据可以导出。请调整筛选条件。'
      };
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        success: false,
        error: 'timeout',
        message: '导出数据量较大，处理时间较长。请稍后重试或导出较小的日期范围。'
      };
    } else {
      return {
        success: false,
        error: 'server_error',
        message: '导出失败，请稍后重试。如果问题持续，请联系技术支持。'
      };
    }
  }
}
```

- [ ] **Step 2: Commit export handler**

```bash
git add backend/utils/chatbot-export-handler.js
git commit -m "feat(chatbot): add export handler utility

Calls backend API and manages temp files

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Add export_data Tool Handler

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js:665+` (enrichToolHandlers method)

**Interfaces:**
- Consumes: 
  - `handleExport` from `backend/utils/chatbot-export-handler.js`
  - Tool input: `{ dataType, format, filters }`
  - User info: `userId` from enrichToolHandlers parameter
- Produces: Tool handler function that returns formatted response for chatbot

- [ ] **Step 1: Import export handler at top of file**

```javascript
// Add to imports at top of chatbot-agent.js (around line 7)
import { handleExport } from '../../utils/chatbot-export-handler.js';
```

- [ ] **Step 2: Add export_data handler to enrichToolHandlers**

Find the `enrichToolHandlers` method (around line 665) and add after `export_purchase_requests`:

```javascript
// Add to enrichToolHandlers method (after export_purchase_requests handler)
export_data: async (input) => {
  const { dataType, format, filters = {} } = input;
  
  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, department: true, name: true }
  });

  if (!user) {
    return 'Error: User not found';
  }

  console.log(`📤 Export request: ${dataType} as ${format} by user ${userId}`);

  // Call export handler
  const result = await handleExport(
    dataType,
    format,
    filters,
    user.id,
    user.role,
    user.department
  );

  // Format response based on result
  if (result.success) {
    return `✅ 导出完成！

**文件信息：**
📄 文件名：${result.filename}
💾 文件大小：${result.fileSize}
🕐 生成时间：${result.timestamp}
🔗 [点击下载](${result.downloadUrl})

导出格式：${result.format}`;
  } else {
    return `❌ ${result.message}`;
  }
},
```

- [ ] **Step 3: Commit tool handler**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat(chatbot): add export_data tool handler

Integrates with backend export API

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Add Download Endpoint

**Files:**
- Modify: `backend/routes/chatbot.js` (add route after line 50)

**Interfaces:**
- Consumes: Express router, fs module
- Produces: GET /api/chatbot/download/:filename endpoint

- [ ] **Step 1: Import required modules at top of file**

```javascript
// Add to imports at top of chatbot.js (around line 5)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

- [ ] **Step 2: Add download endpoint**

Add after the existing POST /chat route (around line 100):

```javascript
/**
 * GET /api/chatbot/download/:filename
 * Download exported file
 */
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;

  // Security: validate filename format
  if (!filename.match(/^[a-zA-Z0-9-]+\.(pdf|xlsx|csv|json)$/)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid filename format' 
    });
  }

  const filePath = path.join(__dirname, '../temp/exports', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false,
      error: 'File not found or has been deleted' 
    });
  }

  // Determine content type
  const extension = path.extname(filename).slice(1);
  const contentTypes = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv; charset=utf-8',
    json: 'application/json'
  };
  const contentType = contentTypes[extension] || 'application/octet-stream';

  // Set response headers
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-cache');

  // Stream file to response
  const fileStream = fs.createReadStream(filePath);
  
  fileStream.on('error', (error) => {
    console.error('File stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'Error streaming file' 
      });
    }
  });

  fileStream.pipe(res);

  // Clean up file after successful download
  fileStream.on('end', () => {
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete temp file:', err);
        } else {
          console.log(`🗑️ Cleaned up temp file: ${filename}`);
        }
      });
    }, 5000); // Delete after 5 seconds
  });
});
```

- [ ] **Step 3: Commit download endpoint**

```bash
git add backend/routes/chatbot.js
git commit -m "feat(chatbot): add export file download endpoint

Auto-cleanup after download

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Test Integration and Documentation

**Files:**
- Create: `docs/07-design-specs/guides/chatbot-export-usage.md`

**Interfaces:**
- Consumes: Completed export_data tool
- Produces: Usage documentation

- [ ] **Step 1: Create temp exports directory**

```bash
mkdir -p backend/temp/exports
echo "*" > backend/temp/exports/.gitignore
git add backend/temp/exports/.gitignore
```

- [ ] **Step 2: Manual test via chatbot UI**

Test these scenarios:
1. "导出采购申请" → Should show OPTIONS buttons
2. "export purchase orders as PDF" → Should export directly
3. "下载Excel格式的发票" → Should export as Excel
4. Click download link → File should download and auto-delete

Expected: All scenarios work correctly

- [ ] **Step 3: Create usage documentation**

```markdown
# Chatbot Export Usage Guide

## Overview

Users can export data through the chatbot using natural language requests.

## Supported Data Types

- Purchase Requests (采购申请)
- Purchase Orders (采购订单)
- Invoices (发票)
- Suppliers (供应商)

## Supported Formats

- 📄 PDF - Professional documents
- 📊 Excel - Spreadsheets (.xlsx)
- 📋 CSV - Simple data
- 💾 JSON - Raw data

## Usage Examples

### Format Not Specified (Shows OPTIONS)

User: "导出采购申请"
Bot: Shows [📄 PDF] [📊 Excel] [📋 CSV] [💾 JSON] buttons
User: Clicks "📊 Excel"
Bot: Generates and provides download link

### Format Specified (Direct Export)

- "export purchase orders as PDF"
- "下载Excel格式的发票"
- "我要供应商列表的CSV文件"

### With Filters

- "导出待审批的采购申请"
- "export approved purchase orders from last month"

## Response Format

```
✅ 导出完成！

**文件信息：**
📄 文件名：purchase-requests-1719187200000.pdf
💾 文件大小：1.8 MB
🕐 生成时间：2024/06/23 15:30:00
🔗 [点击下载](/api/chatbot/download/...)
```

## Error Messages

- **Permission Denied:** "您没有权限导出此数据。"
- **No Data:** "没有找到符合条件的数据可以导出。"
- **Timeout:** "导出数据量较大，处理时间较长。请稍后重试。"

## Technical Details

- Files stored temporarily in `backend/temp/exports/`
- Auto-delete after download (5 second delay)
- Department-level permissions enforced
- Timeout: 60 seconds
```

- [ ] **Step 4: Commit documentation**

```bash
git add docs/07-design-specs/guides/chatbot-export-usage.md backend/temp/exports/.gitignore
git commit -m "docs: add chatbot export usage guide

Complete integration documentation

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Task 1: System prompt enhancement
- ✅ Task 2: export_data tool definition
- ✅ Task 3: Export handler utility
- ✅ Task 4: Tool handler integration
- ✅ Task 5: Download endpoint
- ✅ Task 6: Documentation and testing

**Placeholder Scan:** No TBD, TODO, or placeholder code present.

**Type Consistency:** All function signatures and parameters match across tasks.

---

**Plan complete and saved to `docs/07-design-specs/plans/2026-06-23-chatbot-export-tool.md`.**
