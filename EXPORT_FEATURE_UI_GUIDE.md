# 购买请求导出功能 - UI指南

## 功能位置

### 聊天机器人页面 - 侧边栏

```
┌─────────────────────────────────────┐
│  ChatBot Sidebar                    │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ➕ New Chat                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ⬇️ Export Purchase Requests │ │  <-- 新增按钮
│  │     ▼                         │ │
│  └───────────────────────────────┘ │
│         │                           │
│         └─> 下拉菜单:               │
│             • 📊 Export as CSV      │
│             • 📄 Export as JSON     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Chat Session 1               │ │
│  ├───────────────────────────────┤ │
│  │  Chat Session 2               │ │
│  ├───────────────────────────────┤ │
│  │  Chat Session 3               │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## 使用流程

### 步骤 1：点击导出按钮
```
用户操作：点击 "Export Purchase Requests" 按钮
        ↓
     显示下拉菜单
```

### 步骤 2：选择格式
```
下拉菜单选项：
┌──────────────────────────┐
│ 📊 Export as CSV         │  <-- 推荐用于Excel
├──────────────────────────┤
│ 📄 Export as JSON        │  <-- 适合开发人员
└──────────────────────────┘
```

### 步骤 3：下载文件
```
用户选择格式
      ↓
   显示加载提示
      ↓
  "Preparing export..."
      ↓
   文件自动下载
      ↓
  显示成功消息
"Successfully exported X purchase request(s)"
```

## 聊天机器人中的使用

### 自然语言命令示例

```
用户: "export all purchase requests"
      ↓
AI助手: "✅ Export ready! I've prepared 32 purchase request(s) in CSV format.

**Export Details:**
- Records: 32
- Format: CSV
- Status: ALL
- Department: IT

The data is ready and includes all line items with full details..."
```

### 其他命令示例

```
✅ "download purchase requests"
✅ "export pending requests as CSV"
✅ "给我一个包含所有购买请求的文件"
✅ "导出已批准的采购申请"
```

## 导出文件示例

### CSV文件（在Excel中打开）
```
+----------------+---------+------------+---------------+
| PR Number      | Status  | Department | Requested By  |
+----------------+---------+------------+---------------+
| PR-20260621-001| PENDING | IT         | John Doe      |
| PR-20260621-001| PENDING | IT         | John Doe      |
| PR-20260621-002| APPROVED| HR         | Jane Smith    |
+----------------+---------+------------+---------------+

继续显示：
| Request Date | Email            | Item Name | Quantity | Unit  |
|--------------|------------------|-----------|----------|-------|
| 2026-06-21   | john@example.com | Laptop    | 5        | piece |
| 2026-06-21   | john@example.com | Mouse     | 5        | piece |
| 2026-06-20   | jane@example.com | Chair     | 10       | piece |
```

### JSON文件结构
```json
[
  {
    "prNumber": "PR-20260621-001",
    "status": "PENDING",
    "department": "IT",
    "requestBy": "John Doe",
    "requestDate": "2026-06-21",
    "lineItems": [
      {
        "itemName": "Laptop",
        "quantity": 5,
        "unitPrice": 3500,
        "totalPrice": 17500
      }
    ]
  }
]
```

## 用户反馈

### 加载状态
```
⏳ Preparing export...
```

### 成功状态
```
✅ Successfully exported 32 purchase request(s)
```

### 错误状态
```
❌ No purchase requests found to export
❌ Failed to export purchase requests: [错误详情]
```

## 文件命名规则

### 格式
```
[部门]_Purchase_Requests_[日期].[格式]
```

### 示例
```
IT_Purchase_Requests_20260621.csv
HR_Purchase_Requests_20260621.json
Purchase_Requests_20260621.csv  (Super Admin导出全部)
```

## 权限控制

### 普通用户
```
用户: John Doe (IT部门)
      ↓
   导出范围
      ↓
只能看到IT部门的购买请求
```

### Super Admin
```
用户: Admin (Super Admin角色)
      ↓
   导出范围
      ↓
可以看到所有部门的购买请求
```

## 数据过滤选项

虽然UI按钮导出所有数据，但通过AI助手可以使用过滤：

```
"export pending purchase requests"     → 只导出待处理的
"export approved requests"             → 只导出已批准的
"export submitted purchase requests"   → 只导出已提交的
```

## 最佳实践

### 1. 定期导出备份
```
建议：每周导出一次作为备份
格式：CSV（易于存档）
```

### 2. 数据分析
```
目的：用于报告和分析
格式：CSV（可直接导入Excel/Power BI）
工具：Excel、Google Sheets、Power BI
```

### 3. 系统集成
```
目的：与其他系统集成
格式：JSON（结构化数据）
用途：API集成、数据迁移
```

## 技术细节（供开发人员参考）

### API端点
```
POST /api/chatbot/export-purchase-requests

请求体：
{
  "userId": 1,
  "format": "csv",    // 或 "json"
  "status": "ALL",    // 或 "PENDING", "APPROVED", 等
  "limit": 100
}

响应：文件下载
```

### 前端函数
```javascript
import { exportPurchaseRequests } from './chatbot-api';

const result = await exportPurchaseRequests({
  userId: 1,
  format: 'csv',
  status: 'ALL',
  limit: 100
});

console.log(`Exported ${result.recordCount} records`);
```

## 故障排除

### 问题1：按钮不显示
- 检查：是否已登录
- 检查：前端是否已重新编译
- 解决：刷新页面

### 问题2：导出失败
- 检查：网络连接
- 检查：后端服务器是否运行
- 查看：浏览器控制台错误信息

### 问题3：文件为空
- 检查：是否有购买请求数据
- 检查：用户权限（部门访问）
- 尝试：使用Super Admin账户测试

## 总结

导出功能提供了：
✅ 简单易用的UI界面
✅ 多种导出格式选择
✅ AI助手自然语言支持
✅ 完整的权限控制
✅ 自动文件命名
✅ 清晰的用户反馈

享受使用新功能！ 🎉
