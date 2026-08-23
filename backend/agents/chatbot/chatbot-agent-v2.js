import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { generatePRNumber } from '../../utils/pr-number-generator.js';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../services/simple-logger.js';

const EXPORTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../exports');

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

/**
 * Performance profiles for dynamic resource allocation
 * Simple queries use fewer tokens, complex tasks use more
 */
const PERFORMANCE_PROFILES = {
  simple: { maxTokens: 1024, temperature: 0.7 },   // Greetings, simple lookups
  medium: { maxTokens: 2048, temperature: 0.9 },   // Single table queries, basic lists
  complex: { maxTokens: 4096, temperature: 1.0 },  // Multi-table queries, analysis
  advanced: { maxTokens: 8192, temperature: 1.0 }  // Report generation, comprehensive tasks
};

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
      return `${item.itemName || 'Item'} (${item.quantity || 0} ${item.unitOfMeasurement || 'pcs'})`;
    }
    const firstItem = items[0].itemName.substring(0, 15);
    return `${firstItem}... (${items.length} items)`;
  };

  // Build summary cards
  let output = '**Purchase Request Summary:**\n\n';
  output += '```\n';
  output += '╔═════════════╦═════════════╦═════════════╦═════════════╗\n';
  output += '║  Total PR   ║   Pending   ║  Submitted  ║  Approved   ║\n';
  output += `║     ${String(statistics?.total || total).padStart(2, ' ')}      ║      ${String(statistics?.pending || 0).padStart(2, ' ')}     ║      ${String(statistics?.submitted || 0).padStart(2, ' ')}     ║      ${String(statistics?.approved || 0).padStart(2, ' ')}     ║\n`;
  output += '╚═════════════╩═════════════╩═════════════╩═════════════╝\n';
  output += '```\n\n';

  // Build table
  output += '**Recent Purchase Requests:**\n\n';
  output += '```\n';
  output += '┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┓\n';
  output += '┃   PR Number   ┃  Status   ┃         Items          ┃    Date     ┃\n';
  output += '┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━┫\n';

  requests.slice(0, 10).forEach((req) => {
    const status = req.status || 'PENDING';
    const emoji = statusEmoji[status] || '❓';
    const prNum = (req.prNumber || 'N/A').padEnd(13, ' ');
    const statusText = `${emoji} ${status}`.padEnd(9, ' ');
    const items = formatItems(req.items).padEnd(22, ' ').substring(0, 22);
    const date = formatDate(req.createdAt).padEnd(11, ' ');

    output += `┃ ${prNum} ┃ ${statusText} ┃ ${items} ┃ ${date} ┃\n`;
  });

  output += '┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━┛\n';
  output += '```\n';

  return output;
}

/**
 * Format purchase orders as Markdown table
 */
function formatPurchaseOrdersAsMarkdown(orders, total) {
  if (!orders || orders.length === 0) {
    return "There are no purchase orders yet.";
  }

  const statusEmoji = {
    'PENDING': '⏳',
    'APPROVED': '✅',
    'REJECTED': '❌',
    'COMPLETED': '✅'
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let markdown = `There are **${total} purchase order${total > 1 ? 's' : ''}** in total:\n\n`;
  markdown += '| # | PO Number | Date | Status | Supplier | Amount |\n';
  markdown += '|---|-----------|------|--------|----------|--------|\n';

  orders.forEach((order, idx) => {
    const status = order.status || 'PENDING';
    const emoji = statusEmoji[status] || '❓';
    const amount = order.totalAmount ? `RM ${order.totalAmount}` : 'N/A';

    markdown += `| ${idx + 1} | ${order.poNumber || 'N/A'} | ${formatDate(order.createdAt)} | ${emoji} ${status} | ${order.supplierName || 'N/A'} | ${amount} |\n`;
  });

  return markdown;
}

const CHATBOT_SYSTEM_PROMPT = `You are the General AI Assistant for OptiMind ERP system - a super-intelligent assistant like ChatGPT.

YOUR CAPABILITIES:
- Access ALL company data (purchases, budgets, suppliers, approvals, invoices, documents, etc.)
- Generate reports, exports, and documents autonomously
- Perform complex data analysis and provide insights
- Answer any work-related questions
- Help with decision-making and planning
- Guide users through system operations

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

DATA ACCESS:
- You have tools to query any database table
- You can search, filter, aggregate, and analyze data across all tables
- Always verify data before making claims
- Use query_database for accessing any table
- Use aggregate_data for calculations (sum, count, average, etc.)

FILE GENERATION & EXPORT:
- When users need exports or reports, YOU CREATE THEM autonomously
- Always ask user: "Would you like this as Excel, PDF, or CSV?"
- Generate the file using export_data tool and provide a download link
- You can create: data exports, analytical reports, summaries, custom documents
- Supported formats: Excel (.xlsx), PDF, CSV, JSON

YOUR COMMUNICATION STYLE:
- Friendly and conversational, but professional
- Clear and concise explanations
- Use emojis sparingly (✅ ❌ 📊 💡 🎯)
- Be proactive - suggest helpful actions
- For complex tasks, break them into steps

WORK STYLE:
- Be autonomous - don't ask for permission to query data or create files
- When user asks for data, fetch it immediately
- When user wants to export something, ask format preference then generate it
- Provide actionable insights, not just raw data
- Explain your reasoning when making suggestions

## DATA PRESENTATION FORMAT

**CRITICAL: When tools return a 'markdown' field, use it DIRECTLY in your response. Do NOT reformat or transform it.**

Example response when user asks for purchase requests:

"Here are your purchase requests, {userName}!

[Insert the 'markdown' field from tool response here]

Would you like me to export this data for you?"

**Important:**
- Copy the markdown field EXACTLY as returned
- Do NOT try to create your own table
- Just use the markdown string directly

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

7. Show preview and confirm

8. On confirm, call create_purchase_request tool with all collected items

## Available Tools

**Data Query Tools:**
- query_database: Query any database table with filters, sorting, pagination
- aggregate_data: Perform aggregations (sum, count, average, min, max)
- get_purchase_requests: Get purchase request list (legacy)
- get_purchase_orders: Get purchase order list (legacy)
- get_dashboard_stats: Get dashboard statistics
- get_notifications: Get user notifications

**Export & Report Tools:**
- export_data: Export any data to Excel, PDF, CSV, or JSON
- generate_report: Create comprehensive analytical reports

**Creation Tools:**
- get_lookup_options: Get available categories or units
- create_purchase_request: Create new purchase request

Remember: You are a SUPER-INTELLIGENT ASSISTANT. Be proactive, autonomous, and helpful. Users rely on you to handle complex tasks efficiently.`;


/**
 * ChatBot Agent - General Assistant
 *
 * Super-intelligent general AI assistant that handles system usage questions,
 * data queries, exports, reports, and comprehensive assistance
 */
class ChatBotAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'chatbot',
      name: 'General Assistant',
      description: 'Super-intelligent AI assistant for comprehensive ERP system help',
      personality: 'Intelligent, proactive, and autonomous',
      expertise: 'Universal data access, report generation, analysis, and system operations',
      systemPromptTemplate: CHATBOT_SYSTEM_PROMPT,
      tools: ChatBotAgent.defineTools(),
      toolHandlers: ChatBotAgent.defineToolHandlers(),
    });
  }

  /**
   * Detect task complexity based on message content
   * Returns: 'simple', 'medium', 'complex', or 'advanced'
   */
  detectComplexity(message) {
    const lowerMessage = message.toLowerCase();

    // Advanced indicators: report generation, comprehensive analysis
    if (lowerMessage.includes('generate report') ||
        lowerMessage.includes('comprehensive analysis') ||
        lowerMessage.includes('detailed report') ||
        (lowerMessage.includes('compare') && lowerMessage.includes('trend')) ||
        lowerMessage.includes('create report')) {
      return 'advanced';
    }

    // Complex indicators: analysis, exports, calculations
    if (lowerMessage.includes('analyze') ||
        lowerMessage.includes('analysis') ||
        lowerMessage.includes('export') ||
        lowerMessage.includes('download') ||
        lowerMessage.includes('calculate') ||
        lowerMessage.includes('summary') ||
        lowerMessage.includes('insight') ||
        lowerMessage.includes('aggregate') ||
        lowerMessage.includes('total spending') ||
        lowerMessage.includes('comparison')) {
      return 'complex';
    }

    // Medium indicators: queries, listings, searches
    if (lowerMessage.includes('show me') ||
        lowerMessage.includes('list') ||
        lowerMessage.includes('find') ||
        lowerMessage.includes('search') ||
        lowerMessage.includes('get') ||
        lowerMessage.includes('query') ||
        lowerMessage.includes('how many')) {
      return 'medium';
    }

    // Simple (default): greetings, navigation, simple questions
    return 'simple';
  }

  /**
   * Override chat method to add dynamic performance allocation
   */
  async chat({ userId, message, sessionId, systemPromptAddition = '' }) {
    // Detect task complexity
    const complexity = this.detectComplexity(message);
    const profile = PERFORMANCE_PROFILES[complexity];

    logger.debug('ChatbotAgent', `Task complexity: ${complexity}`, {
      maxTokens: profile.maxTokens,
      temperature: profile.temperature,
      messagePreview: message.substring(0, 50)
    });

    // Call parent with dynamic performance settings
    return super.chat({
      userId,
      message,
      sessionId,
      systemPromptAddition,
      maxTokens: profile.maxTokens,
      temperature: profile.temperature
    });
  }

  /**
   * Define the tools available to the ChatBot
   */
  static defineTools() {
    return [
      {
        name: 'get_purchase_requests',
        description: '[MUST USE] When users ask about purchase requests, purchase records, request count, or request list, call this tool to get real-time data.',
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
        name: 'query_database',
        description: 'Query any database table with filters, sorting, and pagination. Use this to retrieve specific data from any table.',
        input_schema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              enum: ['user', 'department', 'supplier', 'purchaseRequestRecord', 'purchaseOrderRecord',
                     'goodsReceivedNoteRecord', 'invoiceRecord', 'paymentRecord', 'budgetAllocation',
                     'budgetPrediction', 'approvalWorkflow', 'documentRecord', 'notification', 'chatSession', 'chatMessage'],
              description: 'Database table to query'
            },
            filters: {
              type: 'object',
              description: 'Prisma where clause filters (e.g., {status: "PENDING"}). Leave empty for no filters.'
            },
            include: {
              type: 'object',
              description: 'Prisma relations to include (e.g., {requester: true}). Leave empty for no relations.'
            },
            orderBy: {
              type: 'object',
              description: 'Sorting (e.g., {createdAt: "desc"})'
            },
            take: {
              type: 'number',
              description: 'Limit results (default 50, max 500)'
            },
            skip: {
              type: 'number',
              description: 'Skip results for pagination (default 0)'
            }
          },
          required: ['table']
        }
      },
      {
        name: 'aggregate_data',
        description: 'Perform aggregations on data (sum, count, average, min, max). Use this for calculations and statistics.',
        input_schema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              enum: ['user', 'department', 'supplier', 'purchaseRequestRecord', 'purchaseOrderRecord',
                     'goodsReceivedNoteRecord', 'invoiceRecord', 'paymentRecord', 'budgetAllocation',
                     'budgetPrediction', 'approvalWorkflow', 'documentRecord', 'notification'],
              description: 'Database table to aggregate'
            },
            aggregations: {
              type: 'object',
              description: 'Prisma aggregate operations (e.g., {_sum: {amount: true}, _count: true})'
            },
            filters: {
              type: 'object',
              description: 'Prisma where clause filters (optional)'
            },
            groupBy: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to group by (optional)'
            }
          },
          required: ['table', 'aggregations']
        }
      },
      {
        name: 'export_data',
        description: '[MUST USE] Export any data to Excel, PDF, CSV, or JSON. First ask user which format they prefer, then use this tool to generate the file.',
        input_schema: {
          type: 'object',
          properties: {
            dataType: {
              type: 'string',
              description: 'Type of data being exported (e.g., "purchase-requests", "suppliers", "budget-analysis", "custom-report")'
            },
            data: {
              type: 'array',
              description: 'Array of records to export (can be from query_database results)'
            },
            format: {
              type: 'string',
              enum: ['excel', 'pdf', 'csv', 'json'],
              description: 'Export format (ask user first!)'
            },
            filename: {
              type: 'string',
              description: 'Filename without extension (e.g., "purchase-requests-2024")'
            },
            metadata: {
              type: 'object',
              description: 'Additional metadata like title, description, preparedBy, etc.'
            }
          },
          required: ['dataType', 'data', 'format', 'filename']
        }
      },
      {
        name: 'generate_report',
        description: 'Generate a comprehensive analytical report with insights. Use this for complex reports with analysis.',
        input_schema: {
          type: 'object',
          properties: {
            reportType: {
              type: 'string',
              description: 'Type of report (e.g., "spending-analysis", "supplier-performance", "budget-overview", "department-comparison")'
            },
            data: {
              type: 'object',
              description: 'Data to include in the report'
            },
            format: {
              type: 'string',
              enum: ['pdf', 'excel'],
              description: 'Report format'
            },
            includeCharts: {
              type: 'boolean',
              description: 'Include charts and visualizations (default true)'
            }
          },
          required: ['reportType', 'data', 'format']
        }
      },
    ];
  }

  /**
   * Define the tool handler functions
   */
  static defineToolHandlers() {
    return {
      get_purchase_requests: async (input) => {
        const { userId, limit = 10 } = input;

        // 1. Get user information
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { department: true, role: true },
        });

        if (!user) {
          return {
            success: false,
            error: 'User not found',
            markdown: 'User not found',
          };
        }

        // 2. Build query condition - filter at the database level
        const whereClause = user.role !== 'Super Admin' && user.department
          ? {
              payload: {
                path: ['department'],
                equals: user.department
              }
            }
          : {};

        // 3. Run queries in parallel - improve performance
        const [records, totalCount] = await Promise.all([
          // Get data to display
          prisma.purchaseRequestRecord.findMany({
            where: whereClause,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
              localId: true,
              payload: true,
              createdAt: true,
            },
          }),
          // Get total count
          prisma.purchaseRequestRecord.count({
            where: whereClause,
          }),
        ]);

        // 4. Calculate statistics - only computed on the loaded records, to avoid an extra query
        // Note: for performance, statistics are based on the displayed records, not all records
        // If statistics for all records are needed, an additional aggregate query would be required
        const allRecordsForStats = await prisma.purchaseRequestRecord.findMany({
          where: whereClause,
          select: {
            payload: true,
          },
        });

        const statistics = {
          total: totalCount,
          pending: allRecordsForStats.filter(r => r.payload.status === 'PENDING').length,
          submitted: allRecordsForStats.filter(r => r.payload.status === 'SUBMITTED').length,
          approved: allRecordsForStats.filter(r => r.payload.status === 'APPROVED').length,
          rejected: allRecordsForStats.filter(r => r.payload.status === 'REJECTED').length,
        };

        // 5. Format the result
        const requests = records.map(r => ({
          id: r.localId,
          ...r.payload,
          createdAt: r.createdAt,
        }));

        // Return pre-formatted markdown table with statistics
        return {
          markdown: formatPurchaseRequestsAsMarkdown(requests, totalCount, statistics),
          total: totalCount,
          statistics,
          requests: requests,
        };
      },

      get_purchase_orders: async (input) => {
        const { limit = 10 } = input;

        // Run queries in parallel: data + total count
        const [records, totalCount] = await Promise.all([
          prisma.purchaseOrderRecord.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
              localId: true,
              payload: true,
              createdAt: true,
            },
          }),
          prisma.purchaseOrderRecord.count(),
        ]);

        const orders = records.map(r => ({
          id: r.localId,
          ...r.payload,
          createdAt: r.createdAt,
        }));

        // Return pre-formatted markdown table
        return {
          markdown: formatPurchaseOrdersAsMarkdown(orders, totalCount),
          total: totalCount,
          orders: orders,
        };
      },

      get_dashboard_stats: async (input) => {
        const { department } = input;

        // Build query condition
        const requestWhere = department
          ? {
              payload: {
                path: ['department'],
                equals: department,
              },
            }
          : {};

        const orderWhere = department
          ? {
              payload: {
                path: ['department'],
                equals: department,
              },
            }
          : {};

        // Run all statistics queries in parallel
        const [totalRequests, totalOrders, pendingApprovals, orderRecords] = await Promise.all([
          prisma.purchaseRequestRecord.count({ where: requestWhere }),
          prisma.purchaseOrderRecord.count({ where: orderWhere }),
          prisma.purchaseRequestRecord.count({
            where: {
              ...requestWhere,
              payload: {
                path: ['status'],
                equals: 'PENDING',
              },
            },
          }),
          prisma.purchaseOrderRecord.findMany({
            where: orderWhere,
            select: {
              payload: true,
            },
          }),
        ]);

        // Calculate total spending
        let totalSpending = 0;
        orderRecords.forEach(order => {
          if (order.payload.items && Array.isArray(order.payload.items)) {
            order.payload.items.forEach(item => {
              const amount = parseFloat(item.totalPrice || 0);
              if (!isNaN(amount)) {
                totalSpending += amount;
              }
            });
          }
        });

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

      query_database: async (input) => {
        const { table, filters = {}, include = {}, orderBy, take = 50, skip = 0 } = input;

        // Security: Limit to reasonable query sizes
        const safeTake = Math.min(take || 50, 500);

        try {
          // Dynamic Prisma query
          const results = await prisma[table].findMany({
            where: filters,
            include,
            orderBy,
            take: safeTake,
            skip: skip || 0
          });

          return {
            success: true,
            table,
            count: results.length,
            data: results,
            message: `Found ${results.length} record(s) from ${table}`
          };
        } catch (error) {
          logger.error('QueryDatabase', `Failed to query ${table}: ${error.message}`);
          return {
            success: false,
            error: `Failed to query ${table}: ${error.message}`,
            hint: 'Check if the table name and filters are correct'
          };
        }
      },

      aggregate_data: async (input) => {
        const { table, aggregations, filters = {}, groupBy } = input;

        try {
          let result;
          if (groupBy && groupBy.length > 0) {
            // Group by aggregation
            result = await prisma[table].groupBy({
              by: groupBy,
              where: filters,
              ...aggregations
            });
          } else {
            // Simple aggregation
            result = await prisma[table].aggregate({
              where: filters,
              ...aggregations
            });
          }

          return {
            success: true,
            table,
            result,
            groupBy: groupBy || null
          };
        } catch (error) {
          logger.error('AggregateData', `Failed to aggregate ${table}: ${error.message}`);
          return {
            success: false,
            error: `Failed to aggregate ${table}: ${error.message}`,
            hint: 'Check if the aggregation syntax is correct'
          };
        }
      },

      export_data: async (input) => {
        const { dataType, data, format, filename, metadata = {} } = input;

        if (!data || data.length === 0) {
          return {
            success: false,
            error: 'No data provided for export',
            hint: 'Query the data first using query_database, then pass it to export_data'
          };
        }

        try {
          // Generate unique filename
          const timestamp = Date.now();
          const extension = format === 'excel' ? 'xlsx' : format;
          const safeFilename = String(filename || dataType || 'export')
            .replace(/[^a-zA-Z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'export';
          const fullFilename = `${safeFilename}-${timestamp}.${extension}`;
          const filepath = path.join(EXPORTS_DIR, fullFilename);

          // Simplified export - write JSON for now
          // In production, you'd use ExportService for proper Excel/PDF generation
          const fs = await import('fs/promises');
          await fs.mkdir(path.dirname(filepath), { recursive: true });

          if (format === 'json') {
            await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
          } else if (format === 'csv') {
            // Simple CSV conversion
            if (data.length > 0) {
              const headers = Object.keys(data[0]).join(',');
              const rows = data.map(row => Object.values(row).join(',')).join('\n');
              await fs.writeFile(filepath, `${headers}\n${rows}`, 'utf8');
            }
          } else {
            return {
              success: false,
              error: `${format} export is not available for arbitrary query data yet`,
              hint: 'Use csv or json for chatbot query exports'
            };
          }

          const downloadUrl = `/api/chatbot/download/${fullFilename}`;

          return {
            success: true,
            message: `File generated successfully! Click the link below to download:`,
            downloadUrl,
            filename: fullFilename,
            format,
            recordCount: data.length
          };
        } catch (error) {
          logger.error('ExportData', `Export failed: ${error.message}`);
          return {
            success: false,
            error: `Export failed: ${error.message}`
          };
        }
      },

      generate_report: async (input) => {
        const { reportType, data, format, includeCharts = true } = input;

        try {
          // Generate a comprehensive report
          const timestamp = Date.now();
          const filename = `report-${reportType}-${timestamp}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
          const filepath = path.join(EXPORTS_DIR, filename);

          // For now, export as JSON with report structure
          const reportData = {
            reportType,
            generatedAt: new Date().toISOString(),
            format,
            includeCharts,
            data
          };

          const fs = await import('fs/promises');
          await fs.mkdir(path.dirname(filepath), { recursive: true });
          await fs.writeFile(filepath.replace(/\.(pdf|xlsx)$/, '.json'), JSON.stringify(reportData, null, 2), 'utf8');

          const downloadUrl = `/api/chatbot/download/${filename.replace(/\.(pdf|xlsx)$/, '.json')}`;

          return {
            success: true,
            message: `Report generated successfully! Download it below:`,
            downloadUrl,
            filename,
            reportType
          };
        } catch (error) {
          logger.error('GenerateReport', `Report generation failed: ${error.message}`);
          return {
            success: false,
            error: `Report generation failed: ${error.message}`
          };
        }
      },
    };
  }
}

export default new ChatBotAgent();
