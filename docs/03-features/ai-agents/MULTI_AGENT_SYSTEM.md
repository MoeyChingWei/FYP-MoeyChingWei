# Multi-Agent System Documentation

## 📋 概览

这个项目现在支持**多AI Agent架构**，每个Agent都有：
- 独特的个性和专业领域
- 自己的工具集
- 独立的System Prompt
- 连接到DeepSeek API

---

## 🤖 可用的Agents

### 1. **ChatBot Agent** (通用助手)
- **类型**: `chatbot`
- **个性**: 友好、平易近人
- **专长**: 系统导航、常规查询、基础操作
- **工具**: 
  - `get_purchase_requests` - 查询采购申请
  - `get_purchase_orders` - 查询采购订单
  - `get_dashboard_stats` - 获取统计数据
  - `get_notifications` - 获取通知
  - `get_lookup_options` - 获取选项
  - `create_purchase_request` - 创建采购申请

### 2. **Purchase Agent** (采购专家) ✨ NEW
- **类型**: `purchase`
- **个性**: 专业、分析型、成本意识强
- **专长**: 采购优化、供应商管理、成本分析
- **工具**:
  - `create_purchase_request_optimized` - 创建优化的采购申请
  - `recommend_suppliers` - 供应商推荐
  - `analyze_price_history` - 价格历史分析
  - `check_inventory_status` - 库存检查
  - `calculate_bulk_savings` - 批量采购节省计算
  - `get_purchase_requests` - 采购申请查询

---

## 🚀 API端点

### 获取所有可用Agent
```bash
GET /api/agents/list
```

**响应示例:**
```json
{
  "success": true,
  "count": 2,
  "agents": [
    {
      "type": "chatbot",
      "name": "General Assistant",
      "description": "Friendly AI assistant for general ERP system help",
      "personality": "Friendly, approachable, and helpful",
      "expertise": "General system navigation, data queries, and basic operations",
      "toolCount": 6,
      "tools": ["get_purchase_requests", "get_purchase_orders", ...]
    },
    {
      "type": "purchase",
      "name": "Purchase Expert",
      "description": "Professional procurement advisor",
      "personality": "Analytical, cost-conscious, and optimization-focused",
      "expertise": "Purchase requests, supplier evaluation, cost optimization",
      "toolCount": 6,
      "tools": ["create_purchase_request_optimized", "recommend_suppliers", ...]
    }
  ]
}
```

### 获取特定Agent信息
```bash
GET /api/agents/:agentType/info
```

### 与Agent对话（标准）
```bash
POST /api/agents/:agentType/chat
Content-Type: application/json

{
  "userId": 1,
  "message": "I need help creating a purchase request",
  "sessionId": "uuid-optional"
}
```

**响应示例:**
```json
{
  "success": true,
  "agentType": "purchase",
  "agentName": "Purchase Expert",
  "sessionId": "abc-123",
  "message": "As a procurement specialist, I'd be happy to help you create an optimized purchase request. Let's start by understanding your requirements...",
  "usage": {
    "input_tokens": 1500,
    "output_tokens": 250
  }
}
```

### 与Agent对话（流式SSE）
```bash
POST /api/agents/:agentType/chat/stream
Content-Type: application/json

{
  "userId": 1,
  "message": "Analyze the price history for laptops",
  "sessionId": "uuid-optional"
}
```

### 会话管理

**创建新会话:**
```bash
POST /api/agents/:agentType/new-session
{
  "userId": 1
}
```

**获取用户会话列表:**
```bash
GET /api/agents/:agentType/sessions?userId=1
```

**获取会话历史:**
```bash
GET /api/agents/:agentType/history/:sessionId
```

**删除单个会话:**
```bash
DELETE /api/agents/:agentType/session/:sessionId
```

**删除所有会话:**
```bash
DELETE /api/agents/:agentType/sessions?userId=1
```

---

## 💻 代码示例

### 使用ChatBot Agent
```javascript
// 前端调用
const response = await axios.post('/api/agents/chatbot/chat', {
  userId: 1,
  message: 'How many purchase requests do I have?',
  sessionId: currentSessionId,
});

console.log(response.data.message);
// "You have 5 purchase requests. Here's the breakdown..."
```

### 使用Purchase Agent
```javascript
// 前端调用
const response = await axios.post('/api/agents/purchase/chat', {
  userId: 1,
  message: 'I need to order 50 laptops for IT department',
  sessionId: currentSessionId,
});

console.log(response.data.message);
// "As a procurement specialist, I'll help you create an optimized request for 50 laptops..."
```

### 获取Agent列表
```javascript
const response = await axios.get('/api/agents/list');
const agents = response.data.agents;

agents.forEach(agent => {
  console.log(`${agent.name}: ${agent.expertise}`);
});
```

---

## 🏗️ 添加新Agent的步骤

### 步骤1: 创建Agent文件

```javascript
// backend/agents/analytics/analytics-agent.js
import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

const ANALYTICS_SYSTEM_PROMPT = `You are the Data Analytics Expert for OptiMind ERP.

YOUR PERSONALITY:
- Analytical and data-driven
- Curious about patterns
- Proactive in suggesting insights

YOUR EXPERTISE:
- Data analysis and visualization
- Trend identification
- Cost optimization insights
- Predictive analytics

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}

YOUR COMMUNICATION STYLE:
- "Based on the data from the past 6 months..."
- "I've analyzed X records and found..."
- "The trend shows..."
- Use numbers and percentages

AVAILABLE TOOLS:
- analyze_spending_trends
- predict_future_costs
- identify_anomalies
- generate_department_comparison`;

class AnalyticsAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'analytics',
      name: 'Data Analyst',
      description: 'Expert in data analysis and business insights',
      personality: 'Analytical, data-driven, and insight-focused',
      expertise: 'Spending analysis, trend prediction, anomaly detection',
      systemPromptTemplate: ANALYTICS_SYSTEM_PROMPT,
      tools: AnalyticsAgent.defineTools(),
      toolHandlers: AnalyticsAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'analyze_spending_trends',
        description: 'Analyze spending trends over time',
        input_schema: {
          type: 'object',
          properties: {
            department: { type: 'string' },
            months: { type: 'number' },
          },
        },
      },
      // ... more tools
    ];
  }

  static defineToolHandlers() {
    return {
      analyze_spending_trends: async (input) => {
        // Implementation
        return {
          department: input.department,
          trend: 'increasing',
          percentage: 12.5,
          insights: ['...'],
        };
      },
      // ... more handlers
    };
  }
}

export default new AnalyticsAgent();
```

### 步骤2: 注册Agent

```javascript
// backend/routes/agents.js
import analyticsAgent from '../agents/analytics/analytics-agent.js';

const AGENTS = {
  chatbot: chatbotAgent,
  purchase: purchaseAgent,
  analytics: analyticsAgent,  // ✅ 添加这一行
};
```

### 步骤3: 测试Agent

```bash
# 获取Agent信息
curl http://localhost:4000/api/agents/analytics/info

# 测试对话
curl -X POST http://localhost:4000/api/agents/analytics/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "message": "Analyze spending trends for IT department"
  }'
```

就这么简单！✅

---

## 🎯 Agent个性对比

| Agent | 开场白 | 语言风格 | 重点 |
|-------|-------|---------|------|
| **ChatBot** | "Hello! How can I help you today?" | 友好、随和 | 用户体验 |
| **Purchase** | "As a procurement specialist, I..." | 专业、分析型 | 成本优化 |
| **Analytics** | "Based on the data analysis..." | 数据驱动 | 洞察发现 |
| **Approval** | "From a risk management perspective..." | 谨慎、政策导向 | 合规性 |

---

## 🔧 配置选项

### 修改Agent个性

编辑Agent文件的System Prompt:

```javascript
const YOUR_AGENT_SYSTEM_PROMPT = `You are the [ROLE] for OptiMind ERP.

YOUR PERSONALITY:
- [Trait 1]
- [Trait 2]
- [Trait 3]

YOUR COMMUNICATION STYLE:
- [Style guideline 1]
- [Style guideline 2]

...`;
```

### 添加新工具

```javascript
static defineTools() {
  return [
    {
      name: 'your_new_tool',
      description: 'What this tool does',
      input_schema: {
        type: 'object',
        properties: {
          param1: { type: 'string', description: '...' },
        },
        required: ['param1'],
      },
    },
  ];
}

static defineToolHandlers() {
  return {
    your_new_tool: async (input) => {
      // Implementation
      return { result: 'success' };
    },
  };
}
```

---

## 📊 监控与调试

### 查看Agent日志
```bash
# 启动后端时会看到
✅ Agent initialized: General Assistant (chatbot)
✅ Agent initialized: Purchase Expert (purchase)

# 对话时
💬 Purchase Expert request from user 1, session abc-123
```

### 测试工具调用
```javascript
// 在agent代码中添加日志
static defineToolHandlers() {
  return {
    your_tool: async (input) => {
      console.log('🔧 Tool called:', input);
      const result = await yourLogic(input);
      console.log('✅ Tool result:', result);
      return result;
    },
  };
}
```

---

## 💡 最佳实践

### 1. System Prompt设计
- **明确身份**: "You are the [Role] for OptiMind ERP"
- **定义个性**: 3-5个关键特征
- **通信风格**: 具体的语言模式示例
- **工具使用**: 明确何时使用哪个工具

### 2. 工具设计
- **单一职责**: 每个工具做一件事
- **清晰描述**: 让AI明白何时使用
- **验证输入**: 检查必需参数
- **错误处理**: 返回清晰的错误信息

### 3. 错误处理
```javascript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Tool error:', error);
  return {
    success: false,
    error: 'User-friendly error message',
  };
}
```

### 4. 性能优化
- 缓存常用查询结果
- 限制数据库查询数量
- 使用分页（limit参数）
- 索引常用查询字段

---

## 🚨 常见问题

### Q1: Agent返回的响应不符合预期？
**A:** 检查System Prompt，确保指令清晰明确。添加更多示例。

### Q2: 工具没有被调用？
**A:** 确保tool description清楚说明何时使用。添加"[MUST USE]"前缀。

### Q3: 如何让Agent有"记忆"？
**A:** 使用sessionId，历史消息会自动加载到上下文中。

### Q4: 如何限制Agent的token使用？
**A:** 在deepseek-ai-service.js中设置max_tokens参数。

---

## 📝 待实现的Agents

- [ ] **Analytics Agent** - 数据分析专家
- [ ] **Approval Agent** - 审批建议助手
- [ ] **Supplier Agent** - 供应商协调员
- [ ] **Document Agent** - 文档处理专家

---

## 🎓 总结

**你现在有了：**
1. ✅ Base Agent架构 - 可重用的基础类
2. ✅ 2个工作的Agents - ChatBot和Purchase
3. ✅ 统一的API路由 - `/api/agents/:type/...`
4. ✅ 完整的会话管理 - 创建、查询、删除
5. ✅ 工具调用框架 - 轻松添加新工具

**添加新Agent只需要：**
1. 复制现有Agent文件
2. 修改System Prompt和工具
3. 在agents.js注册
4. 完成！🎉

---

**创建日期**: 2026-06-12
**版本**: 1.0.0
**作者**: Claude Code Assistant
