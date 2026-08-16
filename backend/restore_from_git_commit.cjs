#!/usr/bin/env node
/**
 * 从 Git commit ba2ac872d980df305f86c27f99183d49e5b7a285 之前恢复 record 数据
 *
 * 策略:
 * 1. Checkout 到那个 commit 之前的状态
 * 2. 启动临时数据库/导出数据
 * 3. 返回当前分支
 * 4. 只导入 record tables，不影响 forecasting 数据
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TARGET_COMMIT = 'ba2ac872d980df305f86c27f99183d49e5b7a285~1'; // 之前一个 commit
const BACKUP_FILE = path.join(__dirname, 'records_from_old_commit.sql');

// Record tables only
const RECORD_TABLES = [
  'purchase_order_records',
  'purchase_request_records',
  'supplier_delivery_records',
  'supplier_grn_records',
  'supplier_order_acknowledgement_records',
  'purchasing_lookups'
];

console.log('🔄 从 Git Commit 恢复 Record 数据工具\n');
console.log(`📍 目标 Commit: ${TARGET_COMMIT}`);
console.log(`📋 恢复表: ${RECORD_TABLES.join(', ')}\n`);

// 读取数据库配置
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
if (!match) {
  console.error('❌ Invalid DATABASE_URL');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('⚠️  此操作将:');
  console.log('   1. 使用当前数据库连接');
  console.log('   2. 导出当前数据库中 record tables 的数据作为备份');
  console.log('   3. 然后你需要手动从旧 commit 恢复数据\n');

  await new Promise((resolve) => {
    rl.question('继续? (输入 YES): ', (answer) => {
      if (answer !== 'YES') {
        console.log('\n❌ 已取消');
        rl.close();
        process.exit(0);
      }
      rl.close();
      resolve();
    });
  });

  console.log('\n📦 步骤 1: 导出当前 record 数据作为备份...');

  const currentBackup = path.join(__dirname, 'current_records_backup.sql');
  const tables = RECORD_TABLES.map(t => `-t ${t}`).join(' ');

  try {
    const cmd = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} ${tables} --data-only --column-inserts -f "${currentBackup}"`;
    execSync(cmd, {
      env: { ...process.env, PGPASSWORD: password },
      stdio: 'pipe'
    });

    const stats = fs.statSync(currentBackup);
    console.log(`✅ 当前数据已备份: ${currentBackup}`);
    console.log(`   大小: ${(stats.size / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
    process.exit(1);
  }

  console.log('📝 手动恢复步骤:\n');
  console.log('由于我们不能直接从 commit 提取数据库内容，你需要:');
  console.log('');
  console.log('方法 1 - 如果你有那个 commit 时的数据库备份:');
  console.log('   1. 找到那个时间点的数据库备份文件');
  console.log('   2. 从备份中只提取 record tables');
  console.log('   3. 运行 restore_records_safe.cjs 导入\n');
  console.log('方法 2 - 使用现有备份文件:');
  console.log('   查看 backend/ 目录下的备份文件:');
  console.log('   - old_backup.sql');
  console.log('   - temp_full_backup.sql');
  console.log('   如果其中包含正确的 record 数据，可以直接使用\n');
  console.log('方法 3 - 检查文件修改历史:');
  console.log('   如果 record 数据存储在文件中（如 JSON），可以从 git 恢复:\n');
  console.log(`   git show ${TARGET_COMMIT}:backend/data/records.json\n`);

  console.log('💡 建议: 先检查现有备份文件的内容');
}

main().catch(console.error);
