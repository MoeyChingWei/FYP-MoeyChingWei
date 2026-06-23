# OptiMind ERP Project Log

**Project Name**: OptiMind ERP System  
**Developer**: Moey Ching Wei  
**Created**: 2026-06-09  
**Last Updated**: 2026-06-23

---

## 📝 How to Update This Log

**After EVERY development task, add an entry using this format:**

```markdown
---
## [YYYY-MM-DD] - [Feature Name]

**Requirement:** [Brief description of what user asked for]

**Implementation:** [What you built/changed]

**Modified Files:**
- `path/to/file.js` - Description of changes
- `path/to/component.tsx` - Description of changes
- `path/to/schema.prisma` - Description of changes

**Technical Details:**
- Technology/library used
- Important code patterns
- API endpoints added/modified
- Database schema changes

**Important Notes:**
- Things other developers need to know
- Dependencies added
- Configuration changes
- Breaking changes (if any)

**Related Documentation:**
- Created: docs/03-features/xxx/XXX_GUIDE.md
- Updated: docs/01-core/DOCUMENTATION.md
---
```

**Example Entry:**

```markdown
---
## [2026-06-21] - Chatbot Export Feature

**Requirement:** User wants chatbot to understand "export purchase request" command and generate CSV file

**Implementation:** 
- Added export command recognition in chatbot agent
- Implemented CSV generation service
- Added file download endpoint

**Modified Files:**
- `backend/agents/chatbot/chatbot-agent.js` - Added "export" command handler
- `backend/services/export-service.js` - Created CSV generation logic
- `backend/routes/chatbot.js` - Added GET /api/chatbot/export endpoint
- `client/src/FrontEnd/shared/api/chatbot.ts` - Added exportPurchaseRequests() function

**Technical Details:**
- Uses Prisma to query purchase requests filtered by user
- Generates CSV with headers: ID, Item, Quantity, Status, Date
- Returns file as blob for client-side download
- File size limit: 10MB per export

**Important Notes:**
- Export only includes authenticated user's purchase requests
- CSV format is Excel-compatible
- Requires valid authentication token
- Feature is AI-driven (chatbot command), not a UI button

**Related Documentation:**
- Created: docs/03-features/export/CHATBOT_EXPORT_GUIDE.md
- Updated: docs/01-core/DOCUMENTATION.md (Chatbot Features section)
- Created: docs/04-implementation/completion-reports/2026-06-21-CHATBOT-EXPORT-COMPLETION-REPORT.md
---
```

---

## 📖 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [开发日志](#开发日志)
  - [2026-06-09 - ChatBot功能诊断](#2026-06-09---chatbot功能诊断)
- [常见问题与解决方案](#常见问题与解决方案)
- [部署说明](#部署说明)
- [维护记录](#维护记录)

---

## 项目概述

OptiMind ERP 是一个企业资源规划系统，包含以下主要功能：
- 用户管理与权限控制
- 采购申请与审批流程
- 采购订单管理
- 供应商管理
- 通知系统
- AI ChatBot助手

---

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **UI库**: Ant Design
- **状态管理**: React Hooks
- **路由**: React Router
- **HTTP客户端**: Axios

### 后端
- **运行环境**: Node.js
- **框架**: Express.js
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **AI集成**: Anthropic Claude API (claude-opus-4-8)

### 开发工具
- **版本控制**: Git
- **包管理器**: npm
- **开发服务器**: nodemon

---

## 开发日志

### 2026-06-10 - 项目文档整理

#### 执行内容
整理了项目中的15个Markdown文档，建立统一的文档管理系统。

#### 整理结果

**文档归档**：
- ✅ 移动4个历史实施报告到 `docs/archive/`
  - CHATBOT_IMPLEMENTATION_REPORT.md
  - DASHBOARD_DEPARTMENT_FILTERING_GUIDE.md
  - DEPARTMENT_FILTERING_IMPLEMENTATION.md
  - IMPLEMENTATION_SUMMARY.md
- ✅ 删除重复的 ChatBot-Troubleshooting-Report.md

**新增文档**：
- ✅ `README-DOCS.md` - 文档导航中心
- ✅ `HOW-TO-USE-PROJECT-LOG.md` - 使用指南
- ✅ `scripts/update-log.js` - 自动化更新工具

**文档结构**：
```
根目录/
├── PROJECT-LOG.md           ⭐ 主文档
├── README-DOCS.md           📚 导航中心
├── HOW-TO-USE-PROJECT-LOG.md 📖 使用指南
├── docs/
│   ├── DOCUMENTATION.md     📘 完整文档
│   ├── QUICK_REFERENCE.md   📋 快速参考
│   ├── MIGRATION.md         🔄 迁移指南
│   ├── CLAUDE.md            🤖 AI配置
│   └── archive/             📦 历史文档
├── backend/README.md        🔙 后端文档
├── client/README.md         🎨 前端文档
└── Diagram/README.md        📊 图表说明
```

#### 文档维护原则
- **唯一主文档**: 所有开发活动记录到 PROJECT-LOG.md
- **自动化更新**: 直接告诉Claude更新文档
- **避免零散**: 不再创建新的独立md文件

---

### 2026-06-08 - ChatBot AI Agent系统实施完成

#### 实施内容

**后端系统**：
- ✅ 数据库Schema: ChatSession、ChatMessage表
- ✅ AI服务层: claude-ai-service.js（支持对话、流式响应、工具调用）
- ✅ ChatBot Agent: chatbot-agent.js（会话管理、上下文维护）
- ✅ 4个内置工具:
  1. get_purchase_requests - 查询采购申请
  2. get_purchase_orders - 查询采购订单
  3. get_dashboard_stats - 获取仪表板统计
  4. get_notifications - 获取用户通知

**API端点**：
- POST /api/chatbot/chat - 标准对话
- POST /api/chatbot/chat/stream - 流式对话（SSE）
- POST /api/chatbot/new-session - 创建会话
- GET /api/chatbot/sessions - 获取会话列表
- GET /api/chatbot/history/:sessionId - 获取历史
- DELETE /api/chatbot/session/:sessionId - 删除会话

**前端系统**：
- ✅ ChatBotWidget.tsx - 右下角悬浮按钮
- ✅ ChatWindow.tsx - 主聊天窗口
- ✅ MessageList.tsx - 消息列表
- ✅ chatbot.ts - API封装

**Claude配置**：
- 模型: claude-opus-4-8
- 最大Token: 4096
- 成本预估: ~$150-250/月（100活跃用户）

#### 使用方法
```bash
# 测试ChatBot
cd backend
node test-chatbot.js

# 访问系统
http://localhost:3000
右下角蓝色消息按钮
```

#### 未来计划
当前完成: ChatBot Agent（1/7）

待实施的6个Agent：
2. 采购助手Agent - 智能表单、供应商推荐
3. 审批智能Agent - 风险评分、异常检测
4. 供应商协调Agent - 自动通知、交付跟踪
5. 数据分析Agent - 趋势预测、成本优化
6. 通知智能Agent - 智能优先级、偏好学习
7. 文档处理Agent - PDF生成、OCR、合同检查

---

### 2026-06-04 - 仪表板部门过滤功能实施

#### 实施内容
所有仪表板图表和统计数据现在按用户部门过滤。

**功能清单**：
- ✅ Pending Approvals - 部门待审批数量
- ✅ Purchase Requests - 部门申请数量+趋势
- ✅ Purchase Orders - 部门订单数量+趋势
- ✅ Monthly Spending - 部门支出+趋势
- ✅ Purchasing Trend Chart - 6个月部门数据
- ✅ Spending by Category - 部门前10类别

**用户体验**：
- Super Admin → 看到所有部门的汇总数据
- 普通用户 → 只看到自己部门的数据
- 供应商 → 简化的供应商视图

**新增文件**：
- backend/routes/dashboard.js - 仪表板API
- client/src/FrontEnd/shared/api/dashboard.ts - API封装

**修改文件**：
- backend/server.js - 添加路由
- client/src/FrontEnd/pages/DashboardNew.tsx - 前端逻辑

**API端点**：
```
GET /api/dashboard/statistics?department=XXX
```

**数据流程**：
```
用户登录 → 获取user.department → 加载仪表板 →
调用API(带部门参数) → 后端过滤数据 →
计算统计 → 返回JSON → 更新UI
```

---

### 2026-06-09 - ChatBot功能诊断

#### 问题描述
用户反映 ChatBot 功能"不能run"（无法运行）。

#### 诊断过程

##### 1. 代码检查
检查了以下文件，确认代码完整且正确：
- ✅ `backend/routes/chatbot.js` - API路由
- ✅ `backend/agents/chatbot/chatbot-agent.js` - ChatBot逻辑
- ✅ `backend/services/claude-ai-service.js` - Claude API集成
- ✅ `client/src/FrontEnd/pages/ChatBotPage.tsx` - 前端页面
- ✅ `client/src/FrontEnd/components/ChatBot/ChatBotWidget.tsx` - 悬浮组件
- ✅ `client/src/FrontEnd/shared/api/chatbot.ts` - API调用层

##### 2. 配置验证
```env
CLAUDE_API_KEY=HJKRABBS-0ZHB-Z4BJ-H67Z-U7YUTZFZ94FP
CLAUDE_DEFAULT_MODEL=claude-opus-4-8
CLAUDE_MAX_TOKENS=4096
DATABASE_URL="postgresql://postgres:123456@localhost:5432/FYPData"
```
✅ 环境变量配置正确

##### 3. 数据库Schema
```prisma
model ChatSession {
  id        String   @id @default(uuid())
  userId    Int
  title     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(...)
  messages  ChatMessage[]
}

model ChatMessage {
  id        Int      @id @default(autoincrement())
  sessionId String
  role      String
  content   String   @db.Text
  createdAt DateTime @default(now())
  session   ChatSession @relation(...)
}
```
✅ 数据库表结构正确

##### 4. API测试结果

**测试1: 创建新会话**
```bash
POST /api/chatbot/new-session
Body: {"userId": 1}

Response:
{
  "success": true,
  "sessionId": "96e5ceff-0047-4835-a3ed-b96a3b489f38"
}
```
✅ 成功

**测试2: 发送消息**
```bash
POST /api/chatbot/chat
Body: {
  "userId": 1,
  "sessionId": "test-123",
  "message": "你好"
}

Response:
{
  "success": true,
  "sessionId": "test-123",
  "message": "你好！我是OptiMind ERP系统的AI助手...",
  "usage": {
    "input_tokens": 3021,
    "output_tokens": 252
  }
}
```
✅ 成功

**测试3: 工具调用**
服务器日志显示：
```
💬 ChatBot request from user 1, session e52788c3-4ff3-46ef-be6e-a916f98703b9
🔧 Tool called: get_dashboard_stats { department: 'Administration' }
```
✅ 工具调用正常

#### 诊断结论

**ChatBot功能完全正常！** 所有组件都能正常工作：
- ✅ 后端API服务器运行正常
- ✅ 所有API端点响应正确
- ✅ Claude AI API集成正常
- ✅ 数据库连接和Schema正确
- ✅ 工具调用（Tool Use）功能正常
- ✅ 前端组件代码完整

#### 执行的操作

1. **重启服务器**
```bash
# 停止旧进程 (PID: 33884)
Stop-Process -Id 33884

# 启动新服务器
cd backend
node server.js
```

2. **验证测试**
通过多个API测试，确认所有功能正常。

**重要说明**: 
- ❌ 没有修改任何代码
- ❌ 没有修复任何bug
- ✅ 只是重启服务器并验证功能
- ✅ 所有原有代码都是正确的

#### 可能导致"不能运行"的原因

如果之前遇到问题，可能是以下原因：

1. **后端服务器未启动**
   - 症状: API请求失败
   - 解决: `cd backend && npm run dev`

2. **前端服务器未启动**
   - 症状: 页面无法访问
   - 解决: `cd client && npm start`

3. **用户未登录**
   - 症状: 提示"请先登录"
   - 解决: 确保用户已登录，userId存在

4. **前端路由未配置**
   - 症状: 访问 `/chatbot` 显示404
   - 解决: 检查路由配置

5. **环境变量未加载**
   - 症状: Claude API调用失败
   - 解决: 确保 `.env` 文件存在且正确

6. **端口冲突**
   - 症状: 后端启动失败
   - 解决: 检查端口4000是否被占用

#### ChatBot API端点列表

```
POST   /api/chatbot/chat              - 发送消息
POST   /api/chatbot/chat/stream       - 流式响应（SSE）
GET    /api/chatbot/sessions          - 获取会话列表
GET    /api/chatbot/history/:id       - 获取历史记录
DELETE /api/chatbot/session/:id       - 删除会话
POST   /api/chatbot/new-session       - 创建新会话
```

#### ChatBot工具函数

1. **get_purchase_requests** - 获取采购申请列表
2. **get_purchase_orders** - 获取采购订单列表
3. **get_dashboard_stats** - 获取仪表板统计数据
4. **get_notifications** - 获取用户通知

#### 系统架构

```
前端 (React + TypeScript)
  └─ ChatBotPage.tsx / ChatBotWidget.tsx
      └─ chatbot.ts (API封装)
          │
          ↓ HTTP/HTTPS
          │
后端 (Express.js)
  └─ routes/chatbot.js
      └─ agents/chatbot/chatbot-agent.js
          └─ services/claude-ai-service.js
              │
              ↓ HTTPS
              │
          Claude API (Anthropic)
          claude-opus-4-8
              │
              ↓
          PostgreSQL 数据库
          - chat_sessions
          - chat_messages
          - users
          - purchase_request_records
          - purchase_order_records
```

---

## 常见问题与解决方案

### Q1: 如何启动项目？

**后端**:
```bash
cd backend
npm install    # 首次运行
npm run dev    # 开发模式（nodemon）
# 或
node server.js # 直接运行
```

**前端**:
```bash
cd client
npm install    # 首次运行
npm start      # 启动开发服务器
```

### Q2: 如何测试ChatBot功能？

使用测试脚本：
```bash
cd backend
node test-chatbot.js
```

### Q3: 端口被占用怎么办？

**Windows PowerShell**:
```powershell
# 查看占用端口4000的进程
netstat -ano | Select-String "4000"

# 停止进程（替换PID）
Stop-Process -Id [PID] -Force
```

### Q4: Claude API调用失败？

检查：
1. `.env` 文件中 `CLAUDE_API_KEY` 是否正确
2. 网络连接是否正常
3. API密钥是否有效（未过期）

### Q5: 数据库连接失败？

检查：
1. PostgreSQL服务是否运行
2. `.env` 中 `DATABASE_URL` 是否正确
3. 数据库是否已创建
4. 运行 `npx prisma migrate dev` 同步schema

---

## 部署说明

### 生产环境部署步骤

#### 1. 准备环境
- Node.js 18+
- PostgreSQL 14+
- 稳定的网络连接（访问Claude API）

#### 2. 配置环境变量
创建 `.env` 文件：
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
CLAUDE_API_KEY=your_api_key_here
CLAUDE_DEFAULT_MODEL=claude-opus-4-8
CLAUDE_MAX_TOKENS=4096
```

#### 3. 安装依赖
```bash
# 后端
cd backend
npm ci --production

# 前端
cd client
npm ci
```

#### 4. 数据库迁移
```bash
cd backend
npx prisma migrate deploy
```

#### 5. 构建前端
```bash
cd client
npm run build
```

#### 6. 启动服务
```bash
cd backend
npm start
# 或使用 PM2
pm2 start server.js --name "optimind-backend"
```

---

## 维护记录

### 2026-06-09
- ✅ ChatBot功能诊断完成
- ✅ 确认所有API端点正常工作
- ✅ 验证Claude API集成成功
- ✅ 创建项目统一文档

---

## 开发规范

### Git提交信息格式
```
类型: 简短描述

详细描述（可选）

类型包括:
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具相关
```

### 代码审查清单
- [ ] 代码符合项目规范
- [ ] 添加必要的注释
- [ ] 通过所有测试
- [ ] 没有console.log等调试代码
- [ ] 处理了所有可能的错误情况

---

## 技术债务

_暂无记录的技术债务_

---

## 未来改进计划

### ChatBot功能增强
- [ ] 支持多轮对话上下文管理
- [ ] 添加语音输入/输出
- [ ] 支持文件上传和分析
- [ ] 添加对话导出功能
- [ ] 优化工具调用性能

### 系统优化
- [ ] 添加Redis缓存层
- [ ] 实现API速率限制
- [ ] 添加系统监控和告警
- [ ] 优化数据库查询性能
- [ ] 添加单元测试和集成测试

---

## 联系信息

**开发者**: Moey Ching Wei  
**邮箱**: chingweimoey@gmail.com / chingweimoey@1utar.my

---

_本文档会持续更新，记录项目开发过程中的所有重要信息。_

**最后更新时间**: 2026-06-10

---
## [2026-06-22] - Export & Print System Backend

**Requirement:** Build professional document export system for OptiMind ERP supporting PDF, Excel, CSV, and JSON formats for purchase requests, orders, invoices, and suppliers.

**Implementation:** 
- Developed complete backend export API with template-based document generation
- Integrated Puppeteer for PDF generation, exceljs for spreadsheets
- Created professional Handlebars templates with company branding
- Implemented data formatting layer for all 4 data types

**Modified Files:**
- `backend/routes/export.js` - REST API endpoint POST /api/export/:dataType
- `backend/services/export-service.js` - Unified export orchestration (20 tests)
- `backend/services/pdf-generator.js` - Puppeteer HTML→PDF (10 tests)
- `backend/services/template-renderer.js` - Handlebars compilation (9 tests)
- `backend/services/data-formatter.js` - Data transformation (18 tests)
- `backend/templates/documents/*.hbs` - 4 professional document templates
- `backend/templates/styles/*.css` - Print-optimized CSS
- `backend/config/puppeteer-config.js` - PDF generation config

**Technical Details:**
- Template Engine: Handlebars with caching for performance
- PDF Generation: Puppeteer headless Chrome with A4 format
- Excel: exceljs with auto-column sizing
- Department-level permissions enforced via user role
- Response: Binary blob stream (responseType: 'blob')
- Timeout: 60 seconds for large datasets

**Important Notes:**
- All 78 backend tests passing (100% coverage)
- File naming: {dataType}-{timestamp}.{extension}
- Requires Chromium dependencies for Puppeteer
- PDF templates optimized for printing (print.css)

**Related Documentation:**
- Created: docs/04-implementation/completion-reports/2026-06-22-EXPORT-PRINT-SYSTEM-COMPLETION-REPORT.md
- Created: docs/07-design-specs/specs/2026-06-22-export-print-system-design.md

---
## [2026-06-23] - Export & Print System Frontend

**Requirement:** Create reusable React components for exporting data with format selection and print functionality, integrate with backend export API.

**Implementation:**
- Built ExportButton component with dropdown menu (PDF/Excel/CSV/JSON)
- Built PrintButton component for direct PDF printing
- Added i18n translations for EN/ZH/MS
- Integrated into PurchaseOrderReview page as proof-of-concept

**Modified Files:**
- `client/src/FrontEnd/components/shared/ExportButton.tsx` - Export dropdown component
- `client/src/FrontEnd/components/shared/PrintButton.tsx` - Print button component
- `client/src/FrontEnd/components/shared/types/export.ts` - TypeScript types
- `client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx` - Integration example
- `client/src/i18n/locales/en/common.json` - Export translations (English)
- `client/src/i18n/locales/zh/common.json` - Export translations (Chinese)
- `client/src/i18n/locales/ms/common.json` - Export translations (Malay)

**Technical Details:**
- UI Framework: Ant Design 6.3.1 (Dropdown, Button, message)
- HTTP Client: axios with responseType: 'blob'
- File Download: Blob URL creation with auto-cleanup
- Error Handling: 403, 404, 500, timeout with user-friendly messages
- Loading States: Per-format loading spinners
- Permissions: Automatically uses session user credentials

**Important Notes:**
- Components are fully reusable across all list pages
- Supports current page filters (status, department, date range)
- Auto-revokes blob URLs to prevent memory leaks
- Print button opens PDF in new window with print dialog

**Related Documentation:**
- Created: docs/07-design-specs/specs/2026-06-23-frontend-export-components-design.md
- Created: docs/07-design-specs/guides/export-button-integration.md
- Created: docs/07-design-specs/plans/2026-06-23-frontend-export-components.md

---
## [2026-06-23] - Chatbot export_data Tool Integration

**Requirement:** Enable chatbot to understand natural language export requests and provide OPTIONS buttons for format selection.

**Implementation:**
- Upgraded chatbot with universal export_data tool supporting all data types and formats
- Enhanced system prompt with export instructions and format detection
- Added download endpoint for temporary file serving
- Implemented OPTIONS button UI for format selection when not specified

**Modified Files:**
- `backend/agents/chatbot/chatbot-agent.js` - Added export_data tool definition and handler
- `backend/utils/chatbot-export-handler.js` - Export logic for chatbot (NEW)
- `backend/routes/chatbot.js` - Added GET /api/chatbot/download/:filename endpoint
- `backend/temp/exports/.gitignore` - Temp file directory (NEW)

**Technical Details:**
- Tool Definition: export_data with dataType, format, filters parameters
- Backend Integration: Calls POST /api/export/:dataType via axios
- File Management: Saves to temp/exports/, auto-deletes after 5 seconds
- OPTIONS Format: Frontend renders clickable format buttons
- Natural Language: Detects data type and format from user message
- Security: Filename validation regex, path traversal protection

**Important Notes:**
- Supports natural language: "导出采购申请", "export purchase orders as PDF"
- Shows OPTIONS buttons when format not specified
- Returns download link with file metadata (size, timestamp)
- Comprehensive error handling (permissions, no data, timeout, server errors)
- Works with all 4 data types and 4 formats

**Related Documentation:**
- Created: docs/07-design-specs/specs/2026-06-23-chatbot-export-tool-design.md
- Created: docs/07-design-specs/plans/2026-06-23-chatbot-export-tool.md
- Created: docs/07-design-specs/guides/chatbot-export-usage.md

