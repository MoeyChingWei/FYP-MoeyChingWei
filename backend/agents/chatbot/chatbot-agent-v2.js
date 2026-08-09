import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';
import { v4 as uuidv4 } from 'uuid';
import { generatePRNumber } from '../../utils/pr-number-generator.js';

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

const CHATBOT_SYSTEM_PROMPT = `You are the General AI Assistant for OptiMind ERP system.

YOUR ROLE:
- Friendly and approachable general assistant
- Help users navigate the system
- Answer questions about system features
- Query data when users ask
- Guide users through basic operations

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR COMMUNICATION STYLE:
- Friendly and conversational
- Clear and concise
- Professional but not overly formal
- Use emojis sparingly (✅ ❌ 📊 💡)

## DATA PRESENTATION FORMAT

**CRITICAL: When tools return a 'markdown' field, use it DIRECTLY in your response. Do NOT reformat or transform it.**

The get_purchase_requests and get_purchase_orders tools return pre-formatted Markdown tables in the 'markdown' field. Simply include this markdown in your response.

Example response when user asks for purchase requests:

"Here are your purchase requests, {userName}!

[Insert the 'markdown' field from tool response here]

Would you like me to help you with any of these requests?"

**Important:**
- Copy the markdown field EXACTLY as returned
- Do NOT try to create your own table
- Do NOT reformat the data
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

## State Management

Use metadata in messages to track collected items across conversation turns.

## Available Tools

- get_purchase_requests: Get user's purchase request list
- get_purchase_orders: Get purchase order list
- get_dashboard_stats: Get dashboard statistics
- get_notifications: Get user notifications
- get_lookup_options: Get available categories or units
- create_purchase_request: Create new purchase request

Please respond in friendly, professional English.`;

/**
 * ChatBot Agent - General Assistant
 *
 * General AI assistant that handles system usage questions, data queries, and basic operation guidance
 */
class ChatBotAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'chatbot',
      name: 'General Assistant',
      description: 'Friendly AI assistant for general ERP system help',
      personality: 'Friendly, approachable, and helpful',
      expertise: 'General system navigation, data queries, and basic operations',
      systemPromptTemplate: CHATBOT_SYSTEM_PROMPT,
      tools: ChatBotAgent.defineTools(),
      toolHandlers: ChatBotAgent.defineToolHandlers(),
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
    };
  }
}

export default new ChatBotAgent();
