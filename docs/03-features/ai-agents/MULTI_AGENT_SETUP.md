# Multi-Agent Page 启用文档

## 📋 概述

成功启用了 **MultiAgentPage** 功能，现在用户可以在系统中访问和使用6个专业AI Agent。

## 🎯 已启用的功能

### 新增路由
- **路径**: `/ai-agents`
- **页面**: MultiAgentPage
- **功能**: 用户可以选择和对话6个专业AI Agent

### 6个可用的AI Agents

1. 🤖 **Chatbot** (General Assistant) - 通用助手
2. 💰 **Purchase Expert** - 采购专家
3. 📊 **Data Analyst** - 数据分析师
4. ✅ **Approval Advisor** - 审批顾问
5. 🏢 **Supplier Coordinator** - 供应商协调员
6. 📄 **Document Specialist** - 文档专家

## 📝 更改的文件

### 1. `client/src/FrontEnd/App.tsx`

#### 添加的导入
```typescript
import { RobotOutlined } from "@ant-design/icons";
const MultiAgentPage = lazy(() => import("./pages/MultiAgentPage"));
```

#### 更新的类型定义
```typescript
type MenuKey =
  | "overview"
  | "users-access"
  | "purchasing"
  | "supplier-overview"
  | "tracking-item"
  | "chatbot"
  | "ai-agents"    // ✅ 新增
  | "settings";
```

#### 路由映射
```typescript
// 添加路径匹配
function useMenuKeyFromPath(pathname: string): MenuKey {
  ...
  if (pathname.startsWith("/ai-agents")) return "ai-agents";
  ...
}

// 添加颜色主题
const accentByKey: Record<MenuKey, string> = {
  ...
  "ai-agents": "#8b5cf6",  // 紫色
  ...
}

// 添加路由路径
const routes: Record<MenuKey, string> = {
  ...
  "ai-agents": "/ai-agents",
  ...
}
```

#### 权限控制
```typescript
// 员工可以访问
if (role === UserRole.EMPLOYEE) {
  ...
  if (pathname.startsWith("/ai-agents")) return true;
  ...
}

// 供应商可以访问
if (role === UserRole.SUPPLIER) {
  ...
  if (pathname.startsWith("/ai-agents")) return true;
  ...
}

// 菜单显示权限
const canSeeMenuKey = (key: MenuKey): boolean => {
  ...
  if (role === UserRole.EMPLOYEE) {
    return (
      ...
      key === "ai-agents" ||
      ...
    );
  }
  if (role === UserRole.SUPPLIER) {
    return key === "supplier-overview" || key === "chatbot" || key === "ai-agents";
  }
}
```

#### 侧边栏菜单项
```typescript
items={[
  ...
  {
    key: "ai-agents",
    icon: <RobotOutlined />,
    label: t('sidebar.aiAgents'),
  },
  ...
]}
```

#### 路由定义
```typescript
<Route path="/ai-agents" element={<MultiAgentPage userId={sessionUser?.id || 0} />} />
```

### 2. 翻译文件

#### `client/src/i18n/locales/en/navigation.json`
```json
{
  "sidebar": {
    ...
    "aiAgents": "AI Agents",
    ...
  }
}
```

#### `client/src/i18n/locales/zh/navigation.json`
```json
{
  "sidebar": {
    ...
    "aiAgents": "专业AI顾问",
    ...
  }
}
```

#### `client/src/i18n/locales/ms/navigation.json`
```json
{
  "sidebar": {
    ...
    "aiAgents": "Agen AI Pakar",
    ...
  }
}
```

## 🚀 如何使用

### 1. 启动后端
```bash
cd backend
npm run dev
```

### 2. 启动前端
```bash
cd client
npm run dev
```

### 3. 访问页面
登录后，在左侧边栏点击 **AI Agents** 图标（🤖），或直接访问：
```
http://localhost:3000/ai-agents
```

## 📊 系统架构

### 前端流程
```
用户访问 /ai-agents
    ↓
MultiAgentPage 组件加载
    ↓
AgentSelector 显示6个Agent选项
    ↓
用户选择某个Agent
    ↓
MultiAgentChatWindow 加载对话界面
    ↓
发送消息到 /api/agents/:agentType/chat
    ↓
后端调用对应Agent处理
    ↓
返回响应到前端显示
```

### 后端API
- **Base URL**: `/api/agents`
- **主要端点**:
  - `GET /api/agents/list` - 获取所有Agent列表
  - `GET /api/agents/:agentType/info` - 获取Agent详情
  - `POST /api/agents/:agentType/chat` - 与Agent对话
  - `POST /api/agents/:agentType/chat/stream` - 流式对话
  - `GET /api/agents/:agentType/sessions` - 获取会话列表
  - `GET /api/agents/:agentType/history/:sessionId` - 获取历史记录

## 🔐 权限设置

| 角色 | 可访问 /ai-agents |
|-----|------------------|
| Admin | ✅ 是 |
| Manager | ✅ 是 |
| Department Executive | ✅ 是 |
| Employee | ✅ 是 |
| Supplier | ✅ 是 |

所有角色都可以访问AI Agents功能。

## 📱 界面布局

```
┌─────────────────────────────────────────────────┐
│  🤖 Multi-Agent AI Assistant                    │
│  Choose from 6 specialized AI agents            │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  Agent       │   Chat Window                    │
│  Selector    │   ┌──────────────────────────┐  │
│  ┌────────┐  │   │ Agent: Purchase Expert   │  │
│  │Chatbot │  │   ├──────────────────────────┤  │
│  │Purchase│  │   │                          │  │
│  │Analytics│ │   │  User: 帮我查询上月...    │  │
│  │Approval│  │   │  Agent: 好的，让我查询... │  │
│  │Supplier│  │   │                          │  │
│  │Document│  │   │                          │  │
│  └────────┘  │   └──────────────────────────┘  │
│              │   [输入框]            [发送]     │
│  Quick Tips  │                                  │
│  💡 Tips     │                                  │
│  ...         │                                  │
└──────────────┴──────────────────────────────────┘
```

## 🎨 设计特点

- **Agent选择器**: 下拉菜单 + 卡片展示
- **颜色编码**: 每个Agent有独特颜色
- **会话管理**: 支持多会话切换
- **流式响应**: 实时显示Agent回复
- **工具调用**: Agent可以查询数据库、执行计算

## 📚 相关文件

### 前端核心文件
- `client/src/FrontEnd/pages/MultiAgentPage.tsx` - 主页面
- `client/src/FrontEnd/components/ChatBot/AgentSelector.tsx` - Agent选择器
- `client/src/FrontEnd/components/ChatBot/MultiAgentChatWindow.tsx` - 对话窗口
- `client/src/FrontEnd/shared/api/agents.ts` - API调用

### 后端核心文件
- `backend/routes/agents.js` - Agent路由
- `backend/agents/base-agent.js` - Agent基类
- `backend/agents/purchase/purchase-agent.js` - 采购Agent
- `backend/agents/analytics/analytics-agent.js` - 分析Agent
- `backend/agents/approval/approval-agent.js` - 审批Agent
- `backend/agents/supplier/supplier-agent.js` - 供应商Agent
- `backend/agents/document/document-agent.js` - 文档Agent
- `backend/agents/chatbot/chatbot-agent-v2.js` - 聊天Agent

## ✅ 测试清单

- [x] 前端构建成功
- [x] 路由配置正确
- [x] 翻译文件更新（英文、中文、马来文）
- [x] 权限控制设置
- [x] 侧边栏菜单显示
- [ ] 实际运行测试
- [ ] 所有Agent功能测试
- [ ] 多语言切换测试

## 🔄 后续建议

1. **测试所有Agent功能** - 确保每个Agent的工具调用正常工作
2. **优化UI体验** - 根据用户反馈调整界面
3. **添加使用指南** - 在页面上添加快速入门提示
4. **监控Agent性能** - 记录响应时间和错误率
5. **扩展Agent能力** - 根据业务需求添加新工具

## 📞 问题排查

### 如果页面打不开
1. 检查前端是否成功启动
2. 检查浏览器控制台是否有错误
3. 检查后端 `/api/agents/list` 是否正常返回

### 如果Agent无法响应
1. 检查后端日志
2. 确认DeepSeek API配置正确
3. 检查数据库连接

### 如果侧边栏看不到菜单
1. 确认用户角色权限
2. 检查翻译文件是否正确加载
3. 清除浏览器缓存

---

**启用完成时间**: 2026-06-23  
**启用者**: Claude Code  
**状态**: ✅ 已启用，等待测试
