# 🤖 Chatbot Core Technical Details - 核心技术详细信息

**Last Updated:** 2026-08-23  
**Document Type:** Technical Reference  
**Audience:** Developers, System Architects

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [AI Service Integration](#ai-service-integration)
4. [Database Schema](#database-schema)
5. [Tool System](#tool-system)
6. [Message Flow](#message-flow)
7. [Session Management](#session-management)
8. [File Handling](#file-handling)
9. [API Endpoints](#api-endpoints)
10. [Security & Performance](#security--performance)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ChatBotPage  │  │ ChatWindow   │  │ MessageList  │      │
│  │   (.tsx)     │  │   (.tsx)     │  │   (.tsx)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │    React Components                 │
          │    State Management (useState)      │
          │    API Calls (fetch)                │
          │                                     │
┌─────────┼──────────────────┼──────────────────┼─────────────┐
│         │   API Routes Layer (Express)        │              │
│  ┌──────▼───────────────────▼─────────────────▼─────┐       │
│  │         /api/chatbot/*                            │       │
│  │  ┌────────────────────────────────────────┐      │       │
│  │  │  POST /chat                            │      │       │
│  │  │  POST /chat/stream                     │      │       │
│  │  │  GET  /sessions                        │      │       │
│  │  │  GET  /history/:sessionId              │      │       │
│  │  │  POST /export-purchase-requests        │      │       │
│  │  └────────────────────────────────────────┘      │       │
│  └───────────────────────┬────────────────────────────      │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│      Agent Layer         │                                   │
│  ┌────────────────────────▼──────────────────────┐          │
│  │      chatbot-agent-v2.js                      │          │
│  │  ┌──────────────────────────────────────┐    │          │
│  │  │  • chat()                            │    │          │
│  │  │  • chatStream()                      │    │          │
│  │  │  • defineTools()                     │    │          │
│  │  │  • defineToolHandlers()              │    │          │
│  │  │  • handlePurchaseRequestFlow()       │    │          │
│  │  └──────────────────────────────────────┘    │          │
│  └───────────────────────┬────────────────────────          │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│    AI Service Layer      │                                   │
│  ┌────────────────────────▼──────────────────────┐          │
│  │    deepseek-ai-service.js                     │          │
│  │  ┌──────────────────────────────────────┐    │          │
│  │  │  • chat()                            │    │          │
│  │  │  • chatWithTools()                   │    │          │
│  │  │  • chatWithRetry()                   │    │          │
│  │  └──────────────────────────────────────┘    │          │
│  │                                               │          │
│  │    vision-ai-service.js                      │          │
│  │  ┌──────────────────────────────────────┐    │          │
│  │  │  • analyzeImage()                    │    │          │
│  │  └──────────────────────────────────────┘    │          │
│  └───────────────────────┬────────────────────────          │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│   Database Layer (Prisma + PostgreSQL)                      │
│  ┌────────────────────────▼──────────────────────┐          │
│  │  • chat_sessions                              │          │
│  │  • chat_messages                              │          │
│  │  • message_attachments                        │          │
│  │  • sources                                     │          │
│  │  • source_chunks                              │          │
│  │  • purchase_request_records                   │          │
│  │  • users                                       │          │
│  └───────────────────────────────────────────────           │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. **ChatBot Agent (chatbot-agent-v2.js)**

**Location:** `backend/agents/chatbot/chatbot-agent-v2.js`

**Purpose:** 核心对话逻辑和工具调度

**Key Responsibilities:**
- 管理对话流程
- 调用 AI 服务
- 执行工具调用
- 处理图片分析
- 管理会话状态
- 生成对话标题

**Core Methods:**

```javascript
class ChatBotAgent {
  // 主要对话方法
  async chat({ userId, message, sessionId, attachmentData }) { }
  
  // 流式对话
  async chatStream({ userId, message, sessionId }) { }
  
  // 定义可用工具
  defineTools() { }
  
  // 定义工具处理器
  defineToolHandlers() { }
  
  // 处理采购申请流程
  async handlePurchaseRequestFlow({ userId, user, sessionId, message }) { }
  
  // 会话管理
  async ensureSession(sessionId, userId) { }
  async loadSessionHistory(sessionId, limit = 20) { }
  async saveMessage(sessionId, role, content, metadata, attachmentData) { }
}
```

---

### 2. **DeepSeek AI Service (deepseek-ai-service.js)**

**Location:** `backend/services/deepseek-ai-service.js`

**Purpose:** DeepSeek AI API 集成

**Configuration:**
```javascript
// Environment Variables
DEEPSEEK_API_KEY=<your-api-key>
DEEPSEEK_MODEL=deepseek-chat  // or deepseek-reasoner
DEEPSEEK_MAX_TOKENS=4096
```

**Key Features:**
- 自动重试机制 (3 retries with exponential backoff)
- 工具调用支持
- 超时保护 (Overall: 90s, Tool: 30s)
- 推理内容支持 (reasoning_content)

**Core Methods:**

```javascript
class DeepSeekAIService {
  // 基础对话 (带重试)
  async chat({ systemPrompt, messages, tools, maxTokens, temperature }) { }
  
  // 工具调用对话
  async chatWithTools({ 
    systemPrompt, 
    messages, 
    availableTools, 
    toolHandlers,
    maxIterations = 5,
    overallTimeoutMs = 90000,
    toolTimeoutMs = 30000
  }) { }
  
  // 带重试的 API 调用
  async chatWithRetry(params, maxRetries = 3) { }
}
```

**Error Handling:**
- **Retryable Errors:** 429, 500, 502, 503, 504, ECONNRESET, ETIMEDOUT
- **Non-Retryable:** 400, 401, 403, 404, Invalid API Key
- **Exponential Backoff:** 1s → 2s → 4s

---

### 3. **Vision AI Service (vision-ai-service.js)**

**Location:** `backend/services/vision-ai-service.js`

**Purpose:** 图片分析服务

**Supported Formats:**
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

**Core Method:**

```javascript
async analyzeImage(imageUrl, fileName) {
  // Returns: { success: true, analysis: "..." }
}
```

---

## AI Service Integration

### System Prompt Structure

**Template:**
```javascript
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

## Available Tools
- get_purchase_requests: Get user's purchase request list
- get_purchase_orders: Get purchase order list
- get_dashboard_stats: Get dashboard statistics
- get_notifications: Get user notifications
- get_lookup_options: Get available categories or units
- create_purchase_request: Create new purchase request
- export_purchase_requests: Export purchase requests to CSV or JSON format
- export_data: Universal export tool for multiple data types

[... detailed tool usage instructions ...]`;
```

**Dynamic Variables:**
- `{userName}` - User's display name
- `{userRole}` - User's role (Employee, Manager, Executive, Super Admin, Supplier)
- `{userDepartment}` - User's department

---

## Database Schema

### Core Tables

#### **chat_sessions**
```sql
Table: chat_sessions
Purpose: 存储对话会话

Columns:
- id           String     @id          -- UUID
- userId       Int                     -- 用户 ID
- title        String?                 -- 对话标题 (自动生成)
- createdAt    DateTime   @default(now())
- updatedAt    DateTime

Indexes:
- userId
- createdAt

Relations:
- users (many-to-one)
- chat_messages (one-to-many)
- sources (one-to-many)
```

#### **chat_messages**
```sql
Table: chat_messages
Purpose: 存储对话消息

Columns:
- id              Int        @id @default(autoincrement())
- sessionId       String                -- Session UUID
- role            String                -- 'user' | 'assistant'
- content         String                -- Message content
- metadata        Json?                 -- Purchase flow state, etc.
- createdAt       DateTime   @default(now())

Indexes:
- sessionId
- createdAt

Relations:
- chat_sessions (many-to-one)
- message_attachments (one-to-many)
```

#### **message_attachments**
```sql
Table: message_attachments
Purpose: 存储消息附件信息

Columns:
- id              String     @id          -- UUID
- messageId       Int                     -- Message ID
- fileName        String                  -- Original filename
- fileUrl         String                  -- Storage URL
- fileType        String                  -- File extension
- fileSize        Int                     -- Bytes
- mimeType        String?                 -- MIME type
- thumbnailUrl    String?                 -- Thumbnail URL (images)
- aiAnalysis      String?                 -- AI image analysis result
- uploadedAt      DateTime   @default(now())
- metadata        Json?

Indexes:
- messageId
- uploadedAt

Relations:
- chat_messages (many-to-one)
```

#### **sources**
```sql
Table: sources
Purpose: 存储用户上传的训练文档

Columns:
- id              String     @id          -- UUID
- userId          Int                     -- User ID
- sessionId       String?                 -- Optional session link
- fileName        String
- filePath        String                  -- Server path
- fileType        String                  -- File extension
- fileSize        Int
- uploadedAt      DateTime   @default(now())

Indexes:
- userId
- sessionId
- uploadedAt

Relations:
- users (many-to-one)
- chat_sessions (many-to-one, optional)
- source_chunks (one-to-many)
```

#### **source_chunks**
```sql
Table: source_chunks
Purpose: 文档内容分块存储 (用于 RAG)

Columns:
- id              String     @id          -- UUID
- sourceId        String                  -- Source UUID
- content         String                  -- Chunk text content
- chunkIndex      Int                     -- Chunk order

Indexes:
- sourceId

Relations:
- sources (many-to-one)
```

---

## Tool System

### Tool Definition Structure

每个工具包含:
1. **name** - 工具名称 (唯一标识符)
2. **description** - 工具描述 (AI 用于决策)
3. **input_schema** - JSON Schema 定义参数
4. **handler** - 工具执行函数

### Available Tools

#### 1. **get_purchase_requests**

**Purpose:** 获取用户的采购申请列表

**Input Schema:**
```javascript
{
  userId: number,      // Required
  limit: number        // Optional, default: 10
}
```

**Output:**
```javascript
{
  markdown: string,       // Pre-formatted markdown table
  total: number,
  statistics: {
    total: number,
    pending: number,
    submitted: number,
    approved: number,
    rejected: number
  },
  requests: Array<{
    id: string,
    prNumber: string,
    status: string,
    department: string,
    requestBy: string,
    requestDate: string,
    lineItems: Array<...>,
    createdAt: Date
  }>
}
```

**Business Logic:**
- 按部门过滤 (非 Super Admin)
- 自动生成统计数据
- 返回预格式化的 Markdown 表格

---

#### 2. **get_purchase_orders**

**Purpose:** 获取采购订单列表

**Input Schema:**
```javascript
{
  limit: number  // Optional, default: 10
}
```

---

#### 3. **get_dashboard_stats**

**Purpose:** 获取仪表板统计数据

**Input Schema:**
```javascript
{
  department: string  // Optional, empty for all departments
}
```

**Output:**
```javascript
{
  department: string,
  totalRequests: number,
  totalOrders: number,
  totalSpending: string,     // Decimal formatted
  pendingApprovals: number
}
```

---

#### 4. **create_purchase_request**

**Purpose:** 创建新的采购申请

**Input Schema:**
```javascript
{
  lineItems: Array<{
    itemName: string,
    itemCategory: string,
    quantity: number,
    unitOfMeasurement: string,
    itemDescription: string
  }>
}
```

**Workflow:**
1. Validate lineItems (至少 1 个)
2. 获取用户信息
3. 生成 UUID 和 PR Number
4. 格式化 lineItems (添加 tempId, 初始化供应商字段)
5. 构建 payload
6. 保存到数据库 `purchase_request_records`

**Output:**
```javascript
{
  success: true,
  prNumber: string,
  status: 'PENDING',
  itemCount: number,
  department: string
}
```

---

#### 5. **export_purchase_requests**

**Purpose:** 导出采购申请数据

**Input Schema:**
```javascript
{
  userId: number,
  format: 'csv' | 'json',    // Optional, default: 'csv'
  status: 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED',  // Optional
  limit: number              // Optional, default: 100
}
```

**Output:**
```javascript
{
  success: true,
  format: string,
  recordCount: number,
  department: string,
  status: string,
  data: string,             // CSV or JSON string
  mimeType: string,
  message: string
}
```

---

#### 6. **export_data**

**Purpose:** 通用数据导出工具 (多种数据类型)

**Input Schema:**
```javascript
{
  dataType: 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers',
  format: 'pdf' | 'excel' | 'csv' | 'json',
  filters: {
    status?: string,
    dateRange?: string,
    department?: string,
    limit?: number
  }
}
```

---

## Message Flow

### Standard Chat Flow

```
User Input
    ↓
Frontend (ChatWindow.tsx)
    ↓
API: POST /api/chatbot/chat
    ↓
chatbot-agent-v2.js: chat()
    ↓
1. Load user info from database
    ↓
2. Ensure session exists
    ↓
3. Check if purchase request flow is active
    │   ├─ Yes → handlePurchaseRequestFlow()
    │   └─ No  → Continue to AI
    ↓
4. Analyze image attachments (if any)
    │   └─ visionService.analyzeImage()
    ↓
5. Load session history (last 20 messages)
    ↓
6. Build system prompt (inject user info)
    ↓
7. Load relevant source context (RAG)
    ↓
8. Call DeepSeek AI with tools
    │   ├─ deepseekService.chatWithTools()
    │   ├─ Max iterations: 5
    │   ├─ Overall timeout: 90s
    │   └─ Tool timeout: 30s
    ↓
9. Execute tool calls (if any)
    │   ├─ get_purchase_requests
    │   ├─ create_purchase_request
    │   └─ etc.
    ↓
10. Save messages to database
    │    ├─ User message (with attachments)
    │    └─ Assistant message
    ↓
11. Generate session title (if first message)
    │    └─ titleGenerator.generateTitle()
    ↓
12. Return response to frontend
    ↓
Frontend: Display message
```

### Streaming Chat Flow

```
User Input
    ↓
Frontend (ChatWindow.tsx)
    ↓
API: POST /api/chatbot/chat/stream (SSE)
    ↓
chatbot-agent-v2.js: chatStream()
    ↓
1. Set SSE headers
    ↓
2. Send sessionId event
    ↓
3. Call deepseekService.chatStream()
    ↓
4. Stream chunks to frontend
    │   ├─ data: { type: 'chunk', text: '...' }
    │   └─ Flush every chunk
    ↓
5. Send done event
    │   └─ data: { type: 'done' }
    ↓
6. Save complete response to database
    ↓
Frontend: Display streaming message
```

---

## Session Management

### Session Lifecycle

```
1. User opens chat interface
    ↓
2. Frontend checks localStorage for existing sessionId
    │   ├─ Found → Load session history
    │   └─ Not found → Show welcome message
    ↓
3. User sends first message
    ↓
4. Frontend calls createNewSession() if no sessionId
    │   └─ Backend: Generate UUID, save to database
    ↓
5. Save sessionId to localStorage
    ↓
6. User continues conversation
    │   └─ All messages linked to this sessionId
    ↓
7. Auto title generation on first message
    │   └─ titleGenerator.generateTitle(message)
    ↓
8. User clicks "New Chat"
    │   ├─ Clear sessionId from localStorage
    │   └─ Reset messages state
```

### Session Data Structure

```javascript
// localStorage key
`optimind-chat-session-${userId}`

// Database: chat_sessions
{
  id: "uuid-here",
  userId: 123,
  title: "📊 IT部门支出分析",  // Auto-generated
  createdAt: "2026-08-23T10:00:00Z",
  updatedAt: "2026-08-23T10:15:00Z"
}

// Database: chat_messages (linked to session)
[
  {
    id: 1,
    sessionId: "uuid-here",
    role: "user",
    content: "帮我分析IT部门过去6个月的支出趋势",
    metadata: null,
    createdAt: "2026-08-23T10:00:00Z"
  },
  {
    id: 2,
    sessionId: "uuid-here",
    role: "assistant",
    content: "Here are your purchase requests...",
    metadata: null,
    createdAt: "2026-08-23T10:00:15Z"
  }
]
```

---

## File Handling

### Upload Flow

```
User selects/pastes file
    ↓
Frontend validation
    │   ├─ File type check
    │   ├─ Size limit check (< 10MB)
    │   └─ Count limit (max 5 files)
    ↓
Display in AttachmentPreview
    ↓
User sends message
    ↓
For each file:
    │
    ├─ Check if source file (PDF, Excel, Word, TXT, CSV)
    │   ├─ Yes → uploadSource()
    │   │   ├─ Upload to /uploads/sources/
    │   │   ├─ Extract text content
    │   │   ├─ Chunk content (overlap: 200 chars)
    │   │   ├─ Save to sources + source_chunks tables
    │   │   └─ Return sourceId
    │   │
    │   └─ All files → uploadAttachment()
    │       ├─ Upload to /uploads/attachments/
    │       ├─ Generate thumbnail (if image)
    │       ├─ Save metadata
    │       └─ Return attachment URL
    ↓
Pass attachmentData to chatbot agent
    ↓
For image files:
    └─ visionService.analyzeImage()
        ├─ Call vision AI API
        ├─ Get image description
        └─ Inject analysis into message
```

### File Storage Structure

```
backend/
├── uploads/
│   ├── attachments/
│   │   ├── {sessionId}/
│   │   │   ├── {timestamp}-{filename}.jpg
│   │   │   └── {timestamp}-{filename}.pdf
│   │   └── thumbnails/
│   │       └── thumb-{timestamp}-{filename}.jpg
│   │
│   └── sources/
│       └── {userId}/
│           ├── {timestamp}-{filename}.pdf
│           └── {timestamp}-{filename}.xlsx
```

---

## API Endpoints

### Core Endpoints

#### **POST /api/chatbot/chat**
**Purpose:** 发送消息并获取 AI 回复

**Request Body:**
```javascript
{
  userId: number,             // Required
  message: string,            // Required (unless attachments present)
  sessionId?: string,         // Optional, auto-create if not provided
  attachmentData?: Array<{    // Optional
    fileName: string,
    fileUrl: string,
    thumbnailUrl?: string,
    fileSize: number,
    fileType: string,
    mimeType: string
  }>
}
```

**Response:**
```javascript
{
  success: true,
  sessionId: string,
  message: string,
  usage: {
    input_tokens: number,
    output_tokens: number
  }
}
```

---

#### **POST /api/chatbot/chat/stream**
**Purpose:** 流式对话 (Server-Sent Events)

**Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**SSE Events:**
```javascript
// Session ID event
data: {"type":"session","sessionId":"uuid-here"}

// Text chunks
data: {"type":"chunk","text":"Hello"}
data: {"type":"chunk","text":" world"}

// Done event
data: {"type":"done"}

// Error event
data: {"type":"error","error":"Error message"}
```

---

#### **GET /api/chatbot/sessions**
**Purpose:** 获取用户的会话列表

**Query Parameters:**
```
userId: number  // Required
```

**Response:**
```javascript
{
  success: true,
  sessions: Array<{
    id: string,
    title: string,
    updatedAt: string,
    _count: { messages: number }
  }>
}
```

---

#### **GET /api/chatbot/history/:sessionId**
**Purpose:** 获取会话历史记录

**Response:**
```javascript
{
  success: true,
  messages: Array<{
    id: number,
    role: 'user' | 'assistant',
    content: string,
    createdAt: string,
    attachments: Array<{...}>
  }>
}
```

---

#### **DELETE /api/chatbot/session/:sessionId**
**Purpose:** 删除会话

**Response:**
```javascript
{
  success: true,
  message: 'Session deleted'
}
```

---

#### **PATCH /api/chatbot/session/:sessionId**
**Purpose:** 重命名会话

**Request Body:**
```javascript
{
  title: string,    // Required, max 80 characters
  userId: number    // Optional
}
```

---

#### **POST /api/chatbot/export-purchase-requests**
**Purpose:** 导出采购申请数据

**Request Body:**
```javascript
{
  userId: number,
  format: 'csv' | 'json',     // Optional, default: 'csv'
  status: 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED',
  limit: number               // Optional, default: 100
}
```

**Response Headers:**
```
Content-Type: text/csv (or application/json)
Content-Disposition: attachment; filename="purchase-requests-2026-08-23.csv"
X-Record-Count: 25
X-Export-Status: ALL
X-Export-Department: IT
```

---

## Security & Performance

### Security Measures

1. **Authentication**
   - All endpoints require valid `userId`
   - Session ownership validation

2. **Authorization**
   - Department-based data filtering (non-Super Admin)
   - User can only access their own sessions

3. **Input Validation**
   - File type whitelist
   - File size limit (10MB per file)
   - Message length limit (2000 characters)
   - SQL injection prevention (Prisma ORM)

4. **Rate Limiting**
   - AI API: handled by DeepSeek
   - File uploads: 5 files per message max

5. **Data Privacy**
   - Attachments stored in user/session-specific directories
   - Sensitive data filtered from logs

### Performance Optimizations

1. **Database Queries**
   - Indexed on `userId`, `sessionId`, `createdAt`
   - Pagination (limit: 10-100 records)
   - Parallel queries where possible

2. **AI API Calls**
   - Retry mechanism with exponential backoff
   - Timeout protection (90s overall, 30s per tool)
   - Request deduplication

3. **File Processing**
   - Async upload processing
   - Thumbnail generation for images only
   - Chunking for large documents

4. **Caching**
   - Session history in memory (last 20 messages)
   - Source context caching (keyword-based retrieval)

5. **Frontend**
   - localStorage for session persistence
   - Debounced input for voice transcription
   - Lazy loading for message history

---

## Monitoring & Logging

### Log Categories

1. **API Calls**
   ```
   DeepSeekAPI | Attempt 1/3 | Duration: 1234ms | Status: Success
   ```

2. **Tool Execution**
   ```
   ToolExecution | Calling get_purchase_requests | Duration: 567ms
   ```

3. **Errors**
   ```
   DeepSeekChat | API Error: timeout | Code: ETIMEDOUT | Status: 504
   ```

4. **Retries**
   ```
   DeepSeek | Retry 2/3 | Reason: Rate limit | Delay: 2s
   ```

5. **Timeouts**
   ```
   ChatWithTools | Overall execution timeout | Limit: 90000ms
   ```

---

## Common Issues & Troubleshooting

### Issue 1: AI Not Responding

**Symptoms:**
- Request timeout
- "Processing failed" error

**Possible Causes:**
1. DeepSeek API key not configured
2. Network timeout
3. Tool execution timeout

**Solutions:**
```bash
# Check API key
echo $DEEPSEEK_API_KEY

# Check logs
cat logs/error.log | grep "DeepSeek"

# Test API connectivity
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'
```

---

### Issue 2: Session Not Found

**Symptoms:**
- 404 error when loading history
- Session disappears from list

**Possible Causes:**
1. Session deleted
2. localStorage cleared
3. Database connection issue

**Solutions:**
```javascript
// Clear localStorage and start fresh
localStorage.removeItem(`optimind-chat-session-${userId}`);

// Check database
SELECT * FROM chat_sessions WHERE userId = <userId>;
```

---

### Issue 3: File Upload Failed

**Symptoms:**
- "Upload failed" message
- Attachment not showing

**Possible Causes:**
1. File too large (> 10MB)
2. Unsupported file type
3. Disk space full

**Solutions:**
```bash
# Check upload directory permissions
ls -la backend/uploads/

# Check disk space
df -h

# Check file size limit
cat backend/routes/chatbot-upload.js | grep "maxSize"
```

---

## Configuration Reference

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://postgres:339595@localhost:5432/FYPData
DEEPSEEK_API_KEY=<your-api-key>

# Optional
DEEPSEEK_MODEL=deepseek-chat              # or deepseek-reasoner
DEEPSEEK_MAX_TOKENS=4096
API_PUBLIC_BASE=http://localhost:4000

# Vision AI (Optional)
VISION_AI_API_KEY=<your-vision-api-key>
```

### Prisma Configuration

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (GUI)
npm run prisma:studio
```

---

## Performance Benchmarks

### Typical Response Times

| Operation | Time | Notes |
|-----------|------|-------|
| Simple chat (no tools) | 1-2s | Text-only response |
| Chat with 1 tool call | 2-4s | Database query + AI |
| Chat with 2-3 tool calls | 4-8s | Multiple DB queries |
| Image analysis | 3-5s | Vision AI processing |
| File upload (< 1MB) | 0.5-1s | Single file |
| Export to CSV (100 records) | 1-2s | Data formatting |
| Session history load | 0.2-0.5s | Database query |

### Database Query Performance

```sql
-- Fast queries (< 100ms)
SELECT * FROM chat_sessions WHERE userId = ? LIMIT 100;
SELECT * FROM chat_messages WHERE sessionId = ? LIMIT 20;

-- Medium queries (100-500ms)
SELECT * FROM purchase_request_records 
WHERE payload->>'department' = 'IT' 
LIMIT 100;

-- Slow queries (> 500ms)
SELECT * FROM source_chunks 
WHERE content LIKE '%keyword%'
LIMIT 1000;  -- Needs full-text search index
```

---

## Future Enhancements

### Planned Features

1. **Multi-Agent Support**
   - Specialized agents for different domains
   - Agent routing based on query type

2. **Advanced RAG**
   - Vector embeddings for source chunks
   - Semantic search instead of keyword matching

3. **Voice Input/Output**
   - Speech-to-text integration
   - Text-to-speech for responses

4. **Collaborative Features**
   - Share conversations with team members
   - Comment and annotate messages

5. **Analytics Dashboard**
   - Usage statistics
   - Popular queries
   - Response quality metrics

---

## References

- **DeepSeek API Docs:** https://platform.deepseek.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Ant Design Components:** https://ant.design/components
- **React Hooks Guide:** https://react.dev/reference/react

---

**Document maintained by:** Development Team  
**Last reviewed:** 2026-08-23  
**Next review:** 2026-09-23
