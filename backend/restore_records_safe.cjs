#!/usr/bin/env node
/**
 * 安全恢复 record tables 的数据
 * 1. 只恢复 purchasing/supplier records
 * 2. 不影响 forecasting 相关的表 (budget_predictions, monthly_budgets 等)
 * 3. 先清空 record tables，再导入备份
 */

const { PrismaClient } = require('./prisma/generated/prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BACKUP_FILE = path.join(__dirname, 'records_backup_from_commit.sql');

// Record tables to restore
const RECORD_TABLES = [
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups'
];

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Record 数据恢复工具\n');

  // 检查备份文件
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error(`❌ 备份文件不存在: ${BACKUP_FILE}`);
    console.log('\n💡 请先运行: node backup_records_from_commit.cjs');
    process.exit(1);
  }

  const stats = fs.statSync(BACKUP_FILE);
  console.log(`📁 备份文件: ${BACKUP_FILE}`);
  console.log(`📦 大小: ${(stats.size / 1024).toFixed(2)} KB\n`);

  // 显示当前记录数
  console.log('📊 当前记录数:');
  const counts = {};
  for (const table of RECORD_TABLES) {
    try {
      counts[table] = await prisma[table].count();
      console.log(`   ${table}: ${counts[table]} 条`);
    } catch (e) {
      counts[table] = 0;
      console.log(`   ${table}: 0 条`);
    }
  }

  // 确认操作
  console.log('\n⚠️  警告: 此操作将:');
  console.log('   1. 清空以上所有 record tables');
  console.log('   2. 从备份文件恢复数据');
  console.log('   3. 不会影响 forecasting 数据 (budget_predictions, monthly_budgets 等)\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise((resolve) => {
    rl.question('确认继续? (输入 YES 继续): ', (answer) => {
      if (answer !== 'YES') {
        console.log('\n❌ 操作已取消');
        rl.close();
        process.exit(0);
      }
      rl.close();
      resolve();
    });
  });

  console.log('\n🧹 正在清空 record tables...');

  // 清空 record tables (按依赖顺序)
  for (const table of RECORD_TABLES.reverse()) {
    try {
      const result = await prisma[table].deleteMany({});
      console.log(`   ✓ ${table}: 已删除 ${result.count || counts[table]} 条`);
    } catch (e) {
      console.log(`   ⚠ ${table}: ${e.message}`);
    }
  }

  console.log('\n📥 正在从备份恢复...');

  // 读取数据库连接信息
  require('dotenv').config();
  const dbUrl = process.env.DATABASE_URL;
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    console.error('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;

  try {
    const cmd = `psql -h ${host} -p ${port} -U ${user} -d ${database} -f "${BACKUP_FILE}"`;
    execSync(cmd, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'inherit'
    });

    console.log('\n✅ 恢复完成！\n');

    // 显示恢复后的记录数
    console.log('📊 恢复后的记录数:');
    for (const table of RECORD_TABLES) {
      try {
        const count = await prisma[table].count();
        console.log(`   ${table}: ${count} 条`);
      } catch (e) {
        console.log(`   ${table}: 无法统计`);
      }
    }

  } catch (error) {
    console.error('\n❌ 恢复失败:', error.message);
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
