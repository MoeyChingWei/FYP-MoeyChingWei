# 🎨 Multi-Agent前端界面使用指南

## ✅ 已创建的组件

### 1. API层 (`client/src/FrontEnd/shared/api/agents.ts`)
完整的Multi-Agent API客户端，包含：
- ✅ `getAllAgents()` - 获取所有Agent
- ✅ `getAgentInfo()` - 获取单个Agent信息
- ✅ `sendMessageToAgent()` - 发送消息
- ✅ `createAgentSession()` - 创建会话
- ✅ `sendMessageToAgentStream()` - 流式响应
- ✅ 完整的TypeScript类型定义

### 2. Agent选择器 (`AgentSelector.tsx`)
**功能**:
- 显示所有6个Agent
- 每个Agent有独特的图标和颜色
- 显示Agent详细信息（个性、专长、工具数量）
- 下拉选择器 + 详情卡片

**图标和颜色映射**:
- 🤖 ChatBot - 蓝色 (#1890ff)
- 🛒 Purchase - 绿色 (#52c41a)
- 📊 Analytics - 紫色 (#722ed1)
- ⚖️ Approval - 橙色 (#fa8c16)
- 📦 Supplier - 青色 (#13c2c2)
- 📄 Document - 粉色 (#eb2f96)

### 3. Multi-Agent聊天窗口 (`MultiAgentChatWindow.tsx`)
**功能**:
- 根据选择的Agent显示不同的头部样式
- 每个Agent有独特的欢迎消息
- 颜色主题随Agent变化
- 支持新建对话
- 自动滚动到底部

**欢迎消息示例**:
- **ChatBot**: "Hello! I am your general AI assistant..."
- **Purchase**: "As a procurement specialist, I can help you..."
- **Analytics**: "Based on data analysis, I can provide insights..."

### 4. Multi-Agent页面 (`MultiAgentPage.tsx`)
**完整的页面布局**:
- 左侧: Agent选择器 + 快速提示卡片
- 右侧: 聊天窗口
- 响应式设计（移动端友好）

### 5. Multi-Agent Widget (`MultiAgentWidget.tsx`)
**浮动窗口版本**:
- 右下角浮动按钮
- 下拉菜单选择Agent
- 弹出式聊天窗口
- 未读消息徽章
- 移动端全屏显示

---

## 🚀 如何使用

### 方法1: 完整页面（推荐用于专门的AI助手页面）

```typescript
// 在路由中添加
import MultiAgentPage from './pages/MultiAgentPage';

// 路由配置
{
  path: '/ai-assistant',
  element: <MultiAgentPage userId={currentUser.id} />
}
```

### 方法2: 浮动Widget（推荐用于全局使用）

```typescript
// 在主布局中添加
import MultiAgentWidget from './components/ChatBot/MultiAgentWidget';

function MainLayout() {
  return (
    <>
      {/* 你的其他内容 */}
      <MultiAgentWidget userId={currentUser.id} />
    </>
  );
}
```

---

## 📁 文件清单

### 新增文件（8个）

**API层**:
- ✅ `client/src/FrontEnd/shared/api/agents.ts`

**组件**:
- ✅ `client/src/FrontEnd/components/ChatBot/AgentSelector.tsx`
- ✅ `client/src/FrontEnd/components/ChatBot/AgentSelector.css`
- ✅ `client/src/FrontEnd/components/ChatBot/MultiAgentChatWindow.tsx`
- ✅ `client/src/FrontEnd/components/ChatBot/MultiAgentChatWindow.css`
- ✅ `client/src/FrontEnd/components/ChatBot/MultiAgentWidget.tsx`
- ✅ `client/src/FrontEnd/components/ChatBot/MultiAgentWidget.css`

**页面**:
- ✅ `client/src/FrontEnd/pages/MultiAgentPage.tsx`
- ✅ `client/src/FrontEnd/pages/MultiAgentPage.css`

---

## 🎨 UI特性

### 1. Agent颜色主题
每个Agent有独特的颜色主题，自动应用到：
- Avatar背景色
- 按钮颜色
- 在线状态指示器
- Loading状态文字

### 2. 响应式设计
- **桌面**: 左右分栏布局
- **平板**: 单列布局
- **手机**: Widget全屏显示

### 3. 动画效果
- 滑入动画
- 脉冲动画（在线指示器）
- Hover效果
- 平滑滚动

---

## 📖 使用示例

### 示例1: 在现有ChatBot页面中集成

```typescript
// 替换现有的ChatWindow
import MultiAgentChatWindow from '../components/ChatBot/MultiAgentChatWindow';

function ChatBotPage() {
  const [selectedAgent, setSelectedAgent] = useState('chatbot');
  
  return (
    <div>
      {/* Agent选择器 */}
      <AgentSelector 
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
      />
      
      {/* 聊天窗口 */}
      <MultiAgentChatWindow
        userId={userId}
        agentType={selectedAgent}
        agentName="AI Agent"
        onClose={() => {}}
      />
    </div>
  );
}
```

### 示例2: 添加到侧边栏

```typescript
// 在Sidebar中添加菜单项
{
  key: 'ai-assistant',
  icon: <RobotOutlined />,
  label: 'AI Assistants',
  onClick: () => navigate('/ai-assistant')
}
```

---

## 🔧 配置选项

### Agent配置
可以在`agents.ts`中自定义Agent列表：

```typescript
const AGENT_OPTIONS = [
  { 
    key: 'chatbot', 
    label: 'General Assistant', 
    icon: <RobotOutlined />, 
    color: '#1890ff' 
  },
  // ... 添加更多Agent
];
```

### 欢迎消息
可以在`MultiAgentChatWindow.tsx`中自定义：

```typescript
const WELCOME_MESSAGES: Record<string, string> = {
  chatbot: 'Your custom welcome message...',
  // ...
};
```

---

## 📊 组件层次结构

```
MultiAgentPage (页面)
├── AgentSelector (选择器)
│   └── Agent详情卡片
└── MultiAgentChatWindow (聊天窗口)
    ├── 消息列表 (MessageList - 复用现有)
    └── 输入框

或

MultiAgentWidget (浮动Widget)
├── Agent选择下拉菜单
└── MultiAgentChatWindow (弹出窗口)
```

---

## 🎯 集成步骤

### 步骤1: 添加路由
在你的路由配置中添加：

```typescript
// routes.tsx 或 App.tsx
import MultiAgentPage from './FrontEnd/pages/MultiAgentPage';

// 添加路由
{
  path: '/ai-assistant',
  element: <MultiAgentPage userId={currentUser.id} />
}
```

### 步骤2: 添加菜单项
在侧边栏或导航栏添加入口：

```typescript
{
  key: 'ai-assistant',
  icon: <RobotOutlined />,
  label: 'AI Assistants',
  // ...
}
```

### 步骤3: 测试
```bash
# 启动前端
cd client
npm start

# 启动后端
cd backend
npm run dev

# 访问
http://localhost:3000/ai-assistant
```

---

## 🐛 故障排除

### 问题1: API连接失败
**检查**: 后端是否运行在 `http://localhost:4000`

```typescript
// 如果端口不同，修改axios配置
const API_BASE = '/api/agents'; // 会自动使用proxy
```

### 问题2: Agent列表为空
**检查**: 
1. 后端agents路由是否正确注册
2. 浏览器控制台查看错误
3. 测试API: `curl http://localhost:4000/api/agents/list`

### 问题3: 样式问题
**检查**: 确保CSS文件已导入

```typescript
import './AgentSelector.css';
import './MultiAgentChatWindow.css';
```

---

## 💡 扩展建议

### 1. 添加Agent头像图片
```typescript
const AGENT_AVATARS = {
  chatbot: '/images/chatbot-avatar.png',
  purchase: '/images/purchase-avatar.png',
  // ...
};
```

### 2. 添加语音输入
```typescript
// 集成Web Speech API
const recognition = new webkitSpeechRecognition();
```

### 3. 添加快捷回复
```typescript
const QUICK_REPLIES = {
  chatbot: ['How can you help?', 'Show my requests'],
  purchase: ['Create request', 'Check suppliers'],
  // ...
};
```

### 4. 添加历史会话列表
```typescript
// 显示用户的所有会话
<SessionList 
  agentType={selectedAgent}
  userId={userId}
  onSelectSession={setSessionId}
/>
```

---

## 📝 下一步开发

### 优先级1（核心功能）
- [x] Agent选择器
- [x] 聊天窗口
- [x] API集成
- [ ] 路由集成
- [ ] 菜单入口

### 优先级2（增强功能）
- [ ] 会话历史列表
- [ ] 导出对话
- [ ] 快捷回复
- [ ] 语音输入

### 优先级3（高级功能）
- [ ] Agent协作（一个Agent调用另一个）
- [ ] 多Agent同时对话
- [ ] Agent推荐（根据问题推荐合适Agent）
- [ ] 使用统计和分析

---

## 🎉 总结

**已完成**:
✅ 完整的Multi-Agent前端系统  
✅ 6个Agent的UI支持  
✅ 响应式设计  
✅ 浮动Widget和完整页面两种模式  
✅ TypeScript类型安全  
✅ 与后端API完美对接  

**特点**:
- 🎨 美观的UI设计
- 🚀 流畅的用户体验
- 📱 移动端友好
- 🔧 易于扩展
- 💪 类型安全

**可以立即使用！** 只需要添加路由和菜单入口即可。

---

**创建日期**: 2026-06-12  
**版本**: 1.0.0  
**状态**: ✅ 可用  
**组件数**: 8个  

🎊 **前端Multi-Agent界面已完成！**
