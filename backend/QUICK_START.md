# 🚀 快速启动指南

## 改进已完成！

你的 AI Agent 系统已经成功升级，包含以下新功能：

### ✅ 已添加的文件

```
backend/
  ├── services/
  │   └── simple-logger.js          # 新增：日志系统
  ├── test-agent-improvements.js    # 新增：测试脚本
  ├── AGENT_IMPROVEMENTS.md         # 新增：详细文档
  └── QUICK_START.md                # 本文件
```

### ✅ 已修改的文件

```
backend/
  ├── services/
  │   └── deepseek-ai-service.js    # 改进：重试+超时
  ├── agents/
  │   └── base-agent.js             # 改进：日志+历史管理
  └── .gitignore                     # 更新：忽略logs/目录
```

---

## 📋 立即使用

### 1. 无需安装新依赖

所有改进都使用 Node.js 内置模块，无需安装额外包。

### 2. 运行测试

```bash
cd backend
node test-agent-improvements.js
```

**预期输出：**
```
🧪 Testing Agent Improvements
=================================

--- Test 1: Logger System ---
💬 [INFO] Test: This is an info message
✅ [SUCCESS] Test: This is a success message
⚠️ [WARN] Test: This is a warning message
❌ [ERROR] Test: This is an error message
...

✅ All tests completed!
```

### 3. 查看日志

```bash
# 查看所有日志
ls backend/logs/

# 输出：
# combined.log  error.log  info.log  success.log  warn.log

# 查看最新日志
tail -20 backend/logs/combined.log
```

### 4. 启动服务器

```bash
cd backend
npm run dev
```

**现在你的系统会自动：**
- ✅ 记录所有请求和响应
- ✅ API失败时自动重试
- ✅ 工具超时自动终止
- ✅ 长会话自动裁剪历史

---

## 🎯 验证改进效果

### Test 1: 查看实时日志

```bash
# 打开新终端窗口
cd backend
tail -f logs/combined.log

# 然后在另一个窗口测试API
# 你会看到实时日志输出
```

### Test 2: 测试API重试

```bash
# 暂时关闭网络，然后发送请求
# 系统会自动重试3次
```

### Test 3: 测试超时保护

```bash
# 发送一个复杂查询
# 如果超过90秒，会自动返回错误而不是卡死
```

---

## 📊 监控系统状态

### 查看错误日志

```bash
cat backend/logs/error.log
```

### 查看Agent性能

```bash
# 查看所有Agent请求
grep "AgentRequest" backend/logs/combined.log

# 查看平均响应时间
grep "AgentResponse" backend/logs/combined.log | grep "completed"
```

### 查看工具调用

```bash
# 查看所有工具调用
grep "ToolCall" backend/logs/combined.log

# 查看特定工具
grep "get_dashboard_stats" backend/logs/combined.log
```

---

## 🔧 自定义配置

### 调整超时时间

在 `agents/base-agent.js` 的 `chat` 方法中：

```javascript
const response = await deepseekService.chatWithTools({
  // ... 其他参数
  overallTimeoutMs: 120000,  // 改为120秒
  toolTimeoutMs: 45000,      // 改为45秒
});
```

### 调整历史消息限制

在 `agents/base-agent.js` 的 `loadSessionHistory` 调用中：

```javascript
const history = await this.loadSessionHistory(
  sessionId,
  30,    // 改为30条消息
  5000   // 改为5000 tokens
);
```

### 调整重试次数

在 `services/deepseek-ai-service.js` 的 `chatWithRetry` 中：

```javascript
async chatWithRetry(params, maxRetries = 5) {  // 改为5次
  // ...
}
```

---

## 📈 性能对比

### 改进前

```
用户请求 → API失败 → ❌ 用户看到错误
         ↓
      无法追踪问题原因
```

### 改进后

```
用户请求 → API失败 → 自动重试1 → 成功 → ✅ 用户得到响应
                   ↓
                自动重试2 → 成功 → ✅ 用户得到响应
                   ↓
                自动重试3 → 失败 → ❌ 返回友好错误
                   ↓
                完整日志记录 → 快速定位问题
```

---

## 🐛 常见问题

### Q: 日志文件在哪里？
A: `backend/logs/` 目录，如果不存在会自动创建

### Q: 日志文件会占用多少空间？
A: 每天约 10-50MB（取决于请求量），建议定期清理

### Q: 如何清空日志？
A: `rm backend/logs/*.log`

### Q: 如何关闭日志？
A: 不建议关闭，但可以修改 `simple-logger.js` 来只输出到控制台

### Q: 改进会影响现有功能吗？
A: 不会，所有改进都是向后兼容的，现有代码无需修改

---

## 📚 下一步

1. ✅ **阅读详细文档**：`AGENT_IMPROVEMENTS.md`
2. ✅ **监控日志**：`tail -f logs/combined.log`
3. ✅ **测试系统**：发送一些测试请求
4. ✅ **根据需要调整配置**

---

## 🎉 完成！

你的系统现在更加：
- 🛡️ **稳定** - 自动重试和错误恢复
- 👀 **可观测** - 完整的日志追踪
- ⚡ **高效** - 智能的资源管理
- 🚀 **可靠** - 超时保护和错误处理

如有问题，请查看 `AGENT_IMPROVEMENTS.md` 的故障排查章节。

**祝你开发顺利！** 🚀
