#!/usr/bin/env node
/**
 * 从 temp_full_backup.sql 恢复 record tables 数据
 * 只恢复 purchasing/supplier records，不影响 forecasting 数据
 */

const { PrismaClient } = require('./prisma/generated/prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SOURCE_BACKUP = path.join(__dirname, 'temp_full_backup.sql');
const EXTRACTED_FILE = path.join(__dirname, 'extracted_records_from_temp.sql');

// Record tables to extract and restore
const RECORD_TABLES = [
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups'
];

const prisma = new PrismaClient();

async function extractRecordData() {
  console.log('📦 从 temp_full_backup.sql 提取 record tables 数据...\n');

  if (!fs.existsSync(SOURCE_BACKUP)) {
    console.error(`❌ 源文件不存在: ${SOURCE_BACKUP}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SOURCE_BACKUP, 'utf8');
  const lines = content.split('\n');

  let extractedLines = [
    '-- Extracted record tables from temp_full_backup.sql',
    '-- Only purchasing/supplier records, no forecasting data',
    '',
  ];

  let capturing = false;
  let currentTable = null;
  let recordCount = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检查是否是 record table 的数据部分
    for (const table of RECORD_TABLES) {
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

      // 计算记录数（简单统计非空行和非注释行）
      if (currentTable && line.trim() && !line.startsWith('--') && line !== '\\.' && !line.startsWith('COPY')) {
        recordCount[currentTable]++;
      }

      // 遇到 \. 表示当前表的数据结束
      if (line.trim() === '\\.') {
        console.log(`   → ${currentTable}: ${recordCount[currentTable]} 条记录`);
        capturing = false;
        currentTable = null;
        extractedLines.push(''); // 添加空行
      }
    }
  }

  if (extractedLines.length <= 3) {
    console.error('❌ 未找到任何 record tables 数据');
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
  console.log('🔄 Record 数据恢复工具 (从 temp_full_backup.sql)\n');
  console.log('📅 这个备份来自 commit ba2ac872d980df305f86c27f99183d49e5b7a285 之前\n');

  // 显示当前记录数
  console.log('📊 当前数据库中的记录数:');
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
  console.log('   1. 从 temp_full_backup.sql 提取 record tables 数据');
  console.log('   2. 清空当前数据库中的 record tables');
  console.log('   3. 导入提取的数据');
  console.log('   4. ✅ 不会影响 forecasting 数据 (budget_predictions, monthly_budgets 等)');
  console.log('   5. ✅ 不会影响 users, departments, notifications 等其他表\n');

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

  // 步骤 1: 提取数据
  await extractRecordData();

  console.log('🧹 正在清空 record tables...');

  // 步骤 2: 清空 record tables (按依赖顺序反向)
  for (const table of [...RECORD_TABLES].reverse()) {
    try {
      const result = await prisma[table].deleteMany({});
      console.log(`   ✓ ${table}: 已删除 ${result.count || counts[table]} 条`);
    } catch (e) {
      console.log(`   ⚠ ${table}: ${e.message}`);
    }
  }

  console.log('\n📥 正在导入数据...');

  // 步骤 3: 导入数据
  require('dotenv').config();
  const dbUrl = process.env.DATABASE_URL;
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    console.error('❌ Invalid DATABASE_URL');
    await prisma.$disconnect();
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;

  try {
    const cmd = `psql -h ${host} -p ${port} -U ${user} -d ${database} -f "${EXTRACTED_FILE}"`;
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
        const diff = count - (counts[table] || 0);
        const sign = diff > 0 ? '+' : (diff < 0 ? '' : '');
        console.log(`   ${table}: ${count} 条 (${sign}${diff})`);
      } catch (e) {
        console.log(`   ${table}: 无法统计`);
      }
    }

    console.log('\n💡 提示:');
    console.log('   - 提取的数据保存在: extracted_records_from_temp.sql');
    console.log('   - 如果需要，可以再次运行此脚本恢复');
    console.log('   - Forecasting 数据未受影响');

  } catch (error) {
    console.error('\n❌ 恢复失败:', error.message);
    console.error('\n如果遇到权限问题，请确保 psql 已安装并在 PATH 中');
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
