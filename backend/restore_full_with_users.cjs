#!/usr/bin/env node
/**
 * 从 temp_full_backup.sql 恢复多个表的数据
 *
 * 恢复的表：
 * - users (10个用户)
 * - supplier_type_assignments (4条)
 * - purchase_order_records
 * - purchase_request_records (7条)
 * - supplier_delivery_records
 * - supplier_grn_records
 * - supplier_order_acknowledgement_records
 * - purchasing_lookups
 *
 * 不影响：
 * - supplier_inventory_items (不在备份中，保持不变)
 * - forecasting 数据 (budget_predictions, monthly_budgets 等)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SOURCE_BACKUP = path.join(__dirname, 'temp_full_backup.sql');
const EXTRACTED_FILE = path.join(__dirname, 'extracted_full_restore.sql');

// 要恢复的表
const TABLES_TO_RESTORE = [
  'users',
  'supplier_type_assignments',
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups'
];

async function extractData() {
  console.log('📦 从 temp_full_backup.sql 提取数据...\n');

  if (!fs.existsSync(SOURCE_BACKUP)) {
    console.error(`❌ 源文件不存在: ${SOURCE_BACKUP}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SOURCE_BACKUP, 'utf8');
  const lines = content.split('\n');

  let extractedLines = [
    '-- Extracted data from temp_full_backup.sql',
    '-- Users, supplier assignments, and purchasing records',
    '-- Does NOT include supplier_inventory_items or forecasting data',
    '',
  ];

  let capturing = false;
  let currentTable = null;
  let recordCount = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检查是否是要恢复的表的数据部分
    for (const table of TABLES_TO_RESTORE) {
      if (line.includes(`Data for Name: ${table}`) && line.includes('Type: TABLE DATA')) {
        capturing = true;
        currentTable = table;
        recordCount[table] = 0;
        console.log(`✓ 找到 ${table}`);
        break;
      }
    }

    if (capturing) {
      extractedLines.push(line);

      // 计算记录数
      if (currentTable && line.trim() && !line.startsWith('--') &&
          line !== '\\.' && !line.startsWith('COPY') && !line.startsWith('SELECT')) {
        recordCount[currentTable]++;
      }

      // 遇到 \. 表示当前表的数据结束
      if (line.trim() === '\\.') {
        console.log(`   → ${recordCount[currentTable]} 条记录`);
        capturing = false;
        currentTable = null;
        extractedLines.push('');
      }
    }
  }

  if (extractedLines.length <= 4) {
    console.error('❌ 未找到任何数据');
    process.exit(1);
  }

  // 写入提取的数据
  fs.writeFileSync(EXTRACTED_FILE, extractedLines.join('\n'), 'utf8');

  const stats = fs.statSync(EXTRACTED_FILE);
  console.log(`\n✅ 数据已提取到: ${EXTRACTED_FILE}`);
  console.log(`📦 大小: ${(stats.size / 1024).toFixed(2)} KB\n`);

  return EXTRACTED_FILE;
}

async function main() {
  console.log('🔄 完整数据恢复工具\n');
  console.log('📋 将恢复以下表:');
  TABLES_TO_RESTORE.forEach(t => console.log(`   - ${t}`));

  console.log('\n⚠️  重要提示:');
  console.log('   ✅ 会恢复: users (10个用户), supplier_type_assignments (4条)');
  console.log('   ✅ 会恢复: purchase records (约7条PR + 1条PO)');
  console.log('   ❌ 不会恢复: supplier_inventory_items (不在备份中)');
  console.log('   ❌ 不会影响: forecasting 数据\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise((resolve) => {
    rl.question('⚠️  这将替换现有的 users 和 records 数据！确认继续? (输入 YES): ', (answer) => {
      if (answer !== 'YES') {
        console.log('\n❌ 操作已取消');
        rl.close();
        process.exit(0);
      }
      rl.close();
      resolve();
    });
  });

  // 步骤 1: 提取数据
  await extractData();

  console.log('📥 数据已准备好，现在需要手动导入\n');
  console.log('由于 psql 不可用，请按以下步骤操作:\n');
  console.log('方法 1 - 使用 pgAdmin 或其他 PostgreSQL 客户端:');
  console.log('   1. 打开 pgAdmin 或 DBeaver');
  console.log('   2. 连接到 FYPData 数据库');
  console.log('   3. 先清空要恢复的表:');
  console.log('      DELETE FROM purchase_order_records;');
  console.log('      DELETE FROM purchase_request_records;');
  console.log('      DELETE FROM supplier_delivery_records;');
  console.log('      DELETE FROM supplier_grn_records;');
  console.log('      DELETE FROM supplier_order_acknowledgement_records;');
  console.log('      DELETE FROM purchasing_lookups;');
  console.log('      DELETE FROM supplier_type_assignments;');
  console.log('      DELETE FROM users WHERE id > 1; -- 保留 admin');
  console.log('   4. 执行 extracted_full_restore.sql 文件\n');

  console.log('方法 2 - 安装 PostgreSQL 命令行工具:');
  console.log('   1. 下载并安装 PostgreSQL (如果还没有):');
  console.log('      https://www.postgresql.org/download/windows/');
  console.log('   2. 添加 PostgreSQL bin 目录到 PATH');
  console.log('   3. 重新运行此脚本\n');

  console.log('💡 提取的文件: extracted_full_restore.sql');
}

main().catch(console.error);
