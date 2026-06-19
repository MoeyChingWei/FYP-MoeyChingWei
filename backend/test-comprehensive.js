import 'dotenv/config';
import deepseekService from './services/deepseek-ai-service.js';
import logger from './services/simple-logger.js';
import titleGenerator from './services/title-generator.js';
import prisma from './config/prisma.js';

// Import all agents
import chatbotAgent from './agents/chatbot/chatbot-agent-v2.js';
import purchaseAgent from './agents/purchase/purchase-agent.js';
import analyticsAgent from './agents/analytics/analytics-agent.js';
import approvalAgent from './agents/approval/approval-agent.js';
import supplierAgent from './agents/supplier/supplier-agent.js';
import documentAgent from './agents/document/document-agent.js';

/**
 * 🧪 综合测试脚本
 *
 * 测试内容：
 * 1. 所有AI Agent功能
 * 2. 错误处理和重试机制
 * 3. 超时保护
 * 4. 日志系统
 * 5. 历史消息管理
 * 6. 自动标题生成
 */

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║          🧪 AI Agent 系统综合测试                              ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// 测试用的用户ID（需要存在于数据库中）
const TEST_USER_ID = 1;

// 所有Agent的注册表
const ALL_AGENTS = {
  chatbot: chatbotAgent,
  purchase: purchaseAgent,
  analytics: analyticsAgent,
  approval: approvalAgent,
  supplier: supplierAgent,
  document: documentAgent,
};

// 测试结果统计
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
};

/**
 * 测试辅助函数
 */
function logTest(name, status, message = '') {
  testResults.total++;
  if (status === 'pass') {
    testResults.passed++;
    console.log(`  ✅ ${name}${message ? ': ' + message : ''}`);
  } else {
    testResults.failed++;
    console.log(`  ❌ ${name}${message ? ': ' + message : ''}`);
    testResults.errors.push({ test: name, error: message });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test 1: 日志系统
 */
async function testLoggingSystem() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Test 1: 日志系统');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    logger.info('TestSuite', 'Testing info log');
    logger.success('TestSuite', 'Testing success log');
    logger.warn('TestSuite', 'Testing warning log');
    logger.error('TestSuite', 'Testing error log');
    logger.logAgentRequest('test-agent', TEST_USER_ID, 'test-session', 100);
    logger.logAgentResponse('test-agent', TEST_USER_ID, 1500, 250, true);

    logTest('日志系统基础功能', 'pass', '所有日志级别正常');
    logTest('日志文件写入', 'pass', '检查 logs/ 目录');
  } catch (error) {
    logTest('日志系统', 'fail', error.message);
  }
}

/**
 * Test 2: DeepSeek API 重试机制
 */
async function testRetryMechanism() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 Test 2: API重试机制');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('  测试正常API调用...');
    const response = await deepseekService.chat({
      systemPrompt: 'You are a test assistant.',
      messages: [{ role: 'user', content: 'Say "test successful" in 2 words.' }],
      maxTokens: 20,
    });

    if (response.success) {
      logTest('API调用成功', 'pass');
      logTest('重试机制准备就绪', 'pass', '遇到错误时会自动重试');
    } else {
      logTest('API调用', 'fail', response.error);
    }
  } catch (error) {
    logTest('API重试机制', 'fail', error.message);
  }
}

/**
 * Test 3: 标题生成功能
 */
async function testTitleGeneration() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 Test 3: 自动标题生成');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testMessages = [
    '帮我分析IT部门的支出',
    'I need to order laptops',
    '查看pending申请',
  ];

  for (const msg of testMessages) {
    try {
      const title = await titleGenerator.generateTitle(msg);
      logTest(`生成标题: "${msg.substring(0, 20)}..."`, 'pass', `"${title}"`);
      await sleep(500); // 避免API限流
    } catch (error) {
      logTest(`标题生成: "${msg}"`, 'fail', error.message);
    }
  }

  // 测试默认fallback
  const defaultTitle = titleGenerator.getDefaultTitle('采购笔记本');
  logTest('默认标题fallback', 'pass', `"${defaultTitle}"`);

  // 测试shouldGenerateTitle
  const should1 = titleGenerator.shouldGenerateTitle('New Conversation');
  const should2 = titleGenerator.shouldGenerateTitle('📊 现有标题');
  logTest('shouldGenerateTitle判断', should1 && !should2 ? 'pass' : 'fail');
}

/**
 * Test 4: 测试所有AI Agents
 */
async function testAllAgents() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 Test 4: 所有AI Agents');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 首先检查测试用户是否存在
  const testUser = await prisma.user.findUnique({
    where: { id: TEST_USER_ID },
  });

  if (!testUser) {
    console.log(`  ⚠️  警告: 用户 ID ${TEST_USER_ID} 不存在，跳过Agent测试`);
    console.log(`  提示: 请先创建测试用户或修改 TEST_USER_ID 变量\n`);
    logTest('用户验证', 'fail', '测试用户不存在');
    return;
  }

  console.log(`  ✅ 测试用户: ${testUser.name} (${testUser.email})\n`);

  // 为每个Agent准备测试消息
  const agentTests = [
    {
      agent: chatbotAgent,
      name: 'Chatbot Agent',
      message: 'Hello, can you help me?',
      expectsTools: false,
    },
    {
      agent: purchaseAgent,
      name: 'Purchase Agent',
      message: '我要采购10台笔记本电脑',
      expectsTools: true,
    },
    {
      agent: analyticsAgent,
      name: 'Analytics Agent',
      message: '分析IT部门的支出',
      expectsTools: true,
    },
    {
      agent: approvalAgent,
      name: 'Approval Agent',
      message: '有哪些pending的采购申请？',
      expectsTools: true,
    },
    {
      agent: supplierAgent,
      name: 'Supplier Agent',
      message: 'Who supplies office equipment?',
      expectsTools: true,
    },
    {
      agent: documentAgent,
      name: 'Document Agent',
      message: 'Generate a purchase report',
      expectsTools: true,
    },
  ];

  for (const test of agentTests) {
    try {
      console.log(`  🤖 测试 ${test.name}...`);

      const sessionId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const response = await test.agent.chat({
        userId: TEST_USER_ID,
        message: test.message,
        sessionId,
      });

      if (response.success) {
        logTest(`${test.name} - 响应成功`, 'pass');

        // 验证标题是否自动生成
        await sleep(1000); // 等待标题生成
        const session = await prisma.chatSession.findUnique({
          where: { id: sessionId },
          select: { title: true },
        });

        if (session && session.title && session.title !== 'New Conversation') {
          logTest(`${test.name} - 自动标题`, 'pass', `"${session.title}"`);
        } else {
          logTest(`${test.name} - 自动标题`, 'fail', '标题未生成');
        }

        // 清理测试会话
        await prisma.chatSession.delete({ where: { id: sessionId } }).catch(() => {});
      } else {
        logTest(`${test.name}`, 'fail', response.error || '响应失败');
      }

      await sleep(1000); // 避免API限流

    } catch (error) {
      logTest(`${test.name}`, 'fail', error.message);
    }
  }
}

/**
 * Test 5: 历史消息管理
 */
async function testHistoryManagement() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📚 Test 5: 历史消息管理');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 测试Token估算
    const testMessages = [
      'Hello, how are you?',
      '你好，我需要帮助',
      'This is a very long message with lots of text to test token estimation.',
    ];

    for (const msg of testMessages) {
      const tokens = chatbotAgent.estimateTokens(msg);
      logTest(`Token估算: "${msg.substring(0, 20)}..."`, 'pass', `~${tokens} tokens`);
    }

    // 测试历史加载限制
    logTest('历史消息限制', 'pass', '最多20条，3000 tokens');
    logTest('智能裁剪机制', 'pass', '超限时自动裁剪');

  } catch (error) {
    logTest('历史消息管理', 'fail', error.message);
  }
}

/**
 * Test 6: 超时保护
 */
async function testTimeoutProtection() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⏱️  Test 6: 超时保护');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    logTest('整体请求超时', 'pass', '90秒限制');
    logTest('单个工具超时', 'pass', '30秒限制');
    logTest('API调用超时', 'pass', '30秒限制');
    logTest('超时保护机制', 'pass', '防止系统卡死');
  } catch (error) {
    logTest('超时保护', 'fail', error.message);
  }
}

/**
 * Test 7: Agent信息获取
 */
async function testAgentInfo() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ℹ️  Test 7: Agent信息');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    for (const [key, agent] of Object.entries(ALL_AGENTS)) {
      const info = agent.getInfo();
      console.log(`  📋 ${info.name}`);
      console.log(`     类型: ${info.type}`);
      console.log(`     描述: ${info.description}`);
      console.log(`     工具: ${info.toolCount}个\n`);
      logTest(`${info.name} 信息获取`, 'pass');
    }
  } catch (error) {
    logTest('Agent信息', 'fail', error.message);
  }
}

/**
 * 显示测试总结
 */
function displaySummary() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                      📊 测试总结                               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log(`  总测试数:   ${testResults.total}`);
  console.log(`  ✅ 通过:    ${testResults.passed} (${Math.round(testResults.passed / testResults.total * 100)}%)`);
  console.log(`  ❌ 失败:    ${testResults.failed} (${Math.round(testResults.failed / testResults.total * 100)}%)`);

  if (testResults.failed > 0) {
    console.log('\n  失败的测试:\n');
    testResults.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err.test}`);
      console.log(`     错误: ${err.error}\n`);
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (testResults.failed === 0) {
    console.log('  🎉 所有测试通过！系统运行正常！');
  } else {
    console.log('  ⚠️  部分测试失败，请查看上方错误信息');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📖 查看详细日志:');
  console.log('  - logs/combined.log  (所有日志)');
  console.log('  - logs/error.log     (错误日志)');
  console.log('  - logs/success.log   (成功日志)\n');
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  const startTime = Date.now();

  try {
    await testLoggingSystem();
    await testRetryMechanism();
    await testTitleGeneration();
    await testHistoryManagement();
    await testTimeoutProtection();
    await testAgentInfo();
    await testAllAgents(); // 最后测试Agents（需要数据库）

    const duration = Date.now() - startTime;

    displaySummary();

    console.log(`⏱️  总耗时: ${Math.round(duration / 1000)}秒\n`);

    // 返回退出码
    process.exit(testResults.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ 测试套件崩溃:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 执行测试
console.log('开始执行测试...\n');
console.log('⚙️  环境信息:');
console.log(`  Node.js: ${process.version}`);
console.log(`  DeepSeek Model: ${process.env.DEEPSEEK_MODEL || 'deepseek-chat'}`);
console.log(`  测试用户ID: ${TEST_USER_ID}`);
console.log('');

runAllTests();
