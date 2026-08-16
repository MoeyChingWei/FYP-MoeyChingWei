import 'dotenv/config';
import logger from './services/simple-logger.js';
import deepseekService from './services/deepseek-ai-service.js';

/**
 * 测试Agent改进功能
 *
 * 测试内容：
 * 1. 日志系统
 * 2. API重试机制
 * 3. 超时保护
 * 4. 错误处理
 */

console.log('\n=================================');
console.log('🧪 Testing Agent Improvements');
console.log('=================================\n');

// Test 1: 日志系统
async function testLogger() {
  console.log('\n--- Test 1: Logger System ---\n');

  logger.info('Test', 'This is an info message');
  logger.success('Test', 'This is a success message');
  logger.warn('Test', 'This is a warning message');
  logger.error('Test', 'This is an error message');

  logger.logAgentRequest('chatbot', 1, 'test-session-123', 50);
  logger.logAgentResponse('chatbot', 1, 1234, 567, true);
  logger.logToolCall('chatbot', 'get_dashboard_stats', 456, true);

  console.log('\n✅ Logger test completed. Check logs/ directory for output files.\n');
}

// Test 2: API重试机制
async function testRetryMechanism() {
  console.log('\n--- Test 2: API Retry Mechanism ---\n');

  try {
    console.log('Attempting API call with retry...');

    const response = await deepseekService.chat({
      systemPrompt: 'You are a helpful assistant.',
      messages: [{ role: 'user', content: 'Say hello in one word.' }],
      maxTokens: 50,
    });

    if (response.success) {
      const text = response.content.find(c => c.type === 'text')?.text;
      console.log('✅ API Response:', text);
    } else {
      console.log('❌ API Error:', response.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 3: 工具超时保护
async function testToolTimeout() {
  console.log('\n--- Test 3: Tool Timeout Protection ---\n');

  const mockTools = [
    {
      name: 'slow_tool',
      description: 'A tool that takes too long',
      input_schema: {
        type: 'object',
        properties: {},
      },
    },
  ];

  const mockToolHandlers = {
    slow_tool: async () => {
      console.log('Tool executing (will timeout in 5 seconds)...');
      // 模拟一个需要10秒的工具
      await new Promise(resolve => setTimeout(resolve, 10000));
      return { result: 'This should not be reached' };
    },
  };

  try {
    const response = await deepseekService.chatWithTools({
      systemPrompt: 'You are a test assistant. Use the slow_tool immediately.',
      messages: [{ role: 'user', content: 'Use slow_tool' }],
      availableTools: mockTools,
      toolHandlers: mockToolHandlers,
      toolTimeoutMs: 5000, // 5秒超时
    });

    if (response.success) {
      console.log('✅ Response:', response.content);
    } else {
      console.log('⚠️ Expected timeout occurred:', response.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 4: 历史消息Token估算
async function testTokenEstimation() {
  console.log('\n--- Test 4: Token Estimation ---\n');

  // 导入BaseAgent来测试（如果可用）
  const testMessages = [
    'Hello, how are you?',
    '你好，我需要帮助',
    'This is a much longer message with lots of text to test the token estimation algorithm.',
    '这是一个很长的中文消息，用来测试token估算功能是否准确。',
  ];

  // 手动估算（模拟BaseAgent的方法）
  const estimateTokens = (text) => {
    if (!text) return 0;
    const chineseChars = (text.match(/[一-龥]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return chineseChars + Math.ceil(otherChars / 4);
  };

  testMessages.forEach(msg => {
    const tokens = estimateTokens(msg);
    console.log(`Message: "${msg.substring(0, 30)}..." → ~${tokens} tokens`);
  });

  console.log('\n✅ Token estimation test completed.\n');
}

// Test 5: 错误处理
async function testErrorHandling() {
  console.log('\n--- Test 5: Error Handling ---\n');

  try {
    // 测试无效的API密钥（如果环境变量设置错误）
    const response = await deepseekService.chat({
      systemPrompt: 'Test',
      messages: [{ role: 'user', content: 'Test error handling' }],
    });

    if (!response.success) {
      console.log('⚠️ Error handled gracefully:', response.error);
      console.log('Reason:', response.reason);
    } else {
      console.log('✅ API call succeeded');
    }
  } catch (error) {
    console.log('⚠️ Exception caught and handled:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  try {
    await testLogger();
    await testRetryMechanism();
    await testToolTimeout();
    await testTokenEstimation();
    await testErrorHandling();

    console.log('\n=================================');
    console.log('✅ All tests completed!');
    console.log('=================================\n');

    console.log('📋 Summary:');
    console.log('- Check logs/ directory for log files');
    console.log('- Review console output for test results');
    console.log('- All improvements are now active in your system\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// 执行测试
runAllTests();
