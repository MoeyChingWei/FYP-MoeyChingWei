# AI-Assisted Budget Forecasting & Approval System Design

**Date:** 2026-08-14  
**Status:** Approved  
**Approach:** Lightweight Integration (Approach A)

## Executive Summary

Transform the existing company-wide budget forecasting into a comprehensive department-level system with AI-powered predictions, approval workflows, and intelligent budget management. The system integrates the existing Analytics Agent (Forecasting AI Agent) to predict next month's budget for each department based on historical Purchase Request data.

**Key Characteristics:**
- Department-level monthly budget pools (not fiscal year-based)
- AI predictions are suggestive - users make final decisions
- Soft budget limits with warnings (allow over-budget PRs with alerts)
- Both automatic (configurable end-of-month) and manual prediction triggers
- Budget deducted when Purchase Request reaches "APPROVED" status
- Comprehensive notification system
- No data migration - new Department table coexists with existing User.department field

---

## Part 1: Database Design

### 1.1 New Tables Overview

Add 4 new tables to `backend/prisma/schema.prisma`:
- `Department` - Formal department registry
- `MonthlyBudget` - Month-by-month budget allocations and spending
- `BudgetAdjustmentRequest` - Approval workflow for budget changes
- `BudgetPrediction` - AI prediction history and insights

**CRITICAL CONSTRAINT:** Keep existing `User.department` field unchanged. No data migration to avoid breaking backend systems.

### 1.2 Department Table

```prisma
model Department {
  id              Int      @id @default(autoincrement())
  name            String   @unique          // "Engineering", "Marketing"
  code            String   @unique          // "ENG", "MKT"
  description     String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  monthlyBudgets  MonthlyBudget[]
  adjustmentRequests BudgetAdjustmentRequest[]
  predictions     BudgetPrediction[]

  @@map("departments")
}
```

**Purpose:** Central registry for departments with unique identifiers.  
**Relationship to User:** Linked via `User.department` text field matching `Department.code` or `Department.name` (flexible lookup).

### 1.3 MonthlyBudget Table

```prisma
model MonthlyBudget {
  id              Int      @id @default(autoincrement())
  departmentId    Int
  year            Int                      // 2026
  month           Int                      // 1-12
  allocatedAmount Decimal  @db.Decimal(15, 2)  // Approved budget
  spentAmount     Decimal  @default(0) @db.Decimal(15, 2)  // Actual spending
  reservedAmount  Decimal  @default(0) @db.Decimal(15, 2)  // Future use
  status          String   @default("active")  // active, archived
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       Int?                     // userId who allocated

  department      Department @relation(fields: [departmentId], references: [id])

  @@unique([departmentId, year, month])
  @@index([year, month])
  @@map("monthly_budgets")
}
```

**Purpose:** Track monthly budget allocation and spending per department.  
**Budget Deduction:** `spentAmount` incremented when PR status = "APPROVED".  
**Soft Limit:** No hard constraint - allow `spentAmount > allocatedAmount` with warnings.

### 1.4 BudgetAdjustmentRequest Table

```prisma
model BudgetAdjustmentRequest {
  id              Int      @id @default(autoincrement())
  departmentId    Int
  targetYear      Int
  targetMonth     Int
  requestType     String   // "one_time_increase", "additional_request"
  requestedAmount Decimal  @db.Decimal(15, 2)
  currentBudget   Decimal  @db.Decimal(15, 2)  // Snapshot at request time
  reason          String
  status          String   @default("pending")  // pending, approved, rejected
  requestedBy     Int      // userId (Department Head)
  reviewedBy      Int?     // userId (Finance Manager)
  reviewNotes     String?
  requestedAt     DateTime @default(now())
  reviewedAt      DateTime?

  department      Department @relation(fields: [departmentId], references: [id])

  @@index([departmentId, status])
  @@index([targetYear, targetMonth])
  @@map("budget_adjustment_requests")
}
```

**Purpose:** Approval workflow for budget adjustments.  
**Workflow:** Department Head submits → Finance Manager approves/rejects.  
**Request Types:**
- `one_time_increase`: Single adjustment to monthly budget
- `additional_request`: Multiple requests allowed per month

### 1.5 BudgetPrediction Table

```prisma
model BudgetPrediction {
  id                Int      @id @default(autoincrement())
  departmentId      Int?     // NULL for new departments
  targetYear        Int
  targetMonth       Int
  predictedAmount   Decimal  @db.Decimal(15, 2)
  confidence        String   // "high", "medium", "low"
  algorithm         String   // "holt_winters", "moving_average", "similar_dept"
  historicalData    Json     // Input data used for prediction
  categoryBreakdown Json?    // Predicted spending by category
  aiInsights        String?  // Natural language explanation
  comparisonData    Json?    // Comparison with past months
  triggerType       String   // "auto", "manual"
  triggeredBy       Int?     // userId if manual
  createdAt         DateTime @default(now())

  department        Department? @relation(fields: [departmentId], references: [id])

  @@index([departmentId, targetYear, targetMonth])
  @@index([createdAt])
  @@map("budget_predictions")
}
```

**Purpose:** Store AI prediction history, insights, and metadata.  
**New Departments:** `departmentId` NULL when no historical data exists.  
**Algorithm Field:** Tracks which prediction method was used.

---

## Part 2: AI Integration Architecture

### 2.1 Budget Prediction Service

**File:** `backend/services/budget-prediction-service.js`

**Key Function:** `generateDepartmentPrediction(departmentCode, targetYear, targetMonth, userId)`

**Algorithm Integration:**
- Uses existing Analytics Agent's `predict_future_spending` tool
- Leverages Holt-Winters Triple Exponential Smoothing for seasonal data
- Falls back to moving average if insufficient data

**Flow:**
1. Load historical PR data for department (via `User.department` field)
2. Call Analytics Agent's chat method with prediction request
3. Analytics Agent triggers `predict_future_spending` tool
4. Parse AI response (predicted amount, confidence, insights, category breakdown)
5. Generate comparison data (3-month, 6-month, year-to-date trends)
6. Save to `BudgetPrediction` table
7. Trigger notification to Department Head and Finance Manager

**New Department Handling:**
```javascript
async function handleNewDepartment(newDeptCode, targetYear, targetMonth) {
  // 1. Find similar departments based on spending patterns only
  // (Department schema has no size/industry/function fields - match via historical spending)
  const similarDepts = await findSimilarDepartmentsBySpending(newDeptCode);
  
  // 2. Calculate average spending from similar departments
  const avgSpending = await calculateAverageSpending(similarDepts, targetYear, targetMonth);
  
  // 3. Call Analytics Agent with benchmark data for AI-suggested adjustment
  const aiSuggestion = await analyticsAgent.chat({
    message: `New department "${newDeptCode}" has no history. Similar departments (by spending pattern) average ${avgSpending}. Suggest appropriate budget considering: [context about department type, company growth, market conditions]`
  });
  
  // 4. Save prediction with algorithm="similar_dept"
  await prisma.budgetPrediction.create({
    data: {
      departmentId: null,  // New department not in DB yet
      targetYear,
      targetMonth,
      predictedAmount: aiSuggestion.amount,
      confidence: "low",   // Always low for new departments
      algorithm: "similar_dept",
      aiInsights: aiSuggestion.reasoning,
      triggerType: "manual"
    }
  });
  
  // 5. Notify Finance Manager about new department suggestion
  await notificationService.notifyNewDepartmentSuggestion(null, prediction.id);
}
```

### 2.2 Budget Scheduler

**File:** `backend/services/budget-scheduler.js`

**Technology:** `node-cron` for scheduling

**Key Methods:**
```javascript
class BudgetScheduler {
  constructor() {
    this.forecastDay = 28;  // Default: 28th of each month
    this.cronJob = null;
  }
  
  startAutoForecasting() {
    // Schedule: "0 0 {day} * *" = midnight on configured day
    const cronExpression = `0 0 ${this.forecastDay} * *`;
    
    this.cronJob = cron.schedule(cronExpression, async () => {
      console.log(`[Auto Forecast] Running on day ${this.forecastDay}`);
      
      // Get all active departments
      const departments = await prisma.department.findMany({
        where: { isActive: true }
      });
      
      // Calculate next month
      const now = new Date();
      const targetYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
      const targetMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
      
      // Generate predictions for all departments
      for (const dept of departments) {
        try {
          await budgetPredictionService.generateDepartmentPrediction(
            dept.code,
            targetYear,
            targetMonth,
            null  // System-triggered, no userId
          );
        } catch (error) {
          console.error(`[Auto Forecast] Failed for ${dept.code}:`, error);
        }
      }
    });
  }
  
  updateForecastDay(newDay) {
    if (newDay < 1 || newDay > 28) throw new Error("Day must be 1-28");
    this.forecastDay = newDay;
    
    // Restart cron job with new schedule
    if (this.cronJob) this.cronJob.stop();
    this.startAutoForecasting();
  }
}
```

**Configuration Endpoint:** GET/POST `/api/department-budget/config` to view/update forecast day.

---

## Part 3: Backend API Routes

**File:** `backend/routes/department-budget.js`

### 3.1 Department Management

**POST /api/department-budget/departments**
- Create new department
- Body: `{ name, code, description }`
- Permission: Finance Manager only
- Returns: Created department record

**GET /api/department-budget/departments**
- List all departments
- Query: `?isActive=true`
- Permission: Department Head, Finance Manager
- Returns: Array of departments with budget summaries

**PATCH /api/department-budget/departments/:id**
- Update department (name, description, isActive)
- Permission: Finance Manager only

### 3.2 Monthly Budget Management

**POST /api/department-budget/monthly**
- Allocate monthly budget
- Body: `{ departmentId, year, month, allocatedAmount, notes }`
- Permission: Finance Manager only
- Logic: Create or update MonthlyBudget record
- Returns: Budget record

**GET /api/department-budget/monthly**
- List monthly budgets with filters
- Query: `?departmentId=1&year=2026&month=8`
- Permission: Department Head (own dept), Finance Manager (all)
- Returns: Array of budgets with usage rates

**GET /api/department-budget/monthly/:id**
- Get specific monthly budget details
- Includes: spentAmount, reservedAmount, usage rate, warnings
- Returns: Budget record with spending breakdown

### 3.3 AI Prediction

**POST /api/department-budget/predict**
- Manually trigger AI prediction
- Body: `{ departmentCode, targetYear, targetMonth }`
- Permission: Department Head (own dept), Finance Manager (all)
- Logic: Calls `budgetPredictionService.generateDepartmentPrediction()`
- Returns: Prediction record with AI insights

**GET /api/department-budget/predictions**
- Get prediction history
- Query: `?departmentId=1&limit=10`
- Permission: Department Head (own dept), Finance Manager (all)
- Returns: Array of predictions sorted by createdAt DESC

**GET /api/department-budget/predictions/:id**
- Get specific prediction details
- Includes: full AI insights, historical data, comparison charts
- Returns: Detailed prediction record

### 3.4 Budget Adjustment Workflow

**POST /api/department-budget/adjustments**
- Submit budget adjustment request
- Body: `{ departmentId, targetYear, targetMonth, requestType, requestedAmount, reason }`
- Permission: Department Head only
- Logic: Create request with status="pending"
- Side Effect: Notify Finance Manager
- Returns: Request record

**GET /api/department-budget/adjustments**
- List adjustment requests
- Query: `?status=pending&departmentId=1`
- Permission: Department Head (own dept), Finance Manager (all)
- Returns: Array of requests

**PATCH /api/department-budget/adjustments/:id/approve**
- Approve adjustment request
- Body: `{ reviewNotes? }`
- Permission: Finance Manager only
- Logic: 
  1. Update request status="approved"
  2. Update MonthlyBudget.allocatedAmount
  3. Notify requester and other Department Heads
- Returns: Updated request

**PATCH /api/department-budget/adjustments/:id/reject**
- Reject adjustment request
- Body: `{ reviewNotes }`
- Permission: Finance Manager only
- Logic: Update status="rejected", notify requester
- Returns: Updated request

### 3.5 Spending Tracking

**GET /api/department-budget/spending/current**
- Get current month spending for department
- Query: `?departmentId=1`
- Permission: Department Head (own dept), Finance Manager (all)
- Returns: `{ allocatedAmount, spentAmount, usageRate, warnings: [] }`

**GET /api/department-budget/spending/comparison**
- Historical comparison with presets
- Query: `?departmentId=1&preset=3months` or `?departmentId=1&startDate=2026-01-01&endDate=2026-06-30`
- Presets: `3months`, `6months`, `this_year`
- Permission: Department Head (own dept), Finance Manager (all)
- Returns: `{ periods: [{ year, month, allocated, spent, usageRate }], trend, insights }`

### 3.6 Configuration

**GET /api/department-budget/config**
- Get budget system configuration
- Returns: `{ forecastDay, notificationSettings }`

**POST /api/department-budget/config**
- Update configuration
- Body: `{ forecastDay? }`
- Permission: Finance Manager only
- Logic: Calls `budgetScheduler.updateForecastDay()`

---

## Part 4: Frontend Component Design

### 4.1 Modified Page

**budgetManagement/BudgetForecasting.tsx** (existing, modify)
- Add department selection dropdown
- Update API calls to include `?departmentId={selected}`
- Permission check: Department Head sees only their department, Finance Manager sees all
- No other changes to existing charts and statistics

### 4.2 New Pages

**budgetManagement/DepartmentBudgetOverview.tsx**
- Target user: Department Head
- Shows:
  - Current month budget card (allocated, spent, remaining, usage %)
  - AI prediction card for next month (if available)
  - Quick action: "Request Budget Adjustment"
  - Recent adjustment requests status
  - Spending trend chart (3 months)
- Components used: `PredictionCard`, `BudgetUsageChart`

**budgetManagement/FinanceBudgetDashboard.tsx**
- Target user: Finance Manager
- Shows:
  - All departments overview (table with usage rates, color-coded warnings)
  - Pending adjustment requests counter (urgent notification)
  - Recent AI predictions summary
  - Company-wide spending trends
  - Quick actions: "Allocate Budget", "Review Requests"
- Components used: `BudgetUsageChart`, `HistoricalComparison`

**budgetManagement/BudgetAdjustmentRequest.tsx**
- Target user: Department Head
- Form fields:
  - Department (auto-filled)
  - Target Month (dropdown)
  - Request Type (radio: one-time / additional)
  - Requested Amount (number input with validation)
  - Current Budget (readonly, fetched from API)
  - Reason (textarea, required)
  - AI Suggestion (readonly, shows latest prediction if available)
- Submit → POST `/api/department-budget/adjustments`
- Success → Redirect to overview with confirmation message

**budgetManagement/BudgetApprovalQueue.tsx**
- Target user: Finance Manager
- Table columns:
  - Department
  - Target Month
  - Current Budget
  - Requested Amount
  - Increase %
  - Reason (truncated, expandable)
  - Submitted By / Date
  - Actions (Approve / Reject buttons)
- Click Approve/Reject → Modal with review notes textarea
- Batch operations: Select multiple → Approve all
- Filters: Department, Status, Date range

### 4.3 New Components

**components/PredictionCard.tsx**
```tsx
interface PredictionCardProps {
  prediction: BudgetPrediction;
  onManualTrigger?: () => void;
}

// Displays:
// - Predicted amount (large number)
// - Confidence badge (high/medium/low with colors)
// - AI insights (collapsible text)
// - Category breakdown (mini pie chart)
// - Comparison with current month (up/down arrow + %)
// - Trigger info (auto/manual, timestamp)
// - "Run New Prediction" button (if onManualTrigger provided)
```

**components/BudgetUsageChart.tsx**
```tsx
interface BudgetUsageChartProps {
  allocated: number;
  spent: number;
  reserved?: number;
}

// Displays:
// - Progress bar (spent / allocated)
// - Color: green (<80%), yellow (80-99%), red (≥100%)
// - Legend: Spent, Reserved, Remaining
// - Usage percentage text
// - Warning icon if over-budget
```

**components/HistoricalComparison.tsx**
```tsx
interface HistoricalComparisonProps {
  departmentId: number;
  preset?: '3months' | '6months' | 'this_year';
  customRange?: { start: string; end: string };
}

// Displays:
// - Preset selector (3 months / 6 months / This year / Custom)
// - Date range picker (shown if "Custom" selected)
// - Line chart: Allocated vs Spent by month
// - Trend indicator (increasing/stable/decreasing)
// - Average usage rate across period
// - Insights text (e.g., "Spending trending up 15% over 6 months")
```

**components/AdjustmentRequestForm.tsx**
```tsx
interface AdjustmentRequestFormProps {
  departmentId: number;
  onSuccess: () => void;
}

// Form with validation:
// - Target month (required, future months only)
// - Request type (required)
// - Amount (required, positive number)
// - Reason (required, min 10 chars)
// - Shows AI prediction as reference (readonly)
// - Calculates new total and % increase
// - Submit button with loading state
```

---

## Part 5: Notification System Integration

### 5.1 Notification Service Functions

**File:** `backend/services/notification-service.js`

**Function 1: notifyPredictionComplete**
```javascript
async function notifyPredictionComplete(departmentId, predictionId) {
  const prediction = await prisma.budgetPrediction.findUnique({
    where: { id: predictionId },
    include: { department: true }
  });
  
  // Find Department Head(s) and Finance Manager(s)
  const recipients = await prisma.user.findMany({
    where: {
      OR: [
        { role: "Department Executive", department: prediction.department.code },
        { role: "Treasury / Finance Officer" }
      ]
    }
  });
  
  for (const user of recipients) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `AI Budget Prediction Ready - ${prediction.department.name}`,
        message: `Predicted budget for ${prediction.targetYear}-${prediction.targetMonth}: RM ${prediction.predictedAmount}. Confidence: ${prediction.confidence}.`,
        type: "INFO",
        refType: "BUDGET_PREDICTION",
        refId: String(predictionId)
      }
    });
  }
}
```

**Function 2: notifyBudgetRequestSubmitted**
```javascript
async function notifyBudgetRequestSubmitted(requestId) {
  const request = await prisma.budgetAdjustmentRequest.findUnique({
    where: { id: requestId },
    include: { department: true }
  });
  
  // Notify all Finance Managers
  const financeManagers = await prisma.user.findMany({
    where: { role: "Treasury / Finance Officer" }
  });
  
  for (const manager of financeManagers) {
    await prisma.notification.create({
      data: {
        userId: manager.id,
        title: `New Budget Adjustment Request - ${request.department.name}`,
        message: `${request.department.name} requests RM ${request.requestedAmount} for ${request.targetYear}-${request.targetMonth}. Reason: ${request.reason.substring(0, 100)}...`,
        type: "ACTION_REQUIRED",
        refType: "BUDGET_ADJUSTMENT",
        refId: String(requestId)
      }
    });
  }
}
```

**Function 3: notifyBudgetRequestApproved**
```javascript
async function notifyBudgetRequestApproved(requestId) {
  const request = await prisma.budgetAdjustmentRequest.findUnique({
    where: { id: requestId },
    include: { department: true }
  });
  
  const requester = await prisma.user.findUnique({
    where: { id: request.requestedBy }
  });
  
  // Notify requester
  await prisma.notification.create({
    data: {
      userId: requester.id,
      title: `Budget Request Approved`,
      message: `Your request for RM ${request.requestedAmount} (${request.department.name}, ${request.targetYear}-${request.targetMonth}) has been approved.`,
      type: "SUCCESS",
      refType: "BUDGET_ADJUSTMENT",
      refId: String(requestId)
    }
  });
  
  // Notify other Department Heads (transparency)
  const otherHeads = await prisma.user.findMany({
    where: {
      role: "Department Executive",
      id: { not: requester.id }
    }
  });
  
  for (const head of otherHeads) {
    await prisma.notification.create({
      data: {
        userId: head.id,
        title: `Budget Adjustment Approved - ${request.department.name}`,
        message: `${request.department.name}'s budget increased by RM ${request.requestedAmount} for ${request.targetYear}-${request.targetMonth}.`,
        type: "INFO",
        refType: "BUDGET_ADJUSTMENT",
        refId: String(requestId)
      }
    });
  }
}
```

**Function 4: notifyBudgetRequestRejected**
```javascript
async function notifyBudgetRequestRejected(requestId, reviewNotes) {
  const request = await prisma.budgetAdjustmentRequest.findUnique({
    where: { id: requestId },
    include: { department: true }
  });
  
  const requester = await prisma.user.findUnique({
    where: { id: request.requestedBy }
  });
  
  await prisma.notification.create({
    data: {
      userId: requester.id,
      title: `Budget Request Rejected`,
      message: `Your request for RM ${request.requestedAmount} (${request.department.name}, ${request.targetYear}-${request.targetMonth}) was rejected. Reason: ${reviewNotes}`,
      type: "WARNING",
      refType: "BUDGET_ADJUSTMENT",
      refId: String(requestId)
    }
  });
}
```

**Function 5: notifyLowBudget**
```javascript
async function notifyLowBudget(departmentId, budgetId, usageRate) {
  const budget = await prisma.monthlyBudget.findUnique({
    where: { id: budgetId },
    include: { department: true }
  });
  
  // Notify Department Head(s)
  const departmentHeads = await prisma.user.findMany({
    where: {
      role: "Department Executive",
      department: budget.department.code
    }
  });
  
  for (const head of departmentHeads) {
    await prisma.notification.create({
      data: {
        userId: head.id,
        title: `Budget Alert - ${Math.round(usageRate)}% Used`,
        message: `${budget.department.name} has used ${Math.round(usageRate)}% of the budget for ${budget.year}-${budget.month}. Remaining: RM ${budget.allocatedAmount - budget.spentAmount}.`,
        type: "WARNING",
        refType: "MONTHLY_BUDGET",
        refId: String(budgetId)
      }
    });
  }
}
```

**Function 6: notifyOverBudget**
```javascript
async function notifyOverBudget(departmentId, budgetId, usageRate) {
  const budget = await prisma.monthlyBudget.findUnique({
    where: { id: budgetId },
    include: { department: true }
  });
  
  // Notify Department Head(s) AND Finance Manager(s)
  const recipients = await prisma.user.findMany({
    where: {
      OR: [
        { role: "Department Executive", department: budget.department.code },
        { role: "Treasury / Finance Officer" }
      ]
    }
  });
  
  for (const user of recipients) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `OVER BUDGET - ${budget.department.name}`,
        message: `${budget.department.name} has exceeded budget for ${budget.year}-${budget.month}. Usage: ${Math.round(usageRate)}%. Over by RM ${budget.spentAmount - budget.allocatedAmount}.`,
        type: "ERROR",
        refType: "MONTHLY_BUDGET",
        refId: String(budgetId)
      }
    });
  }
}
```

**Function 7: notifyNewDepartmentSuggestion**
```javascript
async function notifyNewDepartmentSuggestion(departmentId, predictionId) {
  const prediction = await prisma.budgetPrediction.findUnique({
    where: { id: predictionId }
  });
  
  // Notify Finance Manager(s) only
  const financeManagers = await prisma.user.findMany({
    where: { role: "Treasury / Finance Officer" }
  });
  
  for (const manager of financeManagers) {
    await prisma.notification.create({
      data: {
        userId: manager.id,
        title: `New Department Budget Suggestion`,
        message: `AI suggests RM ${prediction.predictedAmount} for new department (${prediction.targetYear}-${prediction.targetMonth}). Based on similar department analysis. Review prediction for details.`,
        type: "INFO",
        refType: "BUDGET_PREDICTION",
        refId: String(predictionId)
      }
    });
  }
}
```

### 5.2 Notification Trigger Points

**Trigger 1: AI Prediction Complete**
- File: `backend/services/budget-prediction-service.js`
- Function: `generateDepartmentPrediction()`
- Location: After saving prediction to database
- Code:
```javascript
const prediction = await prisma.budgetPrediction.create({ data: {...} });
await notificationService.notifyPredictionComplete(departmentId, prediction.id);
```

**Trigger 2: Budget Request Submitted**
- File: `backend/routes/department-budget.js`
- Endpoint: `POST /api/department-budget/adjustments`
- Location: After creating adjustment request
- Code:
```javascript
const request = await prisma.budgetAdjustmentRequest.create({ data: {...} });
await notificationService.notifyBudgetRequestSubmitted(request.id);
```

**Trigger 3: Budget Request Approved**
- File: `backend/routes/department-budget.js`
- Endpoint: `PATCH /api/department-budget/adjustments/:id/approve`
- Location: After updating request status and MonthlyBudget
- Code:
```javascript
await prisma.budgetAdjustmentRequest.update({
  where: { id: requestId },
  data: { status: "approved", reviewedBy: userId, reviewedAt: new Date() }
});
await prisma.monthlyBudget.update({
  where: { id: budget.id },
  data: { allocatedAmount: newAmount }
});
await notificationService.notifyBudgetRequestApproved(requestId);
```

**Trigger 4: Budget Request Rejected**
- File: `backend/routes/department-budget.js`
- Endpoint: `PATCH /api/department-budget/adjustments/:id/reject`
- Location: After updating request status
- Code:
```javascript
await prisma.budgetAdjustmentRequest.update({
  where: { id: requestId },
  data: { status: "rejected", reviewedBy: userId, reviewedAt: new Date(), reviewNotes }
});
await notificationService.notifyBudgetRequestRejected(requestId, reviewNotes);
```

**Trigger 5 & 6: Low/Over Budget Warnings**
- **Integration Point:** Budget deduction happens when PR status changes to "APPROVED"
- **File:** `backend/routes/workflow.js` - POST /api/workflow/:store endpoint
- **Location:** After saving purchase-request records, check for newly approved PRs
- **Flow:** PR saved with status="APPROVED" → detect in workflow save handler → deduct from MonthlyBudget → check thresholds → trigger notifications
- Code:
```javascript
async function approvePurchaseRequest(prId, approverId) {
  // 1. Update PR status to APPROVED
  const pr = await prisma.purchaseRequestRecord.update({
    where: { localId: prId },
    data: {
      payload: {
        ...existingPayload,
        status: "APPROVED",
        approvedBy: approverId,
        approvedAt: new Date()
      }
    }
  });
  
  // 2. Calculate total amount from lineItems
  // NOTE: Verify actual field name in PurchaseRequestRecord.payload - may be "lineItems" or "items"
  const items = pr.payload.lineItems || pr.payload.items || [];
  const totalAmount = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || parseFloat(item.price) || 0;
    return sum + (qty * price);
  }, 0);
  
  // 3. Find department and current month's budget
  const requesterUser = await prisma.user.findUnique({
    where: { id: pr.payload.requestorId }
  });
  
  const department = await prisma.department.findFirst({
    where: {
      OR: [
        { code: { equals: requesterUser.department, mode: 'insensitive' } },
        { name: { equals: requesterUser.department, mode: 'insensitive' } }
      ]
    }
  });
  
  if (!department) {
    console.warn(`No department found for ${requesterUser.department}`);
    return;
  }
  
  const now = new Date();
  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      departmentId_year_month: {
        departmentId: department.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1
      }
    }
  });
  
  if (!budget) {
    console.warn(`No budget allocated for ${department.name} in ${now.getFullYear()}-${now.getMonth() + 1}`);
    return;
  }
  
  // 4. Update spentAmount
  const newSpentAmount = parseFloat(budget.spentAmount) + totalAmount;
  await prisma.monthlyBudget.update({
    where: { id: budget.id },
    data: { spentAmount: newSpentAmount }
  });
  
  // 5. Check usage rate and trigger notifications
  // Notification semantics: Trigger ONCE when crossing threshold from below
  // Use previousUsageRate to detect threshold crossing (not on every transaction)
  const usageRate = (newSpentAmount / parseFloat(budget.allocatedAmount)) * 100;
  const previousUsageRate = (parseFloat(budget.spentAmount) / parseFloat(budget.allocatedAmount)) * 100;
  
  if (usageRate >= 100 && previousUsageRate < 100) {
    // Crossed 100% threshold upward → notify over budget
    await notificationService.notifyOverBudget(department.id, budget.id, usageRate);
  } else if (usageRate >= 80 && usageRate < 100 && previousUsageRate < 80) {
    // Crossed 80% threshold upward (but not yet at 100%) → notify low budget
    await notificationService.notifyLowBudget(department.id, budget.id, usageRate);
  }
  // Note: If budget adjusted down then PR brings it back up, this logic will trigger again
  // Example: Budget 10k, spent 7k (70%), adjust to 8k (87.5%), no notification yet.
  //          Next PR brings spent to 8.5k (106%) → triggers over budget notification.
}
}
```

**Trigger 7: New Department Suggestion**
- File: `backend/services/budget-prediction-service.js`
- Function: `handleNewDepartment()`
- Location: After saving prediction for new department
- Code:
```javascript
const prediction = await prisma.budgetPrediction.create({
  data: {
    departmentId: null,  // New department
    targetYear,
    targetMonth,
    predictedAmount: aiSuggestion.amount,
    algorithm: "similar_dept",
    ...
  }
});
await notificationService.notifyNewDepartmentSuggestion(null, prediction.id);
```

### 5.3 Frontend Notification Handling

**File:** `client/src/FrontEnd/components/shared/NotificationBell.tsx` (existing, modify)

**Add Notification Icons:**
```typescript
const getNotificationIcon = (type: string, refType?: string) => {
  if (refType === 'BUDGET_PREDICTION') return <RiseOutlined style={{ color: '#0EA5E9' }} />;
  if (refType === 'BUDGET_ADJUSTMENT') return <DollarOutlined style={{ color: '#F59E0B' }} />;
  if (refType === 'MONTHLY_BUDGET') return <WarningOutlined style={{ color: '#F97316' }} />;
  
  // Existing icon logic...
  switch (type) {
    case 'SUCCESS': return <CheckCircleOutlined style={{ color: '#16A34A' }} />;
    case 'WARNING': return <WarningOutlined style={{ color: '#F59E0B' }} />;
    case 'ERROR': return <CloseCircleOutlined style={{ color: '#DC2626' }} />;
    default: return <InfoCircleOutlined style={{ color: '#0EA5E9' }} />;
  }
};
```

**Add Navigation on Click:**
```typescript
const handleNotificationClick = (notification: Notification) => {
  markAsRead(notification.id);
  
  if (notification.refType === 'BUDGET_PREDICTION') {
    navigate(`/budget/predictions/${notification.refId}`);
  } else if (notification.refType === 'BUDGET_ADJUSTMENT') {
    navigate(`/budget/adjustments/${notification.refId}`);
  } else if (notification.refType === 'MONTHLY_BUDGET') {
    navigate('/budget/overview');
  }
  
  // Existing navigation logic for other refTypes...
};
```

---

## Implementation Strategy

### Phase 1: Database & Core Services (Week 1)
1. Add 4 new Prisma models to schema.prisma
2. Run `npx prisma migrate dev --name add_budget_system`
3. Implement `budget-prediction-service.js` (integrate Analytics Agent)
4. Implement `budget-scheduler.js` (node-cron setup)
5. Create seed script to populate initial departments from existing User.department values

### Phase 2: Backend API (Week 2)
1. Implement `department-budget.js` routes (all 20+ endpoints)
2. Implement `notification-service.js` functions
3. Add budget deduction hook to PR approval logic
4. Write integration tests for critical flows (prediction, approval, deduction)

### Phase 3: Frontend Components (Week 3)
1. Modify `BudgetForecasting.tsx` (add department filter)
2. Build reusable components (PredictionCard, BudgetUsageChart, etc.)
3. Build new pages (DepartmentBudgetOverview, FinanceBudgetDashboard, etc.)
4. Update `NotificationBell.tsx` with budget notification handling
5. Add navigation menu items and route configuration

### Phase 4: Testing & Polish (Week 4)
1. End-to-end testing of approval workflow
2. Test automatic prediction scheduling
3. Test new department handling
4. Performance testing with large historical datasets
5. UI/UX refinement based on user feedback

---

## Key Design Decisions

### 1. No Data Migration
**Decision:** Keep `User.department` field unchanged, create new `Department` table independently.  
**Reason:** Avoid breaking existing backend logic. Use flexible lookup (match by code or name).  
**Tradeoff:** Some manual work to populate Department table, but safer than migration.

### 2. Soft Budget Limits
**Decision:** Allow `spentAmount > allocatedAmount`, show warnings instead of blocking.  
**Reason:** Real-world flexibility - emergencies happen, hard blocks cause operational issues.  
**Tradeoff:** Requires disciplined users and post-hoc review by Finance Manager.

### 3. AI as Advisor, Not Decider
**Decision:** Predictions are suggestions, users make final allocation decisions.  
**Reason:** Budget decisions have organizational/political dimensions AI can't understand.  
**Tradeoff:** Slower than full automation, but builds trust and accountability.

### 4. Configurable Auto-Prediction
**Decision:** Use node-cron with configurable trigger day (default 28th).  
**Reason:** Different organizations have different month-end dates.  
**Tradeoff:** Requires configuration management, but provides necessary flexibility.

### 5. Transparent Approval Process
**Decision:** Notify all Department Heads when any budget adjustment is approved.  
**Reason:** Builds organizational awareness, prevents "secret" budget increases.  
**Tradeoff:** More notifications, but promotes fairness.

---

## Success Criteria

1. **Functional:**
   - ✅ Department Heads can view their own budget and submit adjustment requests
   - ✅ Finance Managers can approve/reject requests and allocate monthly budgets
   - ✅ AI predictions run automatically on configured day
   - ✅ Manual predictions can be triggered anytime
   - ✅ Budget deducts when PRs reach "APPROVED" status
   - ✅ Warnings at 80% and 100% usage
   - ✅ New departments handled via similar department analysis

2. **Performance:**
   - Prediction generation < 30 seconds
   - API response time < 500ms for most endpoints
   - Frontend page load < 2 seconds

3. **User Experience:**
   - Intuitive navigation between budget views
   - Clear visual indicators for budget status (green/yellow/red)
   - Timely notifications delivered within 1 minute
   - AI insights readable and actionable

4. **Data Integrity:**
   - Budget deductions accurate to 2 decimal places
   - No double-deduction of approved PRs
   - Audit trail for all budget changes
   - Historical predictions preserved for analysis

---

## Future Enhancements

1. **Multi-Currency Support:** Currently assumes MYR (RM), extend to support USD, SGD, etc.
2. **Budget Templates:** Pre-fill new month budgets based on previous month or AI suggestion.
3. **Advanced Analytics:** Trend forecasting beyond 1 month, anomaly detection.
4. **Integration with Accounting:** Sync with QuickBooks/Xero for reconciliation.
5. **Mobile App:** Native iOS/Android app for on-the-go budget approvals.
6. **Fiscal Year Support:** Currently monthly, extend to quarterly/annual cycles.
7. **Role Hierarchy:** Support multi-level approvals (Department Head → Director → CFO).

---

## Technical Notes

### Analytics Agent Integration
The existing Analytics Agent (`backend/agents/analytics/analytics-agent.js`) already has sophisticated forecasting capabilities via the `predict_future_spending` tool. This tool uses **Holt-Winters Triple Exponential Smoothing**, which is more advanced than the current 3-period moving average in `budget.js`.

**Integration Approach:**
- Budget Prediction Service calls `analyticsAgent.chat()` with a prediction request
- Analytics Agent's tool-calling framework triggers `predict_future_spending`
- Response is parsed and saved to `BudgetPrediction` table
- No changes needed to Analytics Agent itself - pure integration

### Database Constraints
- **Unique Constraint:** `MonthlyBudget` uses `@@unique([departmentId, year, month])` to prevent duplicate allocations
- **Indexes:** Added on `[departmentId, status]`, `[year, month]`, `[createdAt]` for query performance
- **Decimal Precision:** All money fields use `Decimal(15, 2)` for accuracy (15 digits total, 2 after decimal)

### Permission Model
- **Department Executive** (Department Head): Can view own department, submit adjustment requests, trigger manual predictions
- **Treasury / Finance Officer** (Finance Manager): Can view all departments, approve/reject requests, allocate budgets, configure system
- Permission checks in every route using `req.user.role` from JWT middleware

### Notification Delivery
- Uses existing `Notification` model (no schema changes needed)
- `refType` field identifies notification category (`BUDGET_PREDICTION`, `BUDGET_ADJUSTMENT`, `MONTHLY_BUDGET`)
- `refId` stores the related record's ID for navigation
- Frontend `NotificationBell` component handles routing based on `refType`

---

## Risk Mitigation

### Risk 1: Historical Data Quality
**Risk:** Inaccurate or incomplete Purchase Request data leads to bad predictions.  
**Mitigation:** 
- Require minimum 3 months of historical data before using Holt-Winters
- Fall back to simpler moving average if data is sparse
- Display confidence level to users (low/medium/high)
- Allow manual override of predictions

### Risk 2: Department Mapping Ambiguity
**Risk:** `User.department` field contains inconsistent values ("Engineering" vs "ENG" vs "engineering").  
**Mitigation:**
- Flexible lookup using both `Department.code` and `Department.name`
- Case-insensitive matching
- Admin UI to review and standardize department assignments
- Seed script to detect and report mismatches

### Risk 3: Budget Gaming
**Risk:** Department Heads submit inflated adjustment requests knowing Finance Manager will negotiate down.  
**Mitigation:**
- Display historical spending trends in request form (transparency)
- Show AI prediction alongside request (benchmark)
- Notify all Department Heads of approved adjustments (peer pressure)
- Finance Manager can add review notes explaining decisions

### Risk 4: Scheduler Reliability
**Risk:** Node-cron job fails or misses scheduled run.  
**Mitigation:**
- Log all scheduler runs to audit trail
- Alerting if no predictions generated for >7 days
- Manual trigger endpoint as fallback
- Consider moving to dedicated job queue (Bull/BullMQ) in future

### Risk 5: Over-Budget Abuse
**Risk:** Soft limits allow unlimited over-spending.  
**Mitigation:**
- Immediate notification to Finance Manager at 100%
- Dashboard showing all over-budget departments (red flags)
- Monthly review process baked into workflow
- Future enhancement: escalating approval requirements at 120%, 150%

---

## Appendix: API Response Examples

### Prediction Response
```json
{
  "success": true,
  "data": {
    "id": 42,
    "departmentId": 3,
    "targetYear": 2026,
    "targetMonth": 9,
    "predictedAmount": "125000.00",
    "confidence": "high",
    "algorithm": "holt_winters",
    "aiInsights": "Based on seasonal trends, September typically sees 15% increase due to Q3 project kickoffs. Historical average: RM 110,000. Recommended allocation: RM 125,000 with 10% buffer.",
    "categoryBreakdown": {
      "Raw Materials": 45000,
      "Equipment": 35000,
      "Services": 25000,
      "Miscellaneous": 20000
    },
    "comparisonData": {
      "lastMonth": 118000,
      "last3MonthsAvg": 112000,
      "last6MonthsAvg": 105000,
      "yearToDateTotal": 850000
    },
    "triggerType": "auto",
    "createdAt": "2026-08-28T00:05:23.456Z"
  }
}
```

### Monthly Budget Response
```json
{
  "success": true,
  "data": {
    "id": 156,
    "departmentId": 3,
    "year": 2026,
    "month": 8,
    "allocatedAmount": "120000.00",
    "spentAmount": "95000.00",
    "reservedAmount": "0.00",
    "usageRate": 79.17,
    "remaining": "25000.00",
    "status": "active",
    "warnings": [],
    "department": {
      "id": 3,
      "name": "Engineering",
      "code": "ENG"
    }
  }
}
```

### Adjustment Request Response
```json
{
  "success": true,
  "data": {
    "id": 89,
    "departmentId": 3,
    "targetYear": 2026,
    "targetMonth": 9,
    "requestType": "one_time_increase",
    "requestedAmount": "135000.00",
    "currentBudget": "120000.00",
    "increasePercent": 12.5,
    "reason": "Urgent hardware refresh required for Q3 project delivery. Original budget insufficient after supplier price increase.",
    "status": "pending",
    "requestedBy": 45,
    "requester": {
      "name": "Alice Chen",
      "email": "alice@company.com"
    },
    "requestedAt": "2026-08-29T10:15:00.000Z"
  }
}
```

---

**End of Design Document**
