/**
 * ChatBot API 测试脚本
 * 运行: node test-chatbot.js
 */

const API_BASE = 'http://localhost:4000/api';

async function testChatBot() {
  console.log('🤖 测试ChatBot API...\n');

  try {
    // 测试1: 创建新会话
    console.log('📝 测试1: 创建新会话');
    const newSessionRes = await fetch(`${API_BASE}/chatbot/new-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1 }),
    });
    const { sessionId } = await newSessionRes.json();
    console.log(`✅ 会话已创建: ${sessionId}\n`);

    // 测试2: 发送简单问题
    console.log('📝 测试2: 发送消息 "你好"');
    const chatRes = await fetch(`${API_BASE}/chatbot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        sessionId,
        message: '你好，请介绍一下你自己',
      }),
    });
    const chatData = await chatRes.json();
    console.log('✅ ChatBot响应:');
    console.log(chatData.message);
    console.log(`\n📊 Token使用: ${chatData.usage?.input_tokens} input / ${chatData.usage?.output_tokens} output\n`);

    // 测试3: 查询数据
    console.log('📝 测试3: 查询数据 "我的部门有多少采购申请？"');
    const queryRes = await fetch(`${API_BASE}/chatbot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        sessionId,
        message: '我的部门有多少采购申请？',
      }),
    });
    const queryData = await queryRes.json();
    console.log('✅ ChatBot响应:');
    console.log(queryData.message);
    console.log(`\n📊 Token使用: ${queryData.usage?.input_tokens} input / ${queryData.usage?.output_tokens} output\n`);

    // 测试4: 获取会话历史
    console.log('📝 测试4: 获取会话历史');
    const historyRes = await fetch(`${API_BASE}/chatbot/history/${sessionId}`);
    const historyData = await historyRes.json();
    console.log(`✅ 会话有 ${historyData.messages.length} 条消息\n`);

    console.log('🎉 所有测试通过！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testChatBot();
