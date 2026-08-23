# Agent Enhancement Testing Guide

## 完成的功能

### Task 1: General Assistant (ChatBot Agent) 超级智能增强 ✅

**新增功能：**
1. ✅ 通用数据库访问 - 可查询所有表
2. ✅ 自主文件生成和导出 - 自动生成并提供下载链接
3. ✅ 动态性能分配 - 根据任务复杂度调整响应质量
4. ✅ 导出格式选择 - AI 会主动询问用户要 Excel/PDF/CSV

**修改文件：**
- `backend/agents/chatbot/chatbot-agent-v2.js`
  - 添加了 4 个新工具：`query_database`, `aggregate_data`, `export_data`, `generate_report`
  - 添加了复杂度检测方法 `detectComplexity()`
  - 重写了 `chat()` 方法实现动态性能分配
  - 更新了系统 prompt 使其像 ChatGPT 一样智能

### Task 2: Analytics Agent 预测增强 ✅

**新增功能：**
1. ✅ 多模型集成预测 - Holt-Winters 50% + Moving Average 30% + Linear Regression 20%
2. ✅ 置信度评分 - very_high, high, medium, low（基于模型一致性和数据质量）
3. ✅ 预测区间 - 提供 upper/lower bounds
4. ✅ 离群值检测 - Z-score 算法自动清理异常数据
5. ✅ 扩展历史数据 - 使用 24 个月数据（而不是全部）

**修改文件：**
- `backend/agents/analytics/analytics-agent.js`
  - 添加了 6 个新辅助函数
  - 完全重写了 `predict_future_spending` 工具
  - 更新了系统 prompt

- `backend/services/budget-prediction-service.js`
  - 启用了工具调用（之前被禁用）
  - 更新了 prompt 以使用新的预测工具
  - 保存预测区间和模型分解数据

---

## 测试方法

### A. 测试 ChatBot 超级智能功能

启动后端和前端，然后登录系统，打开聊天机器人。

#### 1. 测试数据库查询
输入以下问题：
```
Show me all suppliers
List all pending purchase requests
Find users in IT department
```

**预期结果：**
- AI 自动调用 `query_database` 工具
- 返回结构化数据
- 可以显示表格形式的结果

#### 2. 测试聚合计算
输入以下问题：
```
Calculate total spending by department
How many purchase requests are approved?
What's the average budget for each department?
```

**预期结果：**
- AI 调用 `aggregate_data` 工具
- 执行 SUM, COUNT, AVG 等聚合操作
- 返回计算结果

#### 3. 测试导出功能
输入以下问题：
```
Export all suppliers to Excel
Generate a report of my purchase requests
Download budget data
```

**预期结果：**
- AI 主动询问："Would you like this as Excel, PDF, or CSV?"
- 用户选择格式后，AI 调用 `export_data` 工具
- 生成文件并返回下载链接：`/api/chatbot/download/filename.xlsx`
- 文件保存在 `backend/exports/` 目录

#### 4. 测试动态性能分配

测试不同复杂度的任务，观察响应质量差异：

**Simple 任务（1024 tokens, temp 0.7）：**
```
Hello
What is your name?
Help
```

**Medium 任务（2048 tokens, temp 0.9）：**
```
Show me suppliers
List purchase requests
```

**Complex 任务（4096 tokens, temp 1.0）：**
```
Analyze spending trends for my department
Export all purchase data with calculations
```

**Advanced 任务（8192 tokens, temp 1.0）：**
```
Generate a comprehensive analysis report of purchasing patterns
Create a detailed budget allocation report with insights
```

**预期结果：**
- 后端日志显示检测到的复杂度等级
- 简单任务快速响应
- 复杂任务提供更详细的分析

**检查日志：**
```bash
# 在后端日志中查看
grep "Task complexity" backend/logs/app.log
```

---

### B. 测试 Analytics Agent 增强预测

#### 方法 1：通过 Forecasting 页面（推荐）

1. 登录系统
2. 进入 **Budget Management** → **Department Budget Forecasting**
3. 选择一个有历史数据的部门
4. 点击 **"⚡ Generate AI Prediction"** 按钮
5. 等待 AI 处理（约 5-15 秒）

**预期结果：**
- 成功生成预测
- 在数据库 `budgetPrediction` 表中查看新记录：
  - `algorithm` 字段应该是 "ensemble" 或包含 "Multi-Model"
  - `comparisonData` JSON 字段包含：
    ```json
    {
      "predictionInterval": {
        "upper": [array of upper bounds],
        "lower": [array of lower bounds]
      },
      "modelBreakdown": {
        "holtWinters": [array],
        "movingAverage": [array],
        "linearRegression": [array]
      },
      "usedFallback": false
    }
    ```
  - `confidence` 字段应该是新的等级（可能是 "very_high", "high", "medium", "low"）

#### 方法 2：通过 Chatbot 询问

在聊天机器人中输入：
```
Predict my department's spending for next 6 months
What will be our budget forecast for Q1 2027?
Show me spending prediction with confidence intervals
```

**预期结果：**
- ChatBot 路由到 Analytics Agent
- Analytics Agent 调用 `predict_future_spending` 工具
- 返回包含：
  - 多模型集成预测结果
  - 置信度等级
  - 预测区间（upper/lower）
  - 各个模型的分解数据

---

### C. 验证数据持久化

#### 检查导出文件：
```bash
ls -la backend/exports/
# 或在 Windows PowerShell
dir backend\exports
```

**预期：**
- 文件以格式命名：`{filename}-{timestamp}.{extension}`
- 支持的格式：`.json`, `.csv`, `.xlsx`, `.pdf`
- 文件在被下载后会自动删除（需要实现下载端点）

#### 检查数据库记录：

**预测数据：**
```sql
SELECT 
  id, 
  departmentId, 
  targetYear, 
  targetMonth, 
  predictedAmount, 
  confidence, 
  algorithm,
  comparisonData
FROM budgetPrediction
ORDER BY createdAt DESC
LIMIT 5;
```

**查看增强数据：**
```sql
SELECT 
  comparisonData->'predictionInterval' as prediction_interval,
  comparisonData->'modelBreakdown' as model_breakdown,
  confidence
FROM budgetPrediction
WHERE comparisonData->'modelBreakdown' IS NOT NULL;
```

---

## 测试检查清单

### ChatBot 功能
- [ ] 可以查询任意数据库表
- [ ] 可以执行聚合计算
- [ ] 导出功能会主动询问格式
- [ ] 文件成功生成并提供下载链接
- [ ] 简单问题快速响应
- [ ] 复杂任务提供详细分析
- [ ] 日志显示正确的复杂度检测

### Analytics Agent 功能
- [ ] Forecasting 页面可以生成预测
- [ ] 预测使用了多模型集成（检查 `algorithm` 字段）
- [ ] 返回了新的置信度等级
- [ ] `comparisonData` 包含 `predictionInterval`
- [ ] `comparisonData` 包含 `modelBreakdown`
- [ ] 通过 Chatbot 询问预测也能工作
- [ ] 没有历史数据时使用 fallback（`usedFallback: true`）

---

## 已知限制

1. **导出功能**：
   - 当前仅实现 JSON 和 CSV 导出
   - Excel 和 PDF 需要完整的 ExportService 集成
   - 文件下载端点需要实现自动清理

2. **前端显示**：
   - Forecasting 页面当前不显示预测区间图表
   - 需要更新 `PredictionCard` 组件来渲染新数据
   - 可以在数据库中验证数据已正确存储

3. **性能**：
   - 首次调用可能较慢（DeepSeek API 冷启动）
   - 大数据量查询可能需要优化分页

---

## 调试提示

### 查看后端日志
```bash
tail -f backend/logs/app.log
# 或
cat backend/logs/app.log | grep "ChatbotAgent\|AnalyticsAgent"
```

### 常见问题

**Q: 预测仍然使用旧算法？**
- 检查 `availableTools` 是否包含 `'predict_future_spending'`
- 查看日志确认工具是否被调用
- 验证 Analytics Agent 的工具定义没有被覆盖

**Q: 导出功能返回错误？**
- 检查 `backend/exports/` 目录是否存在（首次会自动创建）
- 查看后端日志的错误信息
- 验证文件写入权限

**Q: ChatBot 不会主动询问导出格式？**
- 检查系统 prompt 是否包含导出指令
- 验证 AI 是否调用了 `export_data` 工具
- 可能需要明确说 "export" 或 "download"

---

## 技术实现摘要

### 代码位置

**ChatBot Agent：**
- 主文件：`backend/agents/chatbot/chatbot-agent-v2.js`
- 新增常量：`PERFORMANCE_PROFILES` (line ~13)
- 新工具定义：lines ~200-400
- 工具处理器：lines ~811-950+
- 复杂度检测：`detectComplexity()` method
- 动态性能：`chat()` method override

**Analytics Agent：**
- 主文件：`backend/agents/analytics/analytics-agent.js`
- 辅助函数：lines ~68-150
  - `removeOutliers()`
  - `movingAveragePredict()`
  - `linearTrendPredict()`
  - `simpleExponentialSmoothing()`
  - `calculateConfidence()`
  - `calculatePredictionInterval()`
- 增强工具：`predict_future_spending` handler (lines ~454-602)

**Prediction Service：**
- 文件：`backend/services/budget-prediction-service.js`
- 修改函数：`callAnalyticsAgent()` (line ~330)
- 启用工具调用：`availableTools: ['predict_future_spending']`
- 存储逻辑：`generateDepartmentPrediction()` (line ~429)

---

## 下一步建议

如果测试成功，可以考虑：

1. **前端增强**：
   - 更新 `PredictionCard` 显示预测区间图表
   - 添加模型分解的可视化
   - 显示置信度等级的图标/颜色

2. **完整导出**：
   - 集成完整的 ExportService（Excel, PDF）
   - 实现下载端点和自动清理
   - 添加导出历史记录

3. **性能优化**：
   - 缓存常用查询结果
   - 实现查询结果分页
   - 添加请求限流

4. **用户体验**：
   - 添加加载动画
   - 显示 AI 处理进度
   - 保存聊天历史

---

测试愉快！如有问题，检查日志或数据库记录进行调试。
