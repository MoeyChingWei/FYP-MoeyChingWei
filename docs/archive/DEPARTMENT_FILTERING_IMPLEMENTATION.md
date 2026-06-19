# Department-Based Dashboard Filtering Implementation

## Overview

实现了基于部门的 Dashboard 数据过滤功能。所有统计数据、图表和指标现在都会根据用户的部门显示相应的数据。

## 实现内容

### 1. 后端 API

**新文件:** `backend/routes/dashboard.js`

**端点:** `GET /api/dashboard/statistics`

**查询参数:**
- `department` (可选): 部门名称。如果提供，返回该部门的数据；如果不提供，返回所有部门的数据。

**返回数据:**
```json
{
  "success": true,
  "data": {
    "pendingApprovals": 5,
    "totalRequests": 26,
    "totalOrders": 14,
    "currentMonthSpending": 75200,
    "spendingTrend": -5.2,
    "requestsTrend": 12.5,
    "ordersTrend": 8.3,
    "trendData": [
      {
        "month": "Jan",
        "requests": 12,
        "orders": 8,
        "amount": 45000
      },
      // ... 最近6个月的数据
    ],
    "categoryData": [
      {
        "category": "Office Supplies",
        "amount": 15000,
        "count": 45
      },
      // ... 按金额排序的前10个类别
    ],
    "department": "IT Department"
  }
}
```

**功能说明:**

1. **Pending Approvals（待审批）:** 统计状态为 "pending" 或 "submitted" 的请求和订单数量

2. **Total Requests（采购申请总数）:** 该部门的采购申请总数

3. **Total Orders（采购订单总数）:** 该部门的采购订单总数

4. **Monthly Spending（本月支出）:** 计算本月所有订单的总金额（基于订单中的 items 数量和单价）

5. **Trends（趋势）:** 
   - 比较本月与上月的数据
   - 计算增长/下降百分比
   - 支持 requests、orders 和 spending 三个指标

6. **Purchasing Trend Chart（采购趋势图）:**
   - 显示最近6个月的数据
   - 包含每月的 requests、orders 和 amount

7. **Spending by Category（按类别支出）:**
   - 按金额排序显示前10个类别
   - 包含每个类别的总金额和订单数量

**数据过滤逻辑:**
- 从 `purchase_request_records` 和 `purchase_order_records` 表中读取所有记录
- 根据 payload 中的 `department` 字段过滤数据
- Super Admin（未提供 department 参数）可以看到所有部门的数据
- 其他角色只能看到自己部门的数据

### 2. 前端 API Wrapper

**新文件:** `client/src/FrontEnd/shared/api/dashboard.ts`

**函数:**
```typescript
fetchDashboardStatistics(department?: string): Promise<DashboardStatistics>
```

**TypeScript 类型定义:**
```typescript
export type DashboardStatistics = {
  pendingApprovals: number;
  totalRequests: number;
  totalOrders: number;
  currentMonthSpending: number;
  spendingTrend: number;
  requestsTrend: number;
  ordersTrend: number;
  trendData: Array<{
    month: string;
    requests: number;
    orders: number;
    amount: number;
  }>;
  categoryData: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  department: string;
};
```

### 3. 前端 Dashboard 页面更新

**修改文件:** `client/src/FrontEnd/pages/DashboardNew.tsx`

**主要变化:**

1. **导入新的 API:**
   ```typescript
   import { fetchDashboardStatistics, type DashboardStatistics } from "../shared/api/dashboard";
   ```

2. **添加状态管理:**
   ```typescript
   const [dashboardStats, setDashboardStats] = useState<DashboardStatistics | null>(null);
   const department = sessionUser?.department;
   ```

3. **加载真实数据:**
   ```typescript
   useEffect(() => {
     const loadData = async () => {
       // 获取通知
       const notifs = await fetchNotifications(sessionUser.id);
       
       // 获取 dashboard 统计数据（按部门过滤）
       // Super Admin 看到所有数据，其他用户只看到自己部门的数据
       const stats = await fetchDashboardStatistics(
         isAdmin ? undefined : department
       );
       setDashboardStats(stats);
     };
     loadData();
   }, [sessionUser?.id, isAdmin, department]);
   ```

4. **使用真实数据替换 mock 数据:**
   - 从 `dashboardStats` 中提取所有统计数据
   - 移除硬编码的 mock 数据
   - 所有图表和卡片现在显示真实的、按部门过滤的数据

### 4. 服务器配置更新

**修改文件:** `backend/server.js`

**变化:**
```javascript
import dashboardRoutes from "./routes/dashboard.js";
// ...
app.use("/api/dashboard", dashboardRoutes);
```

## 用户体验

### Super Admin（超级管理员）
- 看到**所有部门**的汇总数据
- 统计数据包括整个组织的采购活动
- 可以查看跨部门的总体趋势

### Manager / Executive / Employee（经理/主管/员工）
- 只看到**自己部门**的数据
- 所有统计卡片（Pending Approvals、Purchase Requests、Purchase Orders、Monthly Spending）仅显示本部门数据
- 图表（Purchasing Trend、Spending by Category）仅包含本部门的交易
- 趋势百分比基于本部门上月与本月的对比

### Supplier（供应商）
- 显示简化的供应商视图（不受部门过滤影响）

## 数据流

```
用户登录
  ↓
获取用户信息（包括 department）
  ↓
Dashboard 页面加载
  ↓
调用 API: GET /api/dashboard/statistics?department=<用户部门>
  ↓
后端从数据库读取所有 records
  ↓
按 payload.department 过滤
  ↓
计算统计数据和趋势
  ↓
返回 JSON 响应
  ↓
前端更新所有图表和统计卡片
```

## 数据库依赖

该实现依赖于以下数据表：
- `purchase_request_records` - 采购申请记录
- `purchase_order_records` - 采购订单记录

**重要:** 每条记录的 `payload` JSON 必须包含 `department` 字段，格式如下：
```json
{
  "localId": "...",
  "department": "IT Department",
  "items": [...],
  "status": "pending",
  ...
}
```

## 如何测试

### 1. 重启后端服务器

```bash
cd backend
npm run dev
```

### 2. 重启前端服务器

```bash
cd client
npm start
```

### 3. 测试场景

**场景 1: Super Admin 用户**
1. 使用 Super Admin 账号登录（admin@fyp.local）
2. 导航到 Dashboard/Overview 页面
3. 验证显示所有部门的汇总数据

**场景 2: 普通用户（有部门）**
1. 使用有 `department` 字段的员工账号登录
2. 导航到 Dashboard/Overview 页面
3. 验证只显示该用户部门的数据
4. 创建一些采购申请和订单
5. 刷新页面，验证数据更新

**场景 3: API 测试**
```bash
# 获取所有部门数据
curl http://localhost:4000/api/dashboard/statistics

# 获取特定部门数据
curl "http://localhost:4000/api/dashboard/statistics?department=IT%20Department"
```

## 性能考虑

当前实现：
- 每次请求都会读取所有 records
- 在内存中进行过滤和计算
- 适用于中小型数据集（< 10,000 条记录）

**未来优化建议（如果数据量大）:**
1. 在数据库层面添加过滤（使用 Prisma 的 JSON 过滤功能）
2. 添加缓存层（Redis）
3. 预先计算每日/每月的统计数据
4. 添加分页支持

## 故障排查

### 问题：图表显示空数据

**可能原因:**
1. 数据库中没有记录
2. 记录的 payload 中缺少 `department` 字段
3. `department` 字段值与用户的 `department` 不匹配

**解决方法:**
- 检查数据库中的记录：使用 Prisma Studio (`npm run prisma:studio`)
- 验证 payload 结构
- 确保创建记录时包含正确的 department 值

### 问题：所有用户都看到相同的数据

**可能原因:**
1. 前端没有传递 `department` 参数
2. 用户的 `department` 字段为空

**解决方法:**
- 检查用户的 profile，确保设置了 department
- 在浏览器 DevTools 的 Network 标签中检查 API 请求 URL

### 问题：趋势百分比不正确

**可能原因:**
- 上个月没有数据（除以零）

**解决方法:**
- 后端代码已处理这种情况（返回 0）
- 确保有足够的历史数据

## 扩展功能建议

1. **部门选择器（仅 Super Admin）:**
   - 添加下拉菜单让 Super Admin 可以查看特定部门的数据
   
2. **导出功能:**
   - 添加导出按钮，可以下载 CSV/Excel 格式的统计报表

3. **时间范围选择:**
   - 允许用户选择自定义日期范围（而不是固定的6个月）

4. **实时更新:**
   - 使用 WebSocket 或轮询实现数据的自动刷新

5. **更多指标:**
   - 平均处理时间
   - 审批通过率
   - 供应商表现评分

## 文件清单

### 新增文件
- `backend/routes/dashboard.js` - Dashboard API 路由
- `client/src/FrontEnd/shared/api/dashboard.ts` - Dashboard API wrapper

### 修改文件
- `backend/server.js` - 注册新的 dashboard 路由
- `client/src/FrontEnd/pages/DashboardNew.tsx` - 使用真实 API 数据

## 总结

该实现完成了以下目标：

✅ 所有 Dashboard 统计数据按用户部门过滤
✅ Super Admin 可以看到所有部门的汇总数据
✅ 图表（Purchasing Trend、Spending by Category）显示部门特定数据
✅ 统计卡片（Pending Approvals、Requests、Orders、Spending）显示部门特定数据
✅ 趋势指标（与上月对比）基于部门数据计算
✅ 类型安全的 TypeScript 实现
✅ 错误处理和加载状态
✅ RESTful API 设计

现在，用户在查看 Dashboard Overview 页面时，所有的 charts 和 boxes 都会根据他们的部门显示相应的数据！
