import deepseekService from '../../services/deepseek-ai-service.js';
import titleGenerator from '../../services/title-generator.js';
import visionService from '../../services/vision-ai-service.js';
import prisma from '../../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { generatePRNumber } from '../../utils/pr-number-generator.js';
import { exportPurchaseRequestsToCSV, exportPurchaseRequestsToJSON } from '../../utils/export-purchase-requests.js';
import { handleExport } from '../../utils/chatbot-export-handler.js';

const COMMON_CATEGORIES = [
  'Office Supplies / Stationery',
  'IT Equipment / Hardware',
  'Raw Materials',
  'Cleaning Supplies',
  'Furniture',
  'Safety Equipment'
];

const COMMON_UNITS = [
  'box', 'piece', 'kg', 'liter', 'set', 'pack', 'unit'
];

const CREATE_PR_INTENTS = [
  'create purchase request',
  'new purchase request',
  'make a request',
  'create pr',
  'new pr',
  '我要申请',
  '创建采购申请',
  '建立采购申请'
];

const CANCEL_WORDS = ['cancel', 'stop', 'nevermind', 'quit', '取消', '不要了'];
const YES_WORDS = ['yes', 'y', 'add', 'another', 'add another', '继续', '再加', '加多一个'];
const DONE_WORDS = ['no', 'n', 'done', 'finish', 'submit', 'create', '完成', '提交', '好了'];
const SKIP_WORDS = ['skip', 'no', 'none', 'n/a', '-', '没有', '不用'];

/**
 * Format purchase requests with summary cards and table
 */
function formatPurchaseRequestsAsMarkdown(requests, total, statistics) {
  if (!requests || requests.length === 0) {
    return "You don't have any purchase requests yet.";
  }

  const statusEmoji = {
    'PENDING': '🔴',
    'APPROVED': '🟢',
    'REJECTED': '⚫',
    'SUBMITTED': '🟡'
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatItems = (items) => {
    if (!items || items.length === 0) return 'N/A';
    if (items.length === 1) {
      const item = items[0];
      const name = (item.itemName || 'Item').substring(0, 25);
      return `${name} (${item.quantity || 0} ${item.unitOfMeasurement || 'pcs'})`;
    }
    const firstItem = (items[0].itemName || 'Item').substring(0, 20);
    return `${firstItem}... +${items.length - 1} more`;
  };

  // Build summary using simple boxes
  let output = '**📊 Purchase Request Summary**\n\n';
  output += '```\n';
  output += '╔═════════════╦═════════════╦═════════════╦═════════════╗\n';
  output += '║  Total PR   ║   Pending   ║  Submitted  ║  Approved   ║\n';
  const totalStr = String(statistics?.total || total).padStart(2, ' ');
  const pendingStr = String(statistics?.pending || 0).padStart(2, ' ');
  const submittedStr = String(statistics?.submitted || 0).padStart(2, ' ');
  const approvedStr = String(statistics?.approved || 0).padStart(2, ' ');
  output += `║     ${totalStr}      ║      ${pendingStr}     ║      ${submittedStr}     ║      ${approvedStr}     ║\n`;
  output += '╚═════════════╩═════════════╩═════════════╩═════════════╝\n';
  output += '```\n\n';

  // Build standard Markdown table
  output += '**📋 Recent Purchase Requests**\n\n';
  output += '| PR Number | Status | Items | Date |\n';
  output += '|-----------|--------|-------|------|\n';

  requests.slice(0, 10).forEach((req) => {
    const status = req.status || 'PENDING';
    const emoji = statusEmoji[status] || '❓';
    const prNum = req.prNumber || 'N/A';
    const statusText = `${emoji} ${status}`;
    const items = formatItems(req.lineItems || req.items);
    const date = formatDate(req.createdAt);

    output += `| ${prNum} | ${statusText} | ${items} | ${date} |\n`;
  });

  output += '\n';

  return output;
}

const CHATBOT_SYSTEM_PROMPT = `You are the AI assistant for OptiMind ERP system.

Your responsibilities:
1. Answer user questions about system usage
2. Help users query data (purchase requests, orders, spending statistics, etc.)
3. Guide users through operations
4. Provide a friendly user experience
5. Analyze images when users upload them
6. Export purchase request data when requested

Current user information:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}

## Image Analysis

When a user uploads an image, you will receive the analysis results in the format:
[Image Analysis]
📷 filename.png:
[Description of what's in the image]

Use this information to:
- Answer questions about the image content
- Help identify items for purchase requests
- Extract text or data from screenshots
- Provide context-aware responses based on the visual content

If the image contains items that could be purchased, proactively offer to help create a purchase request using the information from the image.

## Exporting Data

When users ask to "export", "download", "get a file", or similar, follow this process:

### Step 1: Detect Data Type
Identify what data they want to export:
- **Purchase Requests**: Keywords like "purchase requests", "PR", "requisitions"
- **Purchase Orders**: Keywords like "purchase orders", "PO", "orders"
- **Invoices**: Keywords like "invoices", "billing", "receipts"
- **Suppliers**: Keywords like "suppliers", "vendor", "vendor list"

If unclear, ask: "Which data would you like to export?

OPTIONS:
- Purchase Requests
- Purchase Orders
- Invoices
- Suppliers"

### Step 2: Detect Export Format
Determine the preferred format:
- **CSV**: Best for Excel and Google Sheets (default if not specified)
- **JSON**: Best for developers and system integration
- **PDF**: For formatted documents and printing
- **Excel**: For advanced spreadsheet features

If not specified, default to CSV. You can also ask: "Which format would you prefer?

OPTIONS:
- CSV (Excel/Sheets compatible)
- JSON (for integration)
- PDF (formatted document)
- Excel (advanced features)"

### Step 3: Apply Optional Filters
For purchase requests and orders, offer filter options:
- **Status**: ALL, PENDING, SUBMITTED, APPROVED, REJECTED
- **Date Range**: Last 7 days, Last 30 days, Custom range
- **Department**: User's department (auto-filtered for non-admins)
- **Limit**: Default 100 records

Ask if filters are needed: "Would you like to apply any filters?

OPTIONS:
- No, export everything
- Filter by status
- Filter by date range
- Filter by specific department"

### Step 4: Call Export Tool
Based on data type and format, call the appropriate tool:

**For Purchase Requests:**
Call export_purchase_requests tool with:
- format: 'csv' | 'json' | 'pdf' | 'xlsx'
- status: 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
- limit: number (default 100)

**For Purchase Orders:**
Call export_purchase_orders tool (if available)

**For Invoices:**
Call export_invoices tool (if available)

**For Suppliers:**
Call export_suppliers tool (if available)

### Step 5: Present Results
After successful export, show:

"✅ Export ready! I've prepared {count} {dataType}(s) in {format} format.

**Export Details:**
- Records: {count}
- Data Type: {dataType}
- Format: {format}
- Status: {status} (if applicable)
- Date Range: {range} (if applicable)
- Department: {department}

The data includes all relevant details:
- For Purchase Requests: PR numbers, items, quantities, prices, suppliers
- For Orders: Order numbers, items, quantities, totals, status
- For Invoices: Invoice numbers, amounts, dates, vendors
- For Suppliers: Vendor names, contact info, payment terms

The file is ready. You can:
1. Copy the formatted data if you need to paste into Excel
2. Download via the system interface
3. Use the API directly at: POST /api/chatbot/export

Would you like me to show you a preview, apply different filters, or help with anything else?"

### Step 6: Handle Errors
If no data found:
"No {dataType} found matching your criteria. Try:
- Removing filters
- Expanding the date range
- Checking your department permissions
- Contacting your administrator"

## Creating Purchase Requests

When users say "create", "new purchase request", "make a request", or similar, guide them through creating a purchase request step-by-step:

1. Ask for item name: "What item do you need to purchase?"

2. Ask for category with options:
   "Which category does this item belong to?

   OPTIONS:
   - Office Supplies / Stationery
   - IT Equipment / Hardware
   - Raw Materials
   - Cleaning Supplies
   - Furniture
   - Safety Equipment
   - Other (type your own)"

3. Ask for quantity: "How many units do you need?" (must be a positive number)

4. Ask for unit of measurement with options:
   "What's the unit of measurement?

   OPTIONS:
   - box
   - piece
   - kg
   - liter
   - set
   - pack
   - unit
   - Other (type your own)"

5. Ask for optional description: "Any additional details for this item? (Optional - press Enter to skip)"
   - If user provides text, format as: "Buy {itemName} - {userText}"
   - If user skips (says "skip", "no", or empty), format as: "Buy {itemName}"

6. Ask if more items needed: "Item added! Would you like to add another item?"
   - If yes, repeat from step 1
   - If no, proceed to preview

7. Show preview:
   "Purchase Request Summary:
   1. Item: {itemName}
      Category: {category}
      Quantity: {quantity} {unit}
      Description: {description}

   [... more items ...]

   Department: {department}
   Requested by: {userName}
   Email: {email}

   Ready to submit?"

8. On confirm, call create_purchase_request tool with all collected items

9. After success, show:
   "✅ Purchase request created successfully!

   PR Number: {prNumber}
   Status: Pending Approval
   Items: {count} items
   Department: {department}

   Your request has been submitted and is awaiting approval.
   You'll receive a notification when it's processed."

## State Management

To maintain state across conversation turns:
- At the start of each turn, retrieve previous state from the last message metadata
- Use state to track collected items: { collectedItems: [...] }
- After each step, save updated state in your response metadata
- When user adds items, append to collectedItems array (don't overwrite)
- When user says "done", pass ALL items from collectedItems to create_purchase_request

Example state structure:
{
  "collectedItems": [
    {"itemName": "laptop", "itemCategory": "IT Equipment", "quantity": 3, "unitOfMeasurement": "piece", "itemDescription": "Buy laptop - urgent"},
    {"itemName": "mouse", "itemCategory": "IT Equipment", "quantity": 10, "unitOfMeasurement": "piece", "itemDescription": "Buy mouse"}
  ]
}

## Input Handling

- Accept numbered options (1, 2, etc.) or full text ("Office Supplies")
- Validate quantity is a positive number
- Allow custom categories/units if user types "Other" or custom text
- Handle cancel keywords: "cancel", "stop", "nevermind", "quit"

## Available Tools

- get_purchase_requests: Get user's purchase request list
- get_purchase_orders: Get purchase order list
- get_dashboard_stats: Get dashboard statistics
- get_notifications: Get user notifications
- get_lookup_options: Get available categories or units
- create_purchase_request: Create new purchase request (MUST be called after collecting all item data)
- export_purchase_requests: Export purchase requests to CSV or JSON format

## CRITICAL: Data Presentation Format

**When get_purchase_requests tool returns data, it includes a 'markdown' field with pre-formatted output.**

You MUST use the 'markdown' field DIRECTLY in your response. Do NOT reformat, recreate, or transform it.

Example response when user asks for purchase requests:

"Here are your purchase requests, {userName}!

[Insert the 'markdown' field from tool response here - copy it EXACTLY]

Would you like me to help you with any of these requests?"

**Important:**
- Copy the markdown field EXACTLY as returned
- Do NOT try to create your own table
- Do NOT reformat the data
- Just use the markdown string directly

Please respond in friendly, professional English. Use OPTIONS: format for presenting choices.`;

class ChatBotAgent {
  constructor() {
    this.agentType = 'chatbot';
    this.tools = this.defineTools();
    this.toolHandlers = this.defineToolHandlers();
  }

  defineTools() {
    return [
      {
        name: 'get_purchase_requests',
        description: '[MUST USE] When users ask about purchase requests, purchase records, request count, or request list, call this tool to get real-time data. Do not guess - always call the tool.',
        input_schema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'User ID'
            },
            limit: {
              type: 'number',
              description: 'Limit number of results (default 10)'
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_purchase_orders',
        description: '[MUST USE] When users ask about purchase orders, order count, or order list, call this tool to get real-time data.',
        input_schema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Limit number of results (default 10)'
            },
          },
        },
      },
      {
        name: 'get_dashboard_stats',
        description: '[MUST USE] When users ask about statistics, spending, totals, or dashboard data, call this tool to get real-time statistics.',
        input_schema: {
          type: 'object',
          properties: {
            department: {
              type: 'string',
              description: 'Department name (empty for all departments)'
            },
          },
        },
      },
      {
        name: 'get_notifications',
        description: '[MUST USE] When users ask about notifications, messages, or alerts, call this tool to get user notification list.',
        input_schema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'User ID'
            },
            limit: {
              type: 'number',
              description: 'Limit number of results (default 10)'
            },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_lookup_options',
        description: 'Get available categories or units of measurement for purchase requests',
        input_schema: {
          type: 'object',
          properties: {
            kind: {
              type: 'string',
              enum: ['category', 'unit'],
              description: 'Type of options to retrieve'
            }
          },
          required: ['kind'],
        },
      },
      {
        name: 'create_purchase_request',
        description: 'Create a new purchase request with collected line items. Call this after gathering all item details from the user.',
        input_schema: {
          type: 'object',
          properties: {
            lineItems: {
              type: 'array',
              description: 'List of items to purchase',
              items: {
                type: 'object',
                properties: {
                  itemName: { type: 'string', description: 'Name of the item' },
                  itemCategory: { type: 'string', description: 'Category of the item' },
                  quantity: { type: 'number', description: 'Quantity to purchase' },
                  unitOfMeasurement: { type: 'string', description: 'Unit of measurement' },
                  itemDescription: { type: 'string', description: 'Description of the item' }
                },
                required: ['itemName', 'itemCategory', 'quantity', 'unitOfMeasurement', 'itemDescription']
              }
            }
          },
          required: ['lineItems'],
        },
      },
      {
        name: 'export_purchase_requests',
        description: '[MUST USE] When users ask to export, download, or get a file of purchase requests, call this tool to generate export data.',
        input_schema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: 'User ID'
            },
            format: {
              type: 'string',
              enum: ['csv', 'json'],
              description: 'Export format (default: csv)'
            },
            status: {
              type: 'string',
              enum: ['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
              description: 'Filter by status (default: ALL)'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of records to export (default: 100)'
            }
          },
          required: ['userId'],
        },
      },
      {
        name: 'export_data',
        description: '[MUST USE] Universal export tool for multiple data types. Call when users ask to export, download, or get files for purchase requests, purchase orders, invoices, or suppliers.',
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
              description: 'Export format'
            },
            filters: {
              type: 'object',
              description: 'Optional filters for the export',
              properties: {
                status: {
                  type: 'string',
                  enum: ['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
                  description: 'Filter by status (for purchase requests/orders)'
                },
                dateRange: {
                  type: 'string',
                  description: 'Date range filter (e.g., "last 7 days", "last 30 days")'
                },
                department: {
                  type: 'string',
                  description: 'Filter by department'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of records to export (default: 100)'
                }
              }
            }
          },
          required: ['dataType', 'format'],
        },
      },
    ];
  }

  defineToolHandlers() {
    return {
      get_purchase_requests: async (input) => {
        const { userId, limit = 10 } = input;

        const records = await prisma.purchaseRequestRecord.findMany({
          take: 100, // Get more for statistics
          orderBy: { createdAt: 'desc' },
        });

        // Filter requests belonging to the user's department
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { department: true, role: true },
        });

        let filteredRecords = records;

        if (user?.department && user.role !== 'Super Admin') {
          filteredRecords = records.filter(record => {
            const payload = record.payload;
            return payload.department === user.department;
          });
        }

        // Calculate statistics
        const statistics = {
          total: filteredRecords.length,
          pending: filteredRecords.filter(r => r.payload.status === 'PENDING').length,
          submitted: filteredRecords.filter(r => r.payload.status === 'SUBMITTED').length,
          approved: filteredRecords.filter(r => r.payload.status === 'APPROVED').length,
          rejected: filteredRecords.filter(r => r.payload.status === 'REJECTED').length,
        };

        const requests = filteredRecords.slice(0, limit).map(r => ({
          id: r.localId,
          ...r.payload,
          createdAt: r.createdAt,
        }));

        return {
          markdown: formatPurchaseRequestsAsMarkdown(requests, filteredRecords.length, statistics),
          total: filteredRecords.length,
          statistics,
          requests,
        };
      },

      get_purchase_orders: async (input) => {
        const { limit = 10 } = input;

        const records = await prisma.purchaseOrderRecord.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        return {
          total: records.length,
          orders: records.map(r => ({
            id: r.localId,
            ...r.payload,
            createdAt: r.createdAt,
          })),
        };
      },

      get_dashboard_stats: async (input) => {
        const { department } = input;

        // Get purchase requests
        const requestRecords = await prisma.purchaseRequestRecord.findMany();
        const orderRecords = await prisma.purchaseOrderRecord.findMany();

        let filteredRequests = requestRecords;
        let filteredOrders = orderRecords;

        if (department) {
          filteredRequests = requestRecords.filter(r => r.payload.department === department);
          filteredOrders = orderRecords.filter(r => r.payload.department === department);
        }

        // Calculate statistics
        const totalRequests = filteredRequests.length;
        const totalOrders = filteredOrders.length;

        // Calculate spending
        let totalSpending = 0;
        filteredOrders.forEach(order => {
          if (order.payload.items && Array.isArray(order.payload.items)) {
            order.payload.items.forEach(item => {
              const amount = parseFloat(item.totalPrice || 0);
              if (!isNaN(amount)) {
                totalSpending += amount;
              }
            });
          }
        });

        // Pending approvals count
        const pendingApprovals = filteredRequests.filter(r => r.payload.status === 'pending').length;

        return {
          department: department || 'All Departments',
          totalRequests,
          totalOrders,
          totalSpending: totalSpending.toFixed(2),
          pendingApprovals,
        };
      },

      get_notifications: async (input) => {
        const { userId, limit = 10 } = input;

        const notifications = await prisma.notification.findMany({
          where: { userId },
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        return {
          total: notifications.length,
          unreadCount: notifications.filter(n => !n.isRead).length,
          notifications: notifications.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            isRead: n.isRead,
            createdAt: n.createdAt,
          })),
        };
      },

      get_lookup_options: async (input) => {
        const { kind } = input;

        // Get database options
        const dbOptions = await prisma.purchasingLookup.findMany({
          where: { kind },
          select: { value: true },
        });

        // Get common options based on kind
        const commonOptions = kind === 'category' ? COMMON_CATEGORIES : COMMON_UNITS;

        // Merge and deduplicate
        const allOptions = [
          ...commonOptions,
          ...dbOptions.map(opt => opt.value)
        ];

        const uniqueOptions = [...new Set(allOptions)];

        return {
          kind,
          options: uniqueOptions,
        };
      },

      create_purchase_request: async (input) => {
        const { lineItems, userId } = input;

        // Validate lineItems
        if (!lineItems || lineItems.length === 0) {
          return { success: false, error: 'At least one item required' };
        }

        // Get user info
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true, department: true },
        });

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        // Generate IDs
        const localId = uuidv4();
        const prNumber = generatePRNumber();
        const today = new Date().toISOString().split('T')[0];

        // Build line items with tempIds
        const formattedLineItems = lineItems.map(item => ({
          tempId: uuidv4(),
          itemName: item.itemName,
          itemCategory: item.itemCategory,
          quantity: item.quantity,
          unitOfMeasurement: item.unitOfMeasurement,
          itemDescription: item.itemDescription,
          unitPrice: 0,
          supplierId: null,
          supplierName: null,
          supplierEmail: null,
        }));

        // Build payload
        const payload = {
          localId,
          status: 'PENDING',
          prNumber,
          requestBy: user.name || 'Unknown',
          department: user.department || 'Unknown',
          requestDate: today,
          createdByEmail: user.email,
          createdByUserId: userId,
          currency: 'MYR',
          lineItems: formattedLineItems,
        };

        // Save to database
        try {
          await prisma.purchaseRequestRecord.create({
            data: {
              localId,
              payload,
            },
          });
        } catch (error) {
          return { success: false, error: 'Failed to create purchase request' };
        }

        return {
          success: true,
          prNumber,
          status: 'PENDING',
          itemCount: lineItems.length,
          department: user.department,
        };
      },

      export_purchase_requests: async (input) => {
        const { userId, format = 'csv', status = 'ALL', limit = 100 } = input;

        // Get user info
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { department: true, role: true },
        });

        if (!user) {
          return { success: false, error: 'User not found' };
        }

        // Fetch purchase requests
        const records = await prisma.purchaseRequestRecord.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        // Filter by department (unless Super Admin)
        let filteredRecords = records;
        if (user.department && user.role !== 'Super Admin') {
          filteredRecords = records.filter(r => r.payload.department === user.department);
        }

        // Filter by status
        if (status !== 'ALL') {
          filteredRecords = filteredRecords.filter(r => r.payload.status === status);
        }

        if (filteredRecords.length === 0) {
          return {
            success: false,
            error: 'No purchase requests found to export',
            message: 'There are no purchase requests matching your criteria.',
          };
        }

        // Map to export format
        const requestsForExport = filteredRecords.map(r => ({
          prNumber: r.payload.prNumber,
          status: r.payload.status,
          department: r.payload.department,
          requestBy: r.payload.requestBy,
          requestDate: r.payload.requestDate,
          createdByEmail: r.payload.createdByEmail,
          currency: r.payload.currency,
          urgency: r.payload.urgency || 'normal',
          procurementNotes: r.payload.procurementNotes || '',
          lineItems: r.payload.lineItems || [],
        }));

        // Generate export data
        let exportData, mimeType;
        try {
          if (format === 'json') {
            exportData = exportPurchaseRequestsToJSON(requestsForExport);
            mimeType = 'application/json';
          } else {
            exportData = exportPurchaseRequestsToCSV(requestsForExport);
            mimeType = 'text/csv';
          }
        } catch (error) {
          return {
            success: false,
            error: 'Failed to generate export file',
            message: error.message,
          };
        }

        return {
          success: true,
          format,
          recordCount: filteredRecords.length,
          department: user.department || 'All',
          status,
          data: exportData,
          mimeType,
          message: `Successfully prepared ${filteredRecords.length} purchase request(s) for export`,
        };
      },

      export_data: async (input) => {
        const { dataType, format, filters = {}, userId } = input;

        // Get user info
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true, department: true },
        });

        if (!user) {
          return {
            success: false,
            error: '❌ User information not found',
            message: 'Could not verify user permissions. Please log in again.',
          };
        }

        // Call the export handler
        const result = await handleExport({
          dataType,
          format,
          filters,
          userId,
          userRole: user.role,
          userDepartment: user.department,
        });

        // Format response with Chinese and emojis
        if (result.success) {
          const formatEmoji = {
            pdf: '📄',
            excel: '📊',
            csv: '📋',
            json: '📦',
          }[format] || '📁';

          const dataTypeLabel = {
            'purchase-requests': 'Purchase Requests',
            'purchase-orders': 'Purchase Orders',
            'invoices': 'Invoices',
            'suppliers': 'Suppliers',
          }[dataType] || dataType;

          return {
            success: true,
            message: `✅ ${dataTypeLabel} data exported successfully!\n\n${formatEmoji} Format: ${format.toUpperCase()}\n📦 Record count: ${result.recordCount || 'Unknown'}\n📂 Filename: ${result.filename}\n🔗 Download link: ${result.downloadUrl}\n⏰ Generated at: ${new Date(result.timestamp).toLocaleString('en-US')}`,
            filename: result.filename,
            downloadUrl: result.downloadUrl,
            recordCount: result.recordCount,
            format: result.format,
            timestamp: result.timestamp,
          };
        } else {
          // Format error messages in Chinese
          const errorMessages = {
            'INVALID_DATA_TYPE': '❌ Invalid data type',
            'INVALID_FORMAT': '❌ Invalid export format',
            'MISSING_AUTH': '❌ Missing authentication',
            'CONNECTION_REFUSED': '❌ Unable to connect to export service',
            'TIMEOUT': '⏰ Export timed out',
            'PERMISSION_DENIED': '🚫 Insufficient permissions',
            'NO_DATA': '📭 No data found',
            'BAD_REQUEST': '❌ Invalid request parameters',
            'SERVER_ERROR': '🔧 Server error',
          };

          const errorTitle = errorMessages[result.error] || '❌ Export failed';

          return {
            success: false,
            error: errorTitle,
            message: `${errorTitle}\n\n${result.message}`,
          };
        }
      },
    };
  }

  buildSystemPrompt(user) {
    return CHATBOT_SYSTEM_PROMPT
      .replace('{userName}', user.name || 'User')
      .replace('{userRole}', user.role || 'Employee')
      .replace('{userDepartment}', user.department || 'Not set');
  }

  async chat({ userId, message, sessionId, attachmentData }) {
    // 1. Load user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, department: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // 2. Ensure session exists
    await this.ensureSession(sessionId, userId);

    const guidedResponse = await this.handlePurchaseRequestFlow({
      userId,
      user,
      sessionId,
      message,
    });

    if (guidedResponse) {
      return guidedResponse;
    }

    // 3. Analyze image attachments (if any) - complete analysis before the AI response
    let imageAnalysisText = '';
    if (attachmentData && attachmentData.length > 0) {
      const imageAttachments = attachmentData.filter(att =>
        visionService.isImageFile(att.mimeType, att.fileName)
      );

      if (imageAttachments.length > 0 && visionService.isEnabled()) {
        console.log(`🔍 Analyzing ${imageAttachments.length} image(s) before AI response`);

        const analysisResults = [];
        for (const attachment of imageAttachments) {
          try {
            const result = await visionService.analyzeImage(attachment.fileUrl, attachment.fileName);
            if (result.success) {
              analysisResults.push({
                fileName: attachment.fileName,
                analysis: result.analysis,
              });
              console.log(`✅ Image analysis complete for: ${attachment.fileName}`);
            }
          } catch (error) {
            console.error(`❌ Error analyzing ${attachment.fileName}:`, error.message);
          }
        }

        // Build image analysis text
        if (analysisResults.length > 0) {
          imageAnalysisText = '\n\n[Image Analysis]\n' + analysisResults.map(r =>
            `📷 ${r.fileName}:\n${r.analysis}`
          ).join('\n\n');
        }
      }
    }

    // 4. Load session history
    const history = await this.loadSessionHistory(sessionId);

    // 5. Build system prompt
    const sourceContext = await this.loadRelevantSourceContext(userId, sessionId, message);
    const systemPrompt = `${this.buildSystemPrompt(user)}${sourceContext}`;

    // 6. Build messages array (inject userId into tool calls, and include image analysis results)
    const userMessage = message + imageAnalysisText;
    const messages = [
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // 7. Call DeepSeek API (with tool calling)
    const response = await deepseekService.chatWithTools({
      agentType: this.agentType,
      systemPrompt,
      messages,
      availableTools: this.tools,
      toolHandlers: this.enrichToolHandlers(userId),
    });

    // 8. Save conversation history (with attachments)
    await this.saveMessage(sessionId, 'user', message, null, attachmentData);
    await this.generateSessionTitle(sessionId, message);

    // Save image analysis results to the database (async, for later queries)
    if (attachmentData && attachmentData.length > 0) {
      this.saveImageAnalysisToDatabase(sessionId, attachmentData).catch(error => {
        console.error('⚠️ Failed to save image analysis to database:', error.message);
      });
    }

    if (response.success) {
      await this.saveMessage(sessionId, 'assistant', response.content);
    }

    return response;
  }

  enrichToolHandlers(userId) {
    // Inject userId into the tools
    const enriched = {};
    for (const [name, handler] of Object.entries(this.toolHandlers)) {
      enriched[name] = (input) => handler({ ...input, userId });
    }
    return enriched;
  }

  async chatStream({ userId, message, sessionId }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, department: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.ensureSession(sessionId, userId);
    const history = await this.loadSessionHistory(sessionId);
    const sourceContext = await this.loadRelevantSourceContext(userId, sessionId, message);
    const systemPrompt = `${this.buildSystemPrompt(user)}${sourceContext}`;

    // Save user message
    await this.saveMessage(sessionId, 'user', message);
    await this.generateSessionTitle(sessionId, message);

    return deepseekService.chatStream({
      agentType: this.agentType,
      systemPrompt,
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
    });
  }

  async ensureSession(sessionId, userId) {
    const exists = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!exists) {
      await prisma.chatSession.create({
        data: {
          id: sessionId,
          userId,
          title: 'New Conversation',
          updatedAt: new Date(),
        },
      });
    }
  }

  async loadSessionHistory(sessionId, limit = 20) {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  async saveMessage(sessionId, role, content, metadata = null, attachmentData = null) {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content: contentStr,
        metadata: metadata ? metadata : undefined,
      },
    });

    // Create attachment records if attachmentData provided
    if (attachmentData && Array.isArray(attachmentData) && attachmentData.length > 0) {
      const attachmentRecords = attachmentData.map((att) => ({
        messageId: message.id,
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        thumbnailUrl: att.thumbnailUrl || null,
        fileSize: att.fileSize,
        fileType: att.fileType,
        mimeType: att.mimeType,
      }));

      await prisma.messageAttachment.createMany({
        data: attachmentRecords,
      });

      console.log(`📎 Created ${attachmentRecords.length} attachment record(s) for message ${message.id}`);
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /**
   * Save image analysis results to database (runs asynchronously)
   * This is for historical record-keeping, separate from the real-time analysis
   */
  async saveImageAnalysisToDatabase(sessionId, attachmentData) {
    if (!visionService.isEnabled()) {
      return;
    }

    // Find the most recent user message with attachments
    const message = await prisma.chatMessage.findFirst({
      where: {
        sessionId,
        role: 'user',
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    if (!message) {
      return;
    }

    // Filter for image attachments
    const imageAttachments = attachmentData.filter(att =>
      visionService.isImageFile(att.mimeType, att.fileName)
    );

    if (imageAttachments.length === 0) {
      return;
    }

    console.log(`💾 Saving image analysis to database for ${imageAttachments.length} image(s)`);

    // Update each attachment record with analysis
    for (const attachment of imageAttachments) {
      try {
        const result = await visionService.analyzeImage(attachment.fileUrl, attachment.fileName);

        if (result.success) {
          await prisma.messageAttachment.updateMany({
            where: {
              messageId: message.id,
              fileName: attachment.fileName,
              fileUrl: attachment.fileUrl,
            },
            data: {
              aiAnalysis: result.analysis,
            },
          });

          console.log(`✅ Saved analysis for: ${attachment.fileName}`);
        }
      } catch (error) {
        console.error(`❌ Error saving analysis for ${attachment.fileName}:`, error.message);
      }
    }
  }

  async getLastMessageMetadata(sessionId) {
    const lastMessage = await prisma.chatMessage.findFirst({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      select: { metadata: true },
    });

    return lastMessage?.metadata || null;
  }

  async handlePurchaseRequestFlow({ userId, user, sessionId, message }) {
    const rawText = String(message || '').trim();
    const normalized = rawText.toLowerCase();
    const previousState = await this.getLastPurchaseFlowState(sessionId);
    const active = previousState?.flow === 'purchase_request';

    if (!active && !this.isCreatePurchaseRequestIntent(normalized)) {
      return null;
    }

    let state = active
      ? previousState
      : {
          flow: 'purchase_request',
          step: 'itemName',
          currentItem: {},
          collectedItems: [],
          startedAt: new Date().toISOString(),
        };

    if (this.matchesAny(normalized, CANCEL_WORDS)) {
      const response = 'Purchase request creation cancelled. Your draft has not been saved.';
      await this.saveGuidedTurn(sessionId, rawText, response, null);
      return { success: true, content: response, usage: null };
    }

    let response;

    if (!active) {
      response = "I'll help you create a purchase request. What item do you need to purchase?";
      await this.saveGuidedTurn(sessionId, rawText, response, state);
      return { success: true, content: response, usage: null };
    }

    switch (state.step) {
      case 'itemName': {
        if (!rawText) {
          response = 'Item name is required. What item do you need to purchase?';
          break;
        }
        state.currentItem = { itemName: rawText };
        state.step = 'category';
        response = this.formatOptions('Which category does this item belong to?', COMMON_CATEGORIES);
        break;
      }

      case 'category': {
        const category = this.resolveOption(rawText, COMMON_CATEGORIES);
        if (!category) {
          response = this.formatOptions('Please choose a category, or type your own category.', COMMON_CATEGORIES);
          break;
        }
        if (category === 'Other (type your own)') {
          state.step = 'customCategory';
          response = 'Please type the custom category for this item.';
          break;
        }
        state.currentItem.itemCategory = category;
        state.step = 'quantity';
        response = 'How many units do you need?';
        break;
      }

      case 'customCategory': {
        if (!rawText) {
          response = 'Please type the custom category for this item.';
          break;
        }
        state.currentItem.itemCategory = rawText;
        state.step = 'quantity';
        response = 'How many units do you need?';
        break;
      }

      case 'quantity': {
        const quantity = this.parsePositiveNumber(rawText);
        if (!quantity) {
          response = 'Please enter a valid positive number for quantity.';
          break;
        }
        state.currentItem.quantity = quantity;
        state.step = 'unit';
        response = this.formatOptions("What's the unit of measurement?", COMMON_UNITS);
        break;
      }

      case 'unit': {
        const unit = this.resolveOption(rawText, COMMON_UNITS);
        if (!unit) {
          response = this.formatOptions('Please choose a unit, or type your own unit.', COMMON_UNITS);
          break;
        }
        if (unit === 'Other (type your own)') {
          state.step = 'customUnit';
          response = 'Please type the custom unit of measurement.';
          break;
        }
        state.currentItem.unitOfMeasurement = unit;
        state.step = 'description';
        response = 'Any additional details for this item? Type "skip" if there is nothing to add.';
        break;
      }

      case 'customUnit': {
        if (!rawText) {
          response = 'Please type the custom unit of measurement.';
          break;
        }
        state.currentItem.unitOfMeasurement = rawText;
        state.step = 'description';
        response = 'Any additional details for this item? Type "skip" if there is nothing to add.';
        break;
      }

      case 'description': {
        const itemName = state.currentItem.itemName;
        state.currentItem.itemDescription = this.matchesAny(normalized, SKIP_WORDS)
          ? `Buy ${itemName}`
          : `Buy ${itemName} - ${rawText}`;
        state.collectedItems = [...(state.collectedItems || []), state.currentItem];
        state.currentItem = {};
        state.step = 'addMore';
        response = this.formatOptions('Item added. Would you like to add another item?', [
          'Add another item',
          'Done, create request',
        ], false);
        break;
      }

      case 'addMore': {
        if (this.matchesAny(normalized, YES_WORDS) || normalized === '1') {
          state.step = 'itemName';
          state.currentItem = {};
          response = 'What item do you need to purchase next?';
          break;
        }
        if (this.matchesAny(normalized, DONE_WORDS) || normalized === '2') {
          state.step = 'preview';
          response = `${this.formatPurchaseRequestPreview(state, user)}\n\n${this.formatOptions('Ready to submit?', ['Submit', 'Cancel', 'Edit from start'], false)}`;
          break;
        }
        response = this.formatOptions('Please choose what to do next.', [
          'Add another item',
          'Done, create request',
        ], false);
        break;
      }

      case 'preview': {
        if (normalized === 'edit' || normalized === '3') {
          state.step = 'itemName';
          state.currentItem = {};
          state.collectedItems = [];
          response = 'No problem. Let us start again. What item do you need to purchase?';
          break;
        }
        if (normalized === 'submit' || normalized === '1' || normalized === 'yes') {
          const result = await this.toolHandlers.create_purchase_request({ lineItems: state.collectedItems, userId });
          if (!result.success) {
            response = `Sorry, I could not save your request right now. ${result.error || 'Please try again later.'}`;
            break;
          }
          response = [
            'Purchase request created successfully!',
            '',
            `PR Number: ${result.prNumber}`,
            `Status: ${result.status}`,
            `Items: ${result.itemCount}`,
            `Department: ${result.department || user.department || 'Not set'}`,
            '',
            'Your request has been submitted and is awaiting approval.',
          ].join('\n');
          await this.saveGuidedTurn(sessionId, rawText, response, null);
          return { success: true, content: response, usage: null };
        }
        response = this.formatOptions('Ready to submit?', ['Submit', 'Cancel', 'Edit from start'], false);
        break;
      }

      default:
        state.step = 'itemName';
        response = 'Let us continue creating your purchase request. What item do you need to purchase?';
    }

    state.updatedAt = new Date().toISOString();
    await this.saveGuidedTurn(sessionId, rawText, response, state);
    return { success: true, content: response, usage: null };
  }

  async saveGuidedTurn(sessionId, userMessage, assistantMessage, state) {
    await this.saveMessage(sessionId, 'user', userMessage);
    await this.generateSessionTitle(sessionId, userMessage);
    await this.saveMessage(
      sessionId,
      'assistant',
      assistantMessage,
      state ? { purchaseRequestFlow: state } : { purchaseRequestFlow: null }
    );
  }

  async getLastPurchaseFlowState(sessionId) {
    const metadata = await this.getLastMessageMetadata(sessionId);
    return metadata?.purchaseRequestFlow || null;
  }

  isCreatePurchaseRequestIntent(normalized) {
    return CREATE_PR_INTENTS.some(intent => normalized.includes(intent));
  }

  matchesAny(normalized, words) {
    return words.some(word => normalized === word || normalized.includes(word));
  }

  resolveOption(input, options) {
    const normalized = input.trim().toLowerCase();
    const withOther = [...options, 'Other (type your own)'];
    const numericChoice = Number(normalized);

    if (Number.isInteger(numericChoice) && numericChoice >= 1 && numericChoice <= withOther.length) {
      return withOther[numericChoice - 1];
    }

    if (normalized === 'other') {
      return 'Other (type your own)';
    }

    return withOther.find(option => option.toLowerCase() === normalized)
      || options.find(option => option.toLowerCase().includes(normalized) || normalized.includes(option.toLowerCase()))
      || input.trim();
  }

  parsePositiveNumber(input) {
    const match = String(input).match(/\d+(\.\d+)?/);
    if (!match) return null;
    const value = Number(match[0]);
    return value > 0 ? value : null;
  }

  formatOptions(question, options, includeOther = true) {
    const visibleOptions = includeOther ? [...options, 'Other (type your own)'] : options;
    return `${question}\n\nOPTIONS:\n${visibleOptions.map(option => `- ${option}`).join('\n')}`;
  }

  formatPurchaseRequestPreview(state, user) {
    const itemLines = (state.collectedItems || []).map((item, index) => [
      `${index + 1}. Item: ${item.itemName}`,
      `   Category: ${item.itemCategory}`,
      `   Quantity: ${item.quantity} ${item.unitOfMeasurement}`,
      `   Description: ${item.itemDescription}`,
    ].join('\n')).join('\n\n');

    return [
      'Purchase Request Summary:',
      itemLines,
      '',
      `Department: ${user.department || 'Not set'}`,
      `Requested by: ${user.name || 'User'}`,
      `Email: ${user.email || 'Not set'}`,
    ].join('\n');
  }

  async loadRelevantSourceContext(userId, sessionId, message) {
    const queryTerms = this.extractQueryTerms(message);
    if (queryTerms.length === 0) return '';

    const chunks = await prisma.sourceChunk.findMany({
      where: {
        sources: {
          userId,
          OR: [
            { sessionId: null },
            { sessionId },
          ],
        },
      },
      include: {
        sources: {
          select: { fileName: true },
        },
      },
      take: 200,
    });

    const scored = chunks
      .map(chunk => ({
        chunk,
        score: this.scoreChunk(chunk.content, queryTerms),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (scored.length === 0) return '';

    const context = scored.map(({ chunk }, index) => (
      `[Source ${index + 1}: ${chunk.sources.fileName}]\n${chunk.content.slice(0, 1200)}`
    )).join('\n\n');

    return `\n\n## Uploaded Training Sources\nUse these user-uploaded source excerpts when they are relevant. If the sources do not answer the question, say so and use general system knowledge.\n\n${context}`;
  }

  extractQueryTerms(message) {
    return String(message || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length >= 3)
      .slice(0, 20);
  }

  scoreChunk(content, queryTerms) {
    const text = String(content || '').toLowerCase();
    return queryTerms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
  }

  async getUserSessions(userId, limit = 100) {
    const sessions = await prisma.chatSession.findMany({
      // Sessions are only conversation history after at least one message was saved.
      // This prevents abandoned New Chat drafts from appearing in the history list.
      where: {
        userId,
        chat_messages: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { chat_messages: true },
        },
      },
    });

    await this.generateMissingTitles(sessions);

    const refreshedSessions = await prisma.chatSession.findMany({
      where: {
        userId,
        chat_messages: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { chat_messages: true },
        },
      },
    });

    return refreshedSessions.map(({ _count, ...session }) => ({
      ...session,
      _count: { messages: _count.chat_messages },
    }));
  }

  async generateSessionTitle(sessionId, message) {
    try {
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { title: true },
      });

      if (!session || !titleGenerator.shouldGenerateTitle(session.title)) {
        return;
      }

      const title = await titleGenerator.generateTitle(String(message || ''));

      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
      });
    } catch (error) {
      console.warn(`Title generation failed for session ${sessionId}:`, error.message);
    }
  }

  async generateMissingTitles(sessions) {
    const sessionsToTitle = sessions
      .filter((session) => titleGenerator.shouldGenerateTitle(session.title) && session._count?.chat_messages > 0)
      .slice(0, 10);

    await Promise.all(sessionsToTitle.map(async (session) => {
      const firstUserMessage = await prisma.chatMessage.findFirst({
        where: {
          sessionId: session.id,
          role: 'user',
        },
        orderBy: { createdAt: 'asc' },
        select: { content: true },
      });

      if (firstUserMessage?.content) {
        await this.generateSessionTitle(session.id, firstUserMessage.content);
      }
    }));
  }

  async deleteSession(sessionId) {
    return await prisma.$transaction(async (tx) => {
      const session = await tx.chatSession.findUnique({
        where: { id: sessionId },
        select: { id: true },
      });

      if (!session) {
        return false;
      }

      const messages = await tx.chatMessage.findMany({
        where: { sessionId },
        select: { id: true },
      });
      const messageIds = messages.map((message) => message.id);

      if (messageIds.length > 0) {
        await tx.messageAttachment.deleteMany({
          where: { messageId: { in: messageIds } },
        });
      }

      const sources = await tx.source.findMany({
        where: { sessionId },
        select: { id: true },
      });
      const sourceIds = sources.map((source) => source.id);

      if (sourceIds.length > 0) {
        await tx.sourceChunk.deleteMany({
          where: { sourceId: { in: sourceIds } },
        });
      }

      await tx.source.deleteMany({
        where: { sessionId },
      });

      await tx.chatMessage.deleteMany({
        where: { sessionId },
      });

      await tx.chatSession.delete({
        where: { id: sessionId },
      });

      return true;
    });
  }

  async deleteAllUserSessions(userId) {
    return await prisma.$transaction(async (tx) => {
      const sessions = await tx.chatSession.findMany({
        where: { userId },
        select: { id: true },
      });
      const sessionIds = sessions.map((session) => session.id);

      if (sessionIds.length === 0) {
        return 0;
      }

      const messages = await tx.chatMessage.findMany({
        where: { sessionId: { in: sessionIds } },
        select: { id: true },
      });
      const messageIds = messages.map((message) => message.id);

      if (messageIds.length > 0) {
        await tx.messageAttachment.deleteMany({
          where: { messageId: { in: messageIds } },
        });
      }

      const sources = await tx.source.findMany({
        where: { sessionId: { in: sessionIds } },
        select: { id: true },
      });
      const sourceIds = sources.map((source) => source.id);

      if (sourceIds.length > 0) {
        await tx.sourceChunk.deleteMany({
          where: { sourceId: { in: sourceIds } },
        });
      }

      await tx.source.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      await tx.chatMessage.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      const result = await tx.chatSession.deleteMany({
        where: { id: { in: sessionIds } },
      });

      return result.count;
    });
  }
}

export default new ChatBotAgent();
