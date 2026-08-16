#!/usr/bin/env node
/**
 * 从指定 commit 备份 record tables 的数据
 * 只备份 purchasing/supplier records，不包括 forecasting 相关的表
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMIT_HASH = 'ba2ac872d980df305f86c27f99183d49e5b7a285';
const BACKUP_FILE = path.join(__dirname, 'records_backup_from_commit.sql');

// Record tables to backup (不包括 forecasting 相关的表)
const RECORD_TABLES = [
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups'
];

console.log(`🔍 正在从 commit ${COMMIT_HASH} 备份 record 数据...\n`);

// 读取数据库连接信息
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

// 解析数据库 URL
const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
if (!match) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

console.log(`📊 数据库: ${database}@${host}:${port}`);
console.log(`📋 备份表: ${RECORD_TABLES.join(', ')}\n`);

// 使用 pg_dump 备份指定的表
try {
  const tables = RECORD_TABLES.map(t => `-t ${t}`).join(' ');
  const cmd = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} ${tables} --data-only --column-inserts -f "${BACKUP_FILE}"`;

  console.log('⚙️  执行备份...');
  execSync(cmd, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'inherit'
  });

  const stats = fs.statSync(BACKUP_FILE);
  console.log(`\n✅ 备份完成！`);
  console.log(`📁 文件: ${BACKUP_FILE}`);
  console.log(`📦 大小: ${(stats.size / 1024).toFixed(2)} KB`);

  // 显示每个表的记录数
  console.log('\n📊 当前数据库中的记录数:');
  const { PrismaClient } = require('./prisma/generated/prisma/client');
  const prisma = new PrismaClient();

  (async () => {
    for (const table of RECORD_TABLES) {
      try {
        const count = await prisma[table].count();
        console.log(`   ${table}: ${count} 条记录`);
      } catch (e) {
        console.log(`   ${table}: 无法统计`);
      }
    }
    await prisma.$disconnect();
  })();

} catch (error) {
  console.error('❌ 备份失败:', error.message);
  process.exit(1);
}
