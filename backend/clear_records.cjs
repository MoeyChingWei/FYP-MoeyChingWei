#!/usr/bin/env node
/**
 * 清空所有 record tables (使用 raw SQL)
 *
 * 保留：
 * - users (所有用户)
 * - supplier_inventory_items (所有库存)
 * - forecasting 数据 (budget_predictions, monthly_budgets 等)
 * - departments, notifications 等其他表
 *
 * 删除：
 * - purchase_order_records
 * - purchase_request_records
 * - supplier_delivery_records
 * - supplier_grn_records
 * - supplier_order_acknowledgement_records
 * - purchasing_lookups
 * - supplier_type_assignments
 */

const { Client } = require('pg');
const readline = require('readline');
require('dotenv').config();

const TABLES_TO_CLEAR = [
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups',
  'supplier_type_assignments'
];

async function main() {
  console.log('🧹 清空 Record Tables 工具\n');

  // 连接数据库
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  console.log('📊 当前数据统计:');
  const counts = {};

  for (const table of TABLES_TO_CLEAR) {
    try {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count);
      console.log(`   ${table}: ${counts[table]} 条`);
    } catch (e) {
      counts[table] = 0;
      console.log(`   ${table}: 0 条`);
    }
  }

  console.log('\n✅ 保持不变的表:');
  console.log('   - users (所有用户)');
  console.log('   - supplier_inventory_items (所有库存)');
  console.log('   - departments');
  console.log('   - notifications');
  console.log('   - forecasting 数据 (budget_predictions, monthly_budgets 等)');

  console.log('\n❌ 将被清空的表:');
  TABLES_TO_CLEAR.forEach(t => console.log(`   - ${t}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise((resolve) => {
    rl.question('\n⚠️  确认清空所有 record tables? (输入 YES): ', (answer) => {
      if (answer !== 'YES') {
        console.log('\n❌ 操作已取消');
        rl.close();
        client.end();
        process.exit(0);
      }
      rl.close();
      resolve();
    });
  });

  console.log('\n🧹 正在清空表...\n');

  // 按依赖顺序反向删除
  for (const table of [...TABLES_TO_CLEAR].reverse()) {
    try {
      await client.query(`DELETE FROM ${table}`);
      console.log(`✓ ${table}: 已删除 ${counts[table]} 条`);
    } catch (e) {
      console.log(`⚠ ${table}: ${e.message}`);
    }
  }

  console.log('\n✅ 清空完成！\n');

  console.log('验证结果:');
  for (const table of TABLES_TO_CLEAR) {
    try {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      console.log(`   ${table}: ${count} 条`);
    } catch (e) {
      console.log(`   ${table}: 无法查询`);
    }
  }

  console.log('\n💡 现在可以重新创建 record database 数据了');

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
