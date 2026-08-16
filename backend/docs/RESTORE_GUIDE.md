# Record 数据恢复指南

## 问题说明
从 commit `ba2ac872d980df305f86c27f99183d49e5b7a285` 开始实现 forecasting 功能后，之前的 record database 数据丢失了。

## 解决方案
使用 `temp_full_backup.sql` 文件恢复 record 数据，该文件包含了正确的历史数据。

## 📋 恢复的表 (只恢复这些，不影响其他数据)
- `purchase_order_records`
- `purchase_request_records`
- `supplier_delivery_records`
- `supplier_grn_records`
- `supplier_order_acknowledgement_records`
- `purchasing_lookups`

## ✅ 不会影响的表 (保持不变)
- `budget_predictions` (forecasting 数据)
- `monthly_budgets` (forecasting 数据)
- `budget_adjustment_requests` (forecasting 数据)
- `users`, `departments`, `notifications` (所有其他表)

## 🚀 使用步骤

### 1. 进入 backend 目录
```powershell
cd backend
```

### 2. 运行恢复脚本
```powershell
node restore_records_from_temp_backup.cjs
```

### 3. 确认操作
脚本会显示：
- 当前数据库中各表的记录数
- 将要执行的操作
- 要求输入 `YES` 确认

### 4. 等待完成
脚本会：
1. 从 `temp_full_backup.sql` 提取 record tables 数据
2. 清空当前的 record tables
3. 导入提取的数据
4. 显示恢复后的记录数

## 📊 预期结果

根据 `temp_full_backup.sql` 的内容，应该恢复：
- `purchase_order_records`: 约 1 条记录
- `purchase_request_records`: 约 7 条记录
- `supplier_delivery_records`: 数据待确认
- `supplier_grn_records`: 数据待确认
- `supplier_order_acknowledgement_records`: 数据待确认
- `purchasing_lookups`: 数据待确认

## 🔍 验证恢复

恢复完成后，可以运行以下命令验证：

```javascript
// 在 backend 目录
node -e "
const { PrismaClient } = require('./prisma/generated/prisma/client');
const prisma = new PrismaClient();

(async () => {
  const prCount = await prisma.purchase_request_records.count();
  const poCount = await prisma.purchase_order_records.count();
  
  console.log('Purchase Request Records:', prCount);
  console.log('Purchase Order Records:', poCount);
  
  // 显示一些样本数据
  const samples = await prisma.purchase_request_records.findMany({ take: 2 });
  console.log('\\n样本数据:');
  samples.forEach(r => {
    const payload = typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload;
    console.log(`- ${payload.prNumber}: ${payload.status}`);
  });
  
  await prisma.$disconnect();
})();
"
```

## ⚠️ 注意事项

1. **备份当前数据**: 脚本会先将当前数据导出为备份
2. **需要 psql**: 确保 PostgreSQL 客户端工具已安装
3. **数据库权限**: 确保有足够的权限操作数据库
4. **不可逆操作**: 一旦确认，将清空并替换 record tables

## 🆘 如果出错

如果恢复失败，可以：
1. 检查 `extracted_records_from_temp.sql` 文件是否正确生成
2. 手动使用 psql 导入：
   ```powershell
   psql -h localhost -p 5432 -U postgres -d FYPData -f extracted_records_from_temp.sql
   ```
3. 联系开发者获取帮助

## 📁 相关文件

- `temp_full_backup.sql` - 源备份文件（包含正确的数据）
- `restore_records_from_temp_backup.cjs` - 恢复脚本
- `extracted_records_from_temp.sql` - 提取的数据（运行后生成）

## 💡 其他脚本

如果你想使用其他备份文件：
- `restore_records_from_old_backup.cjs` - 从 `old_backup.sql` 恢复（该文件为空）
- `backup_records_from_commit.cjs` - 从当前数据库备份
- `restore_records_safe.cjs` - 通用恢复脚本

---

**建议**: 先运行 `restore_records_from_temp_backup.cjs`，因为 `temp_full_backup.sql` 包含实际数据。
