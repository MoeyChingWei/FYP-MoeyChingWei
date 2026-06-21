# ChatBot Agent Enhancement - Phase 1: Conversational Purchase Request Creation

**Date:** 2026-06-11  
**Status:** Design  
**Phase:** 1 of 3 (Phased Enhancement Strategy)

## Executive Summary

Enhance the OptiMind ERP ChatBot Agent with conversational purchase request creation capability, inspired by ClareCare's guided dialogue approach. Users can create purchase requests through natural conversation with step-by-step guidance and quick-select options, eliminating the need to navigate traditional forms.

## Background

### Current State
- ChatBot Agent supports querying purchase requests, orders, statistics, and notifications
- Users must use traditional web forms to create purchase requests
- No conversational creation capability exists

### User Need
Users want to say "create purchase request" and have the ChatBot guide them through the process conversationally, with smart defaults and quick-select buttons for common options (categories, units of measurement).

## Goals

### Phase 1 (This Design)
1. Enable conversational purchase request creation with multi-turn dialogue
2. Provide quick-select options for categories and units
3. Support multiple line items in a single request
4. Auto-fill user information (name, department, email) from session context
5. Generate intelligent description defaults (e.g., "Buy {itemName}")

### Future Phases (Not in Scope)
- Phase 2: Intelligent operations (approve/reject, status updates, basic reporting)
- Phase 3: Data insights (trend analysis, anomaly detection, predictions)

## Design

### 1. Architecture

**New Components:**
```
ChatBot Agent
├── create_purchase_request (new tool)
├── get_lookup_options (new tool)
└── Conversation state management (via ChatMessage.metadata)
```

**Data Flow:**
```
User: "create purchase request"
  ↓
ChatBot detects creation intent
  ↓
Enter guided mode (multi-turn dialogue)
  ↓
Collect items[] → For each: (name, category, qty, unit, description)
  ↓
Show preview & confirm
  ↓
Call create_purchase_request tool
  ↓
Save to PurchaseRequestRecord
  ↓
Return success + PR number
```

### 2. Conversational Flow

**Step 1: Detect Intent**
- Trigger keywords: `"create"`, `"new purchase request"`, `"我要申请"`, `"make a request"`
- Response: "I'll help you create a purchase request. Let's start!"

**Step 2: Collect Item Name**
- Prompt: "What item do you need to purchase?"
- User enters item name (e.g., "Printer Paper")

**Step 3: Select Category (with quick options)**
- Prompt: "Which category does this item belong to?"
- Quick options (buttons/list):
  - Office Supplies / Stationery
  - IT Equipment / Hardware
  - Raw Materials
  - Cleaning Supplies
  - Furniture
  - Safety Equipment
  - Other (type your own)

**Step 4: Enter Quantity**
- Prompt: "How many units do you need?"
- User enters number (validation: must be positive number)

**Step 5: Select Unit of Measurement (with quick options)**
- Prompt: "What's the unit of measurement?"
- Quick options:
  - box
  - piece
  - kg
  - liter
  - set
  - pack
  - unit
  - Other (type your own)

**Step 6: Optional Description (with smart default)**
- Prompt: "Any additional details for this item? (Optional - press Enter to skip)"
- Smart handling:
  ```javascript
  let description = `Buy ${itemName}`;
  if (userInput.trim()) {
    description += ` - ${userInput.trim()}`;
  }
  ```
- Examples:
  - User presses Enter → `"Buy Printer Paper"`
  - User types "urgent" → `"Buy Printer Paper - urgent"`
  - User types "For Q2 marketing" → `"Buy Printer Paper - For Q2 marketing"`

**Step 7: Add More Items**
- Prompt: "Item added! Would you like to add another item?"
- Options: [Add another item] [Done, create request]
- If "Add another", loop back to Step 2
- If "Done", proceed to Step 8

**Step 8: Preview & Confirm**
- Show summary:
  ```
  Purchase Request Summary:
  1. Item: Printer Paper
     Category: Office Supplies / Stationery
     Quantity: 10 box
     Description: Buy Printer Paper - urgent
  
  2. Item: USB Cable
     Category: IT Equipment / Hardware
     Quantity: 5 piece
     Description: Buy USB Cable
  
  Department: IT
  Requested by: Employee1
  Email: employee1@company.com
  
  Ready to submit?
  ```
- Options: [Submit] [Edit] [Cancel]

**Step 9: Confirmation**
- On submit, display:
  ```
  ✅ Purchase request created successfully!
  
  PR Number: PR-20260611-A3X9
  Status: Pending Approval
  Items: 2 items
  Department: IT
  
  Your request has been submitted and is awaiting approval.
  You'll receive a notification when it's processed.
  
  Would you like to:
  - View your pending requests
  - Create another request
  - Return to main menu
  ```

### 3. Quick-Select Button Implementation

**Challenge:** DeepSeek API returns plain text; no native button support.

**Solution:** Hybrid approach
- ChatBot embeds structured options in response
- Frontend detects pattern and renders as buttons
- Fallback: Users can type option text or number

**Response Format:**
```
Which category does this item belong to?

OPTIONS:
- Office Supplies / Stationery
- IT Equipment / Hardware
- Raw Materials
- Cleaning Supplies
- Other (type your own)
```

**Frontend Parsing:**
- Detect `OPTIONS:` keyword
- Extract list items
- Render as clickable buttons
- User click = send option text as message

**Fallback (no frontend parsing):**
- User types "1", "Office Supplies", or any option text
- ChatBot recognizes and continues

### 4. State Management

**Storage:** Use `ChatMessage.metadata` field to persist conversation state across turns.

**State Schema:**
```javascript
{
  conversationState: "collecting_items" | "preview" | null,
  currentItem: {
    itemName: string,
    itemCategory?: string,
    quantity?: number,
    unitOfMeasurement?: string,
    step: "name" | "category" | "quantity" | "unit" | "description"
  },
  collectedItems: [
    {
      itemName: string,
      itemCategory: string,
      quantity: number,
      unitOfMeasurement: string,
      itemDescription: string
    }
  ]
}
```

**State Transitions:**
- `null` → `collecting_items` (on create intent)
- `collecting_items` → `preview` (user says "Done")
- `preview` → `null` (on submit or cancel)

### 5. Category & Unit Options

**Hybrid Strategy:** Fixed common options + dynamic database lookups.

**Fixed Common Options:**
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

**Dynamic Loading:**
- New tool: `get_lookup_options(kind: 'category' | 'unit')`
- Query `PurchasingLookup` table where `kind = 'category'` or `'unit'`
- Merge with fixed options, deduplicate
- Return combined list

**Tool Definition:**
```javascript
{
  name: 'get_lookup_options',
  description: 'Get available categories or units from database',
  input_schema: {
    type: 'object',
    properties: {
      kind: {
        type: 'string',
        enum: ['category', 'unit']
      }
    },
    required: ['kind']
  }
}
```

### 6. Tool Definitions

**create_purchase_request:**
```javascript
{
  name: 'create_purchase_request',
  description: 'Create a new purchase request with collected line items',
  input_schema: {
    type: 'object',
    properties: {
      lineItems: {
        type: 'array',
        description: 'List of items to purchase',
        items: {
          type: 'object',
          properties: {
            itemName: { type: 'string' },
            itemCategory: { type: 'string' },
            quantity: { type: 'number' },
            unitOfMeasurement: { type: 'string' },
            itemDescription: { type: 'string' }
          },
          required: ['itemName', 'itemCategory', 'quantity', 'unitOfMeasurement', 'itemDescription']
        }
      }
    },
    required: ['lineItems']
  }
}
```

**Implementation:**
- Generate unique `localId` (UUID)
- Generate `prNumber`: `PR-YYYYMMDD-XXXX` (4-char random alphanumeric)
- Auto-fill user context: `requestBy`, `department`, `createdByEmail`, `createdByUserId`
- Set `status: "PENDING"`
- Set `requestDate` to current date
- Initialize `currency: "MYR"`
- Set `unitPrice: 0` for each line item (to be filled later by procurement)
- Set `supplierId`, `supplierName`, `supplierEmail` to null
- Generate `tempId` (UUID) for each line item
- Save to `PurchaseRequestRecord` table
- Return success with PR number

### 7. Error Handling

**Invalid Input:**
- Quantity not a number → "Please enter a valid number for quantity."
- Item name empty → "Item name is required. What would you like to purchase?"
- Generic error → "I didn't understand that. Could you try again?"

**User Cancellation:**
- Keywords: `"cancel"`, `"stop"`, `"nevermind"`, `"quit"`
- Response: "Purchase request creation cancelled. Your draft has not been saved."
- Clear conversation state

**Session Timeout:**
- If no user input for 30 minutes during creation flow
- Clear state automatically
- Next message: "Your previous draft has expired. Let's start fresh if you'd like to create a request."

**Duplicate Creation Flow:**
- User says "create" while already in creation flow
- Response: "You have an ongoing purchase request. Would you like to [Continue] or [Start New]?"
- "Continue" → resume at last step
- "Start New" → clear state, restart from Step 1

**Network/Database Errors:**
- On tool handler failure, return friendly message
- "Sorry, I couldn't save your request right now. Please try again in a moment."

### 8. Data Schema

**PurchaseRequestRecord Payload:**
```javascript
{
  localId: string,              // UUID
  status: "PENDING",            // Initial status
  prNumber: string,             // PR-20260611-A3X9
  requestBy: string,            // From user.name
  department: string,           // From user.department
  requestDate: string,          // YYYY-MM-DD
  createdByEmail: string,       // From user.email
  createdByUserId: number,      // From user.id
  currency: "MYR",              // Fixed
  lineItems: [
    {
      tempId: string,           // UUID
      itemName: string,
      itemCategory: string,
      quantity: number,
      unitOfMeasurement: string,
      itemDescription: string,
      unitPrice: 0,             // Initial, filled later
      supplierId: null,
      supplierName: null,
      supplierEmail: null
    }
  ]
}
```

### 9. System Prompt Enhancement

**Add to ChatBot System Prompt:**
```
When users say "create", "new purchase request", or similar intent, guide them through creating a purchase request step-by-step:

1. Ask for item name
2. Offer category options (Office Supplies, IT Equipment, Raw Materials, etc.)
3. Ask for quantity (must be a number)
4. Offer unit options (box, piece, kg, liter, set, etc.)
5. Ask for optional description (auto-prefix with "Buy {itemName}")
6. Ask if they want to add more items
7. Show preview and confirm before submitting
8. Use create_purchase_request tool to save

Use a friendly, conversational tone. Present options as numbered lists for easy selection.
Track state using conversation metadata to handle multi-turn dialogue.
```

## Implementation Checklist

### Backend Changes
- [ ] Add `create_purchase_request` tool to ChatBot Agent
- [ ] Add `get_lookup_options` tool to ChatBot Agent
- [ ] Implement tool handlers for both new tools
- [ ] Add conversation state management logic
- [ ] Update system prompt with creation flow guidance
- [ ] Add PR number generation utility
- [ ] Handle metadata persistence in message saving

### Frontend Changes (Optional Enhancement)
- [ ] Add option button parser (detect `OPTIONS:` pattern)
- [ ] Render buttons for quick-select options
- [ ] Handle button click → send as text message
- [ ] Style buttons to match ClareCare aesthetic

### Testing
- [ ] Test full flow: create → 1 item → submit
- [ ] Test multi-item creation (3+ items)
- [ ] Test cancel mid-flow
- [ ] Test invalid inputs (negative quantity, empty name)
- [ ] Test custom category/unit input
- [ ] Test description auto-prefix logic
- [ ] Test state persistence across session
- [ ] Test timeout/expiration handling

## Success Metrics

**User Experience:**
- Time to create purchase request < 2 minutes
- User completion rate > 80% (vs abandonment)
- User satisfaction score > 4/5

**System Performance:**
- Response time < 2 seconds per turn
- Tool call success rate > 99%
- Zero data loss on submission

## Future Enhancements (Phase 2 & 3)

**Phase 2: Intelligent Operations**
- Approve/reject purchase requests via chat
- Modify existing requests
- Generate simple reports
- Status updates and tracking

**Phase 3: Data Insights**
- Spending trend analysis
- Anomaly detection (unusual requests)
- Predictive suggestions
- Budget alerts

## Appendix

### Sample Conversation

```
User: create purchase request

ChatBot: I'll help you create a purchase request. Let's start!
What item do you need to purchase?

User: printer paper

ChatBot: Which category does this item belong to?

OPTIONS:
- Office Supplies / Stationery
- IT Equipment / Hardware
- Raw Materials
- Cleaning Supplies
- Furniture
- Safety Equipment
- Other (type your own)

User: 1

ChatBot: How many units do you need?

User: 10

ChatBot: What's the unit of measurement?

OPTIONS:
- box
- piece
- kg
- liter
- set
- pack
- unit
- Other (type your own)

User: box

ChatBot: Any additional details for this item? (Optional - press Enter to skip)

User: urgent for Q2

ChatBot: Item added! Would you like to add another item?

[Add another item] [Done, create request]

User: done

ChatBot: Purchase Request Summary:
1. Item: printer paper
   Category: Office Supplies / Stationery
   Quantity: 10 box
   Description: Buy printer paper - urgent for Q2

Department: IT
Requested by: Employee1
Email: employee1@company.com

Ready to submit?

[Submit] [Cancel]

User: submit

ChatBot: ✅ Purchase request created successfully!

PR Number: PR-20260611-A3X9
Status: Pending Approval
Items: 1 item
Department: IT

Your request has been submitted and is awaiting approval.
You'll receive a notification when it's processed.

Would you like to:
- View your pending requests
- Create another request
- Return to main menu
```

### References
- Current ChatBot Agent: `backend/agents/chatbot/chatbot-agent.js`
- DeepSeek Service: `backend/services/deepseek-ai-service.js`
- Database Schema: `backend/prisma/schema.prisma`
- Workflow Storage: `backend/routes/workflowStorage.js`
