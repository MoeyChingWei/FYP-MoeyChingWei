#!/usr/bin/env node
/**
 * 项目日志更新工具
 * 用于自动更新 PROJECT-LOG.md
 *
 * 使用方法:
 * node scripts/update-log.js --type "feat" --title "新功能标题" --content "详细内容"
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'PROJECT-LOG.md');

// 获取当前日期
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// 获取当前时间
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
}

// 读取现有日志
function readLog() {
  if (!fs.existsSync(LOG_FILE)) {
    console.error('❌ PROJECT-LOG.md 不存在');
    process.exit(1);
  }
  return fs.readFileSync(LOG_FILE, 'utf-8');
}

// 更新"最后更新"时间
function updateLastModified(content) {
  const date = getCurrentDate();
  return content.replace(
    /\*\*最后更新\*\*:.*$/m,
    `**最后更新**: ${date}`
  ).replace(
    /\*\*最后更新时间\*\*:.*$/m,
    `**最后更新时间**: ${date}`
  );
}

// 添加新的日志条目
function addLogEntry(content, type, title, details) {
  const date = getCurrentDate();
  const time = getCurrentTime();

  // 构建新条目
  const newEntry = `
### ${date} - ${title}

#### 类型
${type}

#### 详细说明
${details}

#### 执行时间
${date} ${time}

---
`;

  // 在"开发日志"部分后插入
  const sections = content.split('## 开发日志');
  if (sections.length < 2) {
    console.error('❌ 找不到"开发日志"部分');
    process.exit(1);
  }

  sections[1] = '\n\n' + newEntry + sections[1].substring(2);
  return sections.join('## 开发日志');
}

// 添加维护记录
function addMaintenanceRecord(content, record) {
  const date = getCurrentDate();

  const newRecord = `### ${date}\n${record}\n\n`;

  // 在"维护记录"部分后插入
  const sections = content.split('## 维护记录');
  if (sections.length < 2) {
    console.error('❌ 找不到"维护记录"部分');
    process.exit(1);
  }

  sections[1] = '\n\n' + newRecord + sections[1].substring(2);
  return sections.join('## 维护记录');
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📖 项目日志更新工具

用法:
  node update-log.js --type <类型> --title <标题> --content <内容>

  或添加维护记录:
  node update-log.js --maintenance <记录内容>

示例:
  node update-log.js --type "bug-fix" --title "修复登录问题" --content "修复了session过期导致的登录失效问题"
  node update-log.js --maintenance "- ✅ 修复了ChatBot响应超时问题"
    `);
    process.exit(0);
  }

  let content = readLog();

  // 检查是否是维护记录
  const maintenanceIndex = args.indexOf('--maintenance');
  if (maintenanceIndex !== -1 && args[maintenanceIndex + 1]) {
    const record = args[maintenanceIndex + 1];
    content = addMaintenanceRecord(content, record);
    content = updateLastModified(content);
    fs.writeFileSync(LOG_FILE, content, 'utf-8');
    console.log('✅ 维护记录已添加到 PROJECT-LOG.md');
    return;
  }

  // 解析参数
  const typeIndex = args.indexOf('--type');
  const titleIndex = args.indexOf('--title');
  const contentIndex = args.indexOf('--content');

  if (typeIndex === -1 || titleIndex === -1 || contentIndex === -1) {
    console.error('❌ 缺少必要参数: --type, --title, --content');
    process.exit(1);
  }

  const type = args[typeIndex + 1];
  const title = args[titleIndex + 1];
  const details = args[contentIndex + 1];

  // 添加日志条目
  content = addLogEntry(content, type, title, details);
  content = updateLastModified(content);

  // 写回文件
  fs.writeFileSync(LOG_FILE, content, 'utf-8');
  console.log('✅ 日志已更新到 PROJECT-LOG.md');
}

main();
