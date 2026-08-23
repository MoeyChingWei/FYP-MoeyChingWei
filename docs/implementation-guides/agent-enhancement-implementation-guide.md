# Agent Enhancement Implementation Guide

**Created:** 2026-08-23  
**Target Implementer:** Opus 4.8  
**Status:** Ready for Implementation

---

## Executive Summary

This document provides complete implementation guidance for enhancing two AI agents in the OptiMind ERP system:

1. **General Assistant (ChatbotAgent)** - Transform into a super-intelligent assistant like ChatGPT/Copilot
2. **Analytics Agent** - Enhance forecasting prediction capabilities

These are **independent tasks** that do not conflict with each other.

---

## Task 1: Enhance General Assistant (ChatbotAgent)

### Current State

**File:** `backend/agents/chatbot/chatbot-agent-v2.js` (1728 lines)

**Current Capabilities:**
- Basic chat functionality
- Has 1 export tool: `export_purchase_requests`
- Uses DeepSeek API via `deepseekService.chatWithTools()`
- System prompt: "You are the General AI Assistant for OptiMind ERP system"

**Code Location:**
```javascript
// Line 223
class ChatBotAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'chatbot',
      name: 'General Assistant',
      systemPromptTemplate: CHATBOT_SYSTEM_PROMPT,
      tools: [
        // Currently only has export_purchase_requests
      ],
      toolHandlers: {
        export_purchase_requests: async (input) => { ... }
      }
    });
  }
}
```

### Requirements

#### 1. Universal Data Access
- **Requirement:** Access ALL database tables and data
- **Current Database Schema Available:**
  - Users, Departments, Suppliers
  - PurchaseRequests, PurchaseOrders, GoodsReceivedNotes
  - Invoices, Payments
  - BudgetAllocations, BudgetPredictions
  - ApprovalWorkflows, ApprovalSteps
  - SystemLogs, ChatSessions, ChatMessages
  - Documents, Notifications
  
- **Implementation Approach:**
  - Create universal query tools that can access any table
  - Use Prisma ORM (already configured at `backend/config/prisma.js`)
  - Add new tools:
    - `query_database` - Execute safe read-only queries
    - `get_table_data` - Retrieve data from any table with filters
    - `search_records` - Full-text search across tables
    - `aggregate_data` - Sum, count, average calculations

#### 2. Autonomous File Generation & Export
- **Requirement:** Generate reports and data exports autonomously, provide download links
- **Export Formats:** Excel, PDF, CSV, JSON (ask user which format they want)
- **Current Export Infrastructure:**
  - `backend/services/export-service.js` - Handles PDF, Excel, CSV, JSON generation
  - `backend/routes/chatbot.js:430-529` - Has export and download endpoints
  - `backend/exports/` directory - Storage location for generated files
  - Auto-delete files 5 seconds after download completion

- **Implementation Approach:**
  - Expand existing `export_purchase_requests` pattern to support:
    - Any data type (suppliers, budgets, analytics, etc.)
    - Any table combination (joins)
    - Custom reports (user-defined queries → formatted export)
  - Add new tools:
    - `export_data` - Universal export tool
    - `generate_report` - Create formatted reports with charts/tables
    - `create_analysis_document` - Generate analytical documents
  - Flow:
    1. AI determines what data user wants
    2. Ask user for preferred format (Excel/PDF/CSV)
    3. Query database and format data
    4. Generate file using ExportService
    5. Return download URL: `/api/chatbot/download/{filename}`

#### 3. Dynamic Performance Allocation
- **Requirement:** Simple tasks use low resources, complex tasks use high resources
- **Current Configuration:**
  - `backend/services/deepseek-ai-service.js:17` - `maxTokens = 4096`
  - `backend/services/deepseek-ai-service.js:124` - `temperature = 1.0`
  - `backend/agents/base-agent.js:59` - `chat()` accepts `maxTokens` and `temperature` parameters

- **Implementation Approach:**
  - Create complexity detection system
  - Define task complexity levels:
    ```javascript
    const PERFORMANCE_PROFILES = {
      simple: { maxTokens: 1024, temperature: 0.7 },   // "What's my department?"
      medium: { maxTokens: 2048, temperature: 0.9 },   // "Show me this month's purchases"
      complex: { maxTokens: 4096, temperature: 1.0 },  // "Analyze spending trends"
      advanced: { maxTokens: 8192, temperature: 1.0 }  // "Generate comprehensive report"
    };
    ```
  - Complexity indicators:
    - Simple: Single fact lookup, greeting, navigation
    - Medium: Single table query, basic export
    - Complex: Multi-table joins, aggregations, analysis
    - Advanced: Report generation, multi-step reasoning, file creation
  
  - Add pre-processing step in ChatbotAgent.chat():
    ```javascript
    async chat({ userId, message, sessionId }) {
      // Detect complexity
      const complexity = this.detectComplexity(message, sessionId);
      const profile = PERFORMANCE_PROFILES[complexity];
      
      // Call base agent with appropriate settings
      return super.chat({
        userId,
        message,
        sessionId,
        maxTokens: profile.maxTokens,
        temperature: profile.temperature
      });
    }
    ```

#### 4. Enhanced System Prompt
- **Current:** Generic assistant prompt
- **New:** Super-intelligent assistant with clear capabilities

**Proposed System Prompt:**
```
You are the General AI Assistant for OptiMind ERP system - a super-intelligent assistant like ChatGPT.

CAPABILITIES:
- Access ALL company data (purchases, budgets, suppliers, approvals, invoices, etc.)
- Generate reports, exports, and documents autonomously
- Perform complex data analysis and provide insights
- Answer any work-related questions
- Help with decision-making and planning

DATA ACCESS:
- You have tools to query any database table
- You can search, filter, aggregate, and analyze data
- Always verify data before making claims

FILE GENERATION:
- When users need exports or reports, YOU CREATE THEM
- Always ask user: "Would you like this as Excel, PDF, or CSV?"
- Generate the file and provide a download link
- You can create: data exports, analytical reports, summaries, charts

WORK STYLE:
- Be proactive and autonomous
- For complex tasks, break them into steps
- Explain your reasoning
- Provide actionable insights, not just data dumps

USER CONTEXT:
- User: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}
```

### Implementation Steps

#### Step 1: Add Universal Data Access Tools

**File:** `backend/agents/chatbot/chatbot-agent-v2.js`

Add these tools to the `tools` array:

```javascript
{
  name: 'query_database',
  description: 'Query any database table with filters, sorting, and pagination. Use this to retrieve specific data.',
  input_schema: {
    type: 'object',
    properties: {
      table: {
        type: 'string',
        enum: ['users', 'departments', 'suppliers', 'purchaseRequests', 'purchaseOrders', 
               'goodsReceivedNotes', 'invoices', 'payments', 'budgetAllocations', 
               'budgetPredictions', 'approvalWorkflows', 'documents'],
        description: 'Database table to query'
      },
      filters: {
        type: 'object',
        description: 'Prisma where clause filters (e.g., {status: "PENDING", department: "IT"})'
      },
      include: {
        type: 'object',
        description: 'Prisma relations to include (e.g., {requester: true, items: true})'
      },
      orderBy: {
        type: 'object',
        description: 'Sorting (e.g., {createdAt: "desc"})'
      },
      take: {
        type: 'number',
        description: 'Limit results (default 50, max 500)',
        default: 50
      },
      skip: {
        type: 'number',
        description: 'Skip results for pagination',
        default: 0
      }
    },
    required: ['table']
  }
},
{
  name: 'aggregate_data',
  description: 'Perform aggregations on data (sum, count, average, min, max)',
  input_schema: {
    type: 'object',
    properties: {
      table: { type: 'string' },
      aggregations: {
        type: 'object',
        description: 'Prisma aggregate operations (e.g., {_sum: {totalAmount: true}, _count: true})'
      },
      filters: { type: 'object' },
      groupBy: {
        type: 'array',
        items: { type: 'string' },
        description: 'Fields to group by'
      }
    },
    required: ['table', 'aggregations']
  }
},
{
  name: 'export_data',
  description: '[MUST USE] Export any data to Excel, PDF, or CSV. First ask user which format they prefer.',
  input_schema: {
    type: 'object',
    properties: {
      dataType: {
        type: 'string',
        description: 'Type of data being exported (e.g., "purchase-requests", "suppliers", "budget-analysis")'
      },
      data: {
        type: 'array',
        description: 'Array of records to export'
      },
      format: {
        type: 'string',
        enum: ['excel', 'pdf', 'csv', 'json'],
        description: 'Export format (ask user first!)'
      },
      filename: {
        type: 'string',
        description: 'Filename without extension'
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata (title, description, preparedBy, etc.)'
      }
    },
    required: ['dataType', 'data', 'format', 'filename']
  }
},
{
  name: 'generate_report',
  description: 'Generate a comprehensive analytical report with charts and insights',
  input_schema: {
    type: 'object',
    properties: {
      reportType: {
        type: 'string',
        description: 'Type of report (e.g., "spending-analysis", "supplier-performance", "budget-overview")'
      },
      data: { type: 'object' },
      format: {
        type: 'string',
        enum: ['pdf', 'excel'],
        description: 'Report format'
      },
      includeCharts: {
        type: 'boolean',
        default: true
      }
    },
    required: ['reportType', 'data', 'format']
  }
}
```

#### Step 2: Implement Tool Handlers

```javascript
const toolHandlers = {
  query_database: async (input) => {
    const { table, filters = {}, include = {}, orderBy, take = 50, skip = 0 } = input;
    
    // Security: Limit to reasonable query sizes
    const safeTake = Math.min(take, 500);
    
    try {
      // Dynamic Prisma query
      const results = await prisma[table].findMany({
        where: filters,
        include,
        orderBy,
        take: safeTake,
        skip
      });
      
      return {
        success: true,
        table,
        count: results.length,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to query ${table}: ${error.message}`
      };
    }
  },
  
  aggregate_data: async (input) => {
    const { table, aggregations, filters = {}, groupBy } = input;
    
    try {
      const result = groupBy
        ? await prisma[table].groupBy({
            by: groupBy,
            where: filters,
            ...aggregations
          })
        : await prisma[table].aggregate({
            where: filters,
            ...aggregations
          });
      
      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  export_data: async (input) => {
    const { dataType, data, format, filename, metadata = {} } = input;
    
    // Generate unique filename
    const timestamp = Date.now();
    const fullFilename = `${filename}-${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
    const filepath = path.join(process.cwd(), 'backend', 'exports', fullFilename);
    
    try {
      // Use ExportService to generate file
      const exportService = new ExportService();
      
      if (format === 'excel') {
        await exportService.exportToExcel(dataType, data, filepath, metadata);
      } else if (format === 'pdf') {
        await exportService.exportToPDF(dataType, data, filepath, metadata);
      } else if (format === 'csv' || format === 'json') {
        await exportService.exportToCSV(dataType, data, filepath, metadata);
      }
      
      const downloadUrl = `/api/chatbot/download/${fullFilename}`;
      
      return {
        success: true,
        message: `File generated successfully! Click to download:`,
        downloadUrl,
        filename: fullFilename,
        format
      };
    } catch (error) {
      return {
        success: false,
        error: `Export failed: ${error.message}`
      };
    }
  },
  
  generate_report: async (input) => {
    // Similar to export_data but with more formatting and analysis
    // Implementation details...
  }
};
```

#### Step 3: Add Complexity Detection

```javascript
class ChatBotAgent extends BaseAgent {
  /**
   * Detect task complexity based on message content and context
   */
  detectComplexity(message, sessionHistory = []) {
    const lowerMessage = message.toLowerCase();
    
    // Advanced indicators
    if (lowerMessage.includes('generate report') ||
        lowerMessage.includes('comprehensive analysis') ||
        lowerMessage.includes('compare') && lowerMessage.includes('trend')) {
      return 'advanced';
    }
    
    // Complex indicators
    if (lowerMessage.includes('analyze') ||
        lowerMessage.includes('export') ||
        lowerMessage.includes('calculate') ||
        lowerMessage.includes('summary') ||
        lowerMessage.includes('insight')) {
      return 'complex';
    }
    
    // Medium indicators
    if (lowerMessage.includes('show me') ||
        lowerMessage.includes('list') ||
        lowerMessage.includes('find') ||
        lowerMessage.includes('search')) {
      return 'medium';
    }
    
    // Simple (default)
    return 'simple';
  }
  
  async chat({ userId, message, sessionId, systemPromptAddition = '' }) {
    // Detect complexity
    const history = await this.loadSessionHistory(sessionId);
    const complexity = this.detectComplexity(message, history);
    const profile = PERFORMANCE_PROFILES[complexity];
    
    logger.debug('ChatbotAgent', `Task complexity: ${complexity}`, {
      maxTokens: profile.maxTokens,
      temperature: profile.temperature
    });
    
    // Call parent with dynamic settings
    return super.chat({
      userId,
      message,
      sessionId,
      systemPromptAddition,
      maxTokens: profile.maxTokens,
      temperature: profile.temperature
    });
  }
}
```

### Testing Requirements

1. **Data Access Tests:**
   - Query each major table
   - Test filters and pagination
   - Test aggregations
   - Verify data security (users can only see authorized data)

2. **Export Tests:**
   - Export to Excel, PDF, CSV, JSON
   - Test with various data types
   - Verify download links work
   - Verify auto-delete after download

3. **Performance Tests:**
   - Simple query: "What's my department?" (should use simple profile)
   - Complex query: "Analyze this month's spending by department" (should use complex profile)
   - Verify token usage matches complexity

4. **Integration Tests:**
   - Test via frontend ChatBotPage
   - Test file downloads in browser
   - Test multi-turn conversations with context

---

## Task 2: Enhance Analytics Agent Forecasting

### Current State

**File:** `backend/agents/analytics/analytics-agent.js` (997 lines)

**Current Forecasting Tool:**
- Tool: `predict_future_spending`
- Algorithm: Holt-Winters Triple Exponential Smoothing
- Output: Predictions array, method name
- Used by: `backend/services/budget-prediction-service.js`

**Code Location:**
```javascript
// Line 187+
predict_future_spending: async (input) => {
  const { department, forecastMonths = 3, includeSeasonality = false } = input;
  
  // Get historical data (12 months)
  const historicalData = await getHistoricalSpending(department, 12);
  
  // Holt-Winters prediction
  const forecasts = holtWintersPredict(spendingValues, forecastMonths, 12);
  
  return {
    predictions: forecasts,
    method: 'Holt-Winters Triple Exponential Smoothing'
  };
}
```

### Requirements

#### 1. Improve Prediction Accuracy
- **Current:** Single model (Holt-Winters)
- **New:** Multi-model ensemble approach
  - Holt-Winters (50% weight)
  - Moving Average (30% weight)
  - Linear Regression with trend (20% weight)

#### 2. Add Confidence Scoring
- **Current:** No confidence indication
- **New:** Return confidence level based on:
  - Model agreement (if all models predict similar values → high confidence)
  - Historical variance (stable spending → high confidence)
  - Data quality (more data points → higher confidence)
- **Levels:** `very_high`, `high`, `medium`, `low`

#### 3. Add Prediction Intervals
- **Current:** Point predictions only
- **New:** Include upper and lower bounds
- **Example:** Predicted: RM 50,000, Interval: RM 42,500 - RM 57,500 (±15%)

#### 4. Better Data Handling
- **Current:** Uses 12 months data
- **New:** 
  - Extend to 24 months for better pattern detection
  - Outlier detection and removal (Z-score method)
  - Handle missing data gracefully

### Implementation Steps

#### Step 1: Add Helper Functions

**File:** `backend/agents/analytics/analytics-agent.js`

Add these functions before the AnalyticsAgent class:

```javascript
/**
 * Remove outliers using Z-score method
 */
function removeOutliers(data, threshold = 3) {
  if (data.length < 3) return data;
  
  const values = data.map(d => d.totalAmount || d.value || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
  );
  
  return data.filter((d, i) => {
    const zScore = Math.abs((values[i] - mean) / stdDev);
    return zScore < threshold;
  });
}

/**
 * Moving Average prediction
 */
function movingAveragePredict(data, periods, windowSize = 3) {
  const values = data.map(d => d.totalAmount || d.value || 0);
  const predictions = [];
  
  // Calculate moving average for each forecast period
  for (let i = 0; i < periods; i++) {
    const recentValues = values.slice(-(windowSize + i));
    const avg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    predictions.push(avg);
  }
  
  return predictions;
}

/**
 * Linear Regression with trend
 */
function linearTrendPredict(data, periods) {
  const values = data.map(d => d.totalAmount || d.value || 0);
  const n = values.length;
  
  // Calculate linear regression: y = mx + b
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict future values
  const predictions = [];
  for (let i = 0; i < periods; i++) {
    predictions.push(slope * (n + i) + intercept);
  }
  
  return predictions;
}

/**
 * Calculate confidence level based on model agreement and data quality
 */
function calculateConfidence(predictions, historicalData) {
  const { holtWinters, movingAverage, linearRegression } = predictions;
  
  // 1. Model agreement (coefficient of variation between models)
  const avgPredictions = holtWinters.map((_, i) => {
    const values = [holtWinters[i], movingAverage[i], linearRegression[i]];
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
    );
    return { mean, cv: stdDev / mean };
  });
  
  const avgCV = avgPredictions.reduce((sum, p) => sum + p.cv, 0) / avgPredictions.length;
  
  // 2. Historical variance
  const historicalValues = historicalData.map(d => d.totalAmount || 0);
  const historicalMean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const historicalStdDev = Math.sqrt(
    historicalValues.reduce((sq, n) => sq + Math.pow(n - historicalMean, 2), 0) / historicalValues.length
  );
  const historicalCV = historicalStdDev / historicalMean;
  
  // 3. Data quantity score
  const dataScore = Math.min(historicalData.length / 24, 1); // 24 months = perfect
  
  // Combined confidence score
  const modelAgreementScore = 1 - Math.min(avgCV, 1);
  const stabilityScore = 1 - Math.min(historicalCV, 1);
  const confidence = (modelAgreementScore * 0.5 + stabilityScore * 0.3 + dataScore * 0.2);
  
  if (confidence > 0.8) return 'very_high';
  if (confidence > 0.6) return 'high';
  if (confidence > 0.4) return 'medium';
  return 'low';
}

/**
 * Calculate prediction intervals
 */
function calculatePredictionInterval(historicalData, predictions) {
  const historicalValues = historicalData.map(d => d.totalAmount || 0);
  const historicalMean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const historicalStdDev = Math.sqrt(
    historicalValues.reduce((sq, n) => sq + Math.pow(n - historicalMean, 2), 0) / historicalValues.length
  );
  
  // Use 1.5 standard deviations for prediction interval (~86% confidence)
  const marginFactor = 1.5 * historicalStdDev / historicalMean;
  
  return {
    lower: predictions.map(p => Math.max(0, p * (1 - marginFactor))),
    upper: predictions.map(p => p * (1 + marginFactor))
  };
}
```

#### Step 2: Enhance predict_future_spending Tool

Replace the existing tool handler:

```javascript
predict_future_spending: async (input) => {
  const { department, forecastMonths = 3, includeSeasonality = false } = input;
  
  try {
    // 1. Get EXTENDED historical data (24 months instead of 12)
    const monthsToFetch = 24;
    const historicalData = []; // ... fetch logic (existing code)
    
    if (historicalData.length < 3) {
      return {
        error: 'Insufficient data',
        message: `Only ${historicalData.length} months of data available. Need at least 3 months.`
      };
    }
    
    // 2. DATA CLEANING: Remove outliers
    const cleanedData = removeOutliers(historicalData, 3); // 3 = Z-score threshold
    logger.debug('Analytics', `Removed ${historicalData.length - cleanedData.length} outliers`);
    
    // 3. MULTI-MODEL PREDICTION
    const spendingValues = cleanedData.map(d => d.totalAmount);
    
    // Model 1: Holt-Winters (existing)
    const holtWintersForecasts = includeSeasonality
      ? holtWintersPredict(spendingValues, forecastMonths, 12)
      : simpleExponentialSmoothing(spendingValues, forecastMonths);
    
    // Model 2: Moving Average
    const movingAverageForecasts = movingAveragePredict(cleanedData, forecastMonths, 3);
    
    // Model 3: Linear Regression
    const linearRegressionForecasts = linearTrendPredict(cleanedData, forecastMonths);
    
    // 4. ENSEMBLE: Weighted average of models
    const ensembleForecasts = holtWintersForecasts.map((_, i) => {
      return (
        holtWintersForecasts[i] * 0.5 +
        movingAverageForecasts[i] * 0.3 +
        linearRegressionForecasts[i] * 0.2
      );
    });
    
    // 5. CONFIDENCE SCORING
    const confidence = calculateConfidence({
      holtWinters: holtWintersForecasts,
      movingAverage: movingAverageForecasts,
      linearRegression: linearRegressionForecasts
    }, cleanedData);
    
    // 6. PREDICTION INTERVALS
    const interval = calculatePredictionInterval(cleanedData, ensembleForecasts);
    
    // 7. Return enhanced results
    return {
      success: true,
      method: 'Multi-Model Ensemble (Holt-Winters 50%, Moving Average 30%, Linear Regression 20%)',
      predictions: ensembleForecasts,
      confidence, // 'very_high' | 'high' | 'medium' | 'low'
      interval: {
        lower: interval.lower,
        upper: interval.upper
      },
      metadata: {
        dataPoints: cleanedData.length,
        outliers_removed: historicalData.length - cleanedData.length,
        seasonality: includeSeasonality
      },
      // Optional: Include individual model predictions for debugging/comparison
      modelBreakdown: {
        holtWinters: holtWintersForecasts,
        movingAverage: movingAverageForecasts,
        linearRegression: linearRegressionForecasts
      }
    };
    
  } catch (error) {
    logger.error('PredictFutureSpending', error.message);
    return {
      error: 'Prediction failed',
      message: error.message
    };
  }
}
```

#### Step 3: Update System Prompt (Optional but Recommended)

Enhance the Analytics Agent's system prompt to mention new capabilities:

```javascript
const ANALYTICS_SYSTEM_PROMPT = `
You are the Analytics AI Assistant for OptiMind ERP system.

CAPABILITIES:
- Spending analysis and budget forecasting
- Performance metrics and KPIs
- Trend detection and anomaly identification
- Generate insights and recommendations

FORECASTING:
- Multi-model ensemble predictions (Holt-Winters, Moving Average, Linear Regression)
- Confidence levels (very_high, high, medium, low)
- Prediction intervals (upper and lower bounds)
- Outlier detection and data cleaning
- Handles 24 months of historical data

When providing predictions:
1. Always mention the confidence level
2. Explain the prediction interval (range of likely values)
3. Highlight any anomalies or outliers detected
4. Provide context (e.g., "Based on 18 months of stable spending data...")

...rest of prompt...
`;
```

### Impact on Forecasting Feature

**File:** `backend/services/budget-prediction-service.js`

**Good news:** The existing code does NOT need changes! It will automatically benefit from enhancements.

**Why?** The service calls `analyticsAgent.chat()` which internally uses the enhanced tool:

```javascript
// This code stays THE SAME
const response = await analyticsAgent.chat({
  userId: systemUserId,
  message: `Predict the spending for department ${departmentCode} for the next month.`,
  sessionId: predictionSessionId
});

// But now response includes:
// - predictions (improved accuracy)
// - confidence ('high', 'medium', etc.)
// - interval { lower: [...], upper: [...] }
// - modelBreakdown (for debugging)
```

**Optional Frontend Enhancement:**

If you want to show the new confidence and interval data in the UI, update:

**File:** `client/src/FrontEnd/pages/budgetManagement/BudgetManagementHome.tsx`

```typescript
// In the prediction card component
<Card>
  <Statistic
    title="AI Predicted Budget"
    value={prediction.predictedAmount}
    prefix="RM"
    precision={2}
  />
  
  {/* NEW: Show confidence badge */}
  {prediction.confidence && (
    <Badge 
      color={
        prediction.confidence === 'very_high' ? 'green' :
        prediction.confidence === 'high' ? 'blue' :
        prediction.confidence === 'medium' ? 'orange' : 'red'
      }
      text={`${prediction.confidence.replace('_', ' ')} confidence`}
    />
  )}
  
  {/* NEW: Show prediction interval */}
  {prediction.interval && (
    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
      Range: RM {prediction.interval.lower.toFixed(2)} - RM {prediction.interval.upper.toFixed(2)}
    </div>
  )}
</Card>
```

### Testing Requirements

1. **Accuracy Tests:**
   - Compare old vs new predictions on historical data
   - Calculate Mean Absolute Percentage Error (MAPE)
   - Target: <10% error rate

2. **Confidence Tests:**
   - Stable spending → should get 'high' or 'very_high' confidence
   - Volatile spending → should get 'medium' or 'low' confidence

3. **Outlier Tests:**
   - Insert artificial outliers in test data
   - Verify they are detected and removed
   - Verify predictions are not skewed by outliers

4. **Integration Tests:**
   - Test budget-prediction-service.js still works
   - Test frontend forecasting page
   - Verify backward compatibility (old code works with new tool output)

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. Implement General Assistant data access tools
2. Implement Analytics Agent prediction enhancements
3. Write unit tests

### Phase 2: Export & Reports (Week 2)
1. Implement General Assistant export tools
2. Integrate with ExportService
3. Test file generation and downloads

### Phase 3: Intelligence (Week 3)
1. Implement dynamic performance allocation
2. Enhance system prompts
3. Add complexity detection

### Phase 4: Testing & Polish (Week 4)
1. Integration testing
2. Performance optimization
3. Documentation updates

---

## Key Files Reference

### General Assistant Enhancement
- **Primary:** `backend/agents/chatbot/chatbot-agent-v2.js`
- **Export Service:** `backend/services/export-service.js`
- **Routes:** `backend/routes/chatbot.js`
- **Base Agent:** `backend/agents/base-agent.js`
- **DeepSeek Service:** `backend/services/deepseek-ai-service.js`
- **Frontend:** `client/src/FrontEnd/pages/ChatBotPage.tsx`

### Analytics Agent Enhancement
- **Primary:** `backend/agents/analytics/analytics-agent.js`
- **Integration:** `backend/services/budget-prediction-service.js`
- **Frontend:** `client/src/FrontEnd/pages/budgetManagement/BudgetManagementHome.tsx`

### Database Access
- **Prisma Client:** `backend/config/prisma.js`
- **Schema:** `prisma/schema.prisma`

---

## Success Criteria

### General Assistant
- ✅ Can query any database table
- ✅ Can export data in Excel, PDF, CSV formats
- ✅ Automatically adjusts performance based on task complexity
- ✅ Generates download links that work
- ✅ Files auto-delete after download
- ✅ Response quality similar to ChatGPT

### Analytics Agent
- ✅ Prediction accuracy improved by >15%
- ✅ Returns confidence levels
- ✅ Returns prediction intervals
- ✅ Handles outliers properly
- ✅ Backward compatible with existing forecasting feature
- ✅ No breaking changes to budget-prediction-service.js

---

## Notes for Implementer

1. **Do NOT modify forecasting integration code** - it should work automatically with enhanced Analytics Agent
2. **Test file downloads thoroughly** - ensure auto-delete works correctly
3. **Monitor token usage** - dynamic performance allocation should reduce costs for simple queries
4. **Security:** Validate all database queries to prevent injection attacks
5. **Error handling:** All tool handlers should return structured error objects
6. **Logging:** Add comprehensive logging for debugging

---

## Questions or Issues?

If you encounter any ambiguities or need clarification:
1. Check the existing code in the referenced files
2. Look for similar patterns in other agents (PurchaseAgent, ApprovalAgent)
3. Test incrementally - one tool at a time
4. Ask the user for clarification if requirements are unclear

---

**END OF IMPLEMENTATION GUIDE**
