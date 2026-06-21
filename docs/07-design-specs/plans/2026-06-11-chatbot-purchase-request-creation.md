# ChatBot Purchase Request Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable conversational purchase request creation through ChatBot with step-by-step guidance and quick-select options.

**Architecture:** Extend ChatBot Agent with two new tools (create_purchase_request, get_lookup_options), add conversation state management via ChatMessage.metadata, and enhance system prompt for guided multi-turn dialogue.

**Tech Stack:** Node.js, Express, Prisma ORM, DeepSeek AI, PostgreSQL

---

## File Structure

**New Files:**
- `backend/utils/pr-number-generator.js` - Generate unique PR numbers

**Modified Files:**
- `backend/agents/chatbot/chatbot-agent.js` - Add new tools and state management
- `backend/services/deepseek-ai-service.js` - No changes needed (already supports tools)

**Test Files:**
- Manual testing via API endpoint (automated tests optional for Phase 1)

---

## Task 1: PR Number Generator Utility

**Files:**
- Create: `backend/utils/pr-number-generator.js`

- [ ] **Step 1: Write PR number generator**

```javascript
/**
 * Generate a unique PR number in format: PR-YYYYMMDD-XXXX
 * Example: PR-20260611-A3X9
 */
function generatePRNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `PR-${dateStr}-${random}`;
}

export { generatePRNumber };
```

- [ ] **Step 2: Test generator manually**

Run in Node REPL:
```bash
cd backend
node
```
```javascript
const { generatePRNumber } = await import('./utils/pr-number-generator.js');
console.log(generatePRNumber()); // Should output: PR-20260611-XXXX
console.log(generatePRNumber()); // Should be different
```

Expected: Two different PR numbers with today's date

- [ ] **Step 3: Commit**

```bash
git add backend/utils/pr-number-generator.js
git commit -m "feat: add PR number generator utility"
```

---

## Task 2: Add get_lookup_options Tool

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js`

- [ ] **Step 1: Add common options constants**

Add at top of file after imports:

```javascript
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
```

- [ ] **Step 2: Add tool definition in defineTools method**

Add to the tools array in `defineTools()` method:

```javascript
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
}
```

- [ ] **Step 3: Add tool handler in defineToolHandlers method**

Add to the toolHandlers object in `defineToolHandlers()` method:

```javascript
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
}
```

- [ ] **Step 4: Test tool via API**

Start backend:
```bash
cd backend
npm run dev
```

Test via Postman/curl (create session first, then send message):
```bash
curl -X POST http://localhost:4000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": 8, "message": "what categories are available?"}'
```

Expected: ChatBot should be able to list categories

- [ ] **Step 5: Commit**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat: add get_lookup_options tool for categories and units"
```

---

## Task 3: Add create_purchase_request Tool

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js`
- Create: `backend/utils/pr-number-generator.js` (already created)

- [ ] **Step 1: Import dependencies at top of file**

Add to imports:

```javascript
import { v4 as uuidv4 } from 'uuid';
import { generatePRNumber } from '../utils/pr-number-generator.js';
```

- [ ] **Step 2: Add tool definition**

Add to tools array in `defineTools()`:

```javascript
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
}
```

- [ ] **Step 3: Add tool handler**

Add to toolHandlers object in `defineToolHandlers()`:

```javascript
create_purchase_request: async (input) => {
  const { lineItems, userId } = input;

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
  await prisma.purchaseRequestRecord.create({
    data: {
      localId,
      payload,
    },
  });

  return {
    success: true,
    prNumber,
    status: 'PENDING',
    itemCount: lineItems.length,
    department: user.department,
  };
}
```

- [ ] **Step 4: Update enrichToolHandlers to inject userId**

Modify `enrichToolHandlers()` method to also inject userId for create_purchase_request:

```javascript
enrichToolHandlers(userId) {
  const enriched = {};
  for (const [name, handler] of Object.entries(this.toolHandlers)) {
    enriched[name] = (input) => handler({ ...input, userId });
  }
  return enriched;
}
```

- [ ] **Step 5: Test tool via manual chat**

Start backend and test via chat:
```bash
curl -X POST http://localhost:4000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": 8, "message": "create a purchase request with 10 boxes of printer paper in office supplies category"}'
```

Expected: ChatBot should guide through creation or create directly if enough info provided

- [ ] **Step 6: Commit**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat: add create_purchase_request tool"
```

---

## Task 4: Enhanced System Prompt for Guided Creation

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js`

- [ ] **Step 1: Update system prompt constant**

Replace `CHATBOT_SYSTEM_PROMPT` with enhanced version:

```javascript
const CHATBOT_SYSTEM_PROMPT = `You are the AI assistant for OptiMind ERP system.

Your responsibilities:
1. Answer user questions about system usage
2. Help users query data (purchase requests, orders, spending statistics, etc.)
3. Guide users through operations
4. Provide a friendly user experience

Current user information:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}

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

Please respond in friendly, professional English. Use OPTIONS: format for presenting choices.`;
```

- [ ] **Step 2: Test guided creation flow**

Test complete flow:
```bash
# Message 1
curl -X POST http://localhost:4000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": 8, "message": "create purchase request", "sessionId": "test-session-1"}'

# Message 2 (after ChatBot asks for item)
curl -X POST http://localhost:4000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": 8, "message": "printer paper", "sessionId": "test-session-1"}'

# Continue through flow...
```

Expected: ChatBot guides through each step systematically

- [ ] **Step 3: Commit**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat: enhance system prompt for guided purchase request creation"
```

---

## Task 5: State Management (Optional Enhancement)

**Note:** The current implementation relies on DeepSeek's conversation context to maintain state. For more robust state tracking, you can add explicit state management using ChatMessage.metadata.

**Files:**
- Modify: `backend/agents/chatbot/chatbot-agent.js`

- [ ] **Step 1: Add state tracking to saveMessage**

Modify `saveMessage` method to accept optional metadata:

```javascript
async saveMessage(sessionId, role, content, metadata = null) {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

  await prisma.chatMessage.create({
    data: {
      sessionId,
      role,
      content: contentStr,
      metadata: metadata ? metadata : undefined,
    },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });
}
```

- [ ] **Step 2: Add getLastMessageMetadata helper**

Add helper method to retrieve last message metadata:

```javascript
async getLastMessageMetadata(sessionId) {
  const lastMessage = await prisma.chatMessage.findFirst({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    select: { metadata: true },
  });

  return lastMessage?.metadata || null;
}
```

- [ ] **Step 3: Test metadata persistence**

Test saving metadata:
```javascript
// In chat method, when saving assistant message:
await this.saveMessage(sessionId, 'assistant', response.content, {
  conversationState: 'collecting_items',
  currentItem: { step: 'category' }
});
```

- [ ] **Step 4: Commit**

```bash
git add backend/agents/chatbot/chatbot-agent.js
git commit -m "feat: add conversation state management via metadata"
```

---

## Task 6: Integration Testing

**Files:**
- Manual testing via API

- [ ] **Step 1: Test single-item creation**

Full conversation flow:
```bash
# Start
POST /api/chatbot/chat {"userId": 8, "message": "create", "sessionId": "test-1"}

# Item name
POST /api/chatbot/chat {"userId": 8, "message": "USB cable", "sessionId": "test-1"}

# Category
POST /api/chatbot/chat {"userId": 8, "message": "2", "sessionId": "test-1"}

# Quantity
POST /api/chatbot/chat {"userId": 8, "message": "5", "sessionId": "test-1"}

# Unit
POST /api/chatbot/chat {"userId": 8, "message": "piece", "sessionId": "test-1"}

# Description
POST /api/chatbot/chat {"userId": 8, "message": "urgent", "sessionId": "test-1"}

# Done
POST /api/chatbot/chat {"userId": 8, "message": "done", "sessionId": "test-1"}

# Confirm
POST /api/chatbot/chat {"userId": 8, "message": "submit", "sessionId": "test-1"}
```

Expected: PR created with 1 item, returns PR number

- [ ] **Step 2: Verify in database**

```bash
cd backend
node
```
```javascript
const { PrismaClient } = await import('./config/prisma.js');
const prisma = new PrismaClient();
const latest = await prisma.purchaseRequestRecord.findFirst({
  orderBy: { createdAt: 'desc' }
});
console.log(JSON.stringify(latest.payload, null, 2));
```

Expected: Payload matches expected schema with correct data

- [ ] **Step 3: Test multi-item creation**

Repeat flow but say "add another" after first item, then add second item.

Expected: PR created with 2 items

- [ ] **Step 4: Test cancellation**

Start flow, say "cancel" mid-way.

Expected: ChatBot responds with cancellation message

- [ ] **Step 5: Test invalid inputs**

- Enter text for quantity → Should prompt for number
- Enter negative quantity → Should ask again
- Empty item name → Should ask again

- [ ] **Step 6: Test custom category/unit**

Say "Other" or type custom text when asked for category/unit.

Expected: Custom value accepted and saved

- [ ] **Step 7: Document test results**

Create `docs/testing/chatbot-creation-tests.md` with test results summary.

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "test: complete integration testing for purchase request creation"
```

---

## Verification Checklist

After completing all tasks:

- [ ] Can create single-item purchase request via chat
- [ ] Can create multi-item purchase request via chat
- [ ] Categories and units display as OPTIONS list
- [ ] Description auto-prefixes with "Buy {itemName}"
- [ ] PR number generated correctly (PR-YYYYMMDD-XXXX format)
- [ ] Data saved to PurchaseRequestRecord with correct structure
- [ ] User info (name, email, department) auto-filled
- [ ] Cancel keyword stops creation
- [ ] Invalid quantity rejected
- [ ] Custom category/unit accepted
- [ ] System prompt guides conversation naturally

---

## Next Steps (Not in This Plan)

**Frontend Enhancement:**
- Parse OPTIONS: pattern and render as buttons
- Style buttons to match ClareCare aesthetic

**Phase 2 Features:**
- Approve/reject via chat
- Modify existing requests
- Status updates

**Phase 3 Features:**
- Trend analysis
- Anomaly detection
- Predictive suggestions
