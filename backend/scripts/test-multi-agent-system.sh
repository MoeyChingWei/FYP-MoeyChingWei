#!/bin/bash

# 🧪 Multi-Agent System Test Suite
# 完整测试所有6个AI Agents

echo "🚀 Multi-Agent System Test Suite"
echo "=================================="
echo ""

BASE_URL="http://localhost:4000/api/agents"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_agent() {
    local agent_type=$1
    local agent_name=$2
    local test_message=$3

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo "Testing ${agent_name}..."

    response=$(curl -s -X POST "${BASE_URL}/${agent_type}/chat" \
        -H "Content-Type: application/json" \
        -d "{\"userId\": 1, \"message\": \"${test_message}\"}")

    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ ${agent_name} - PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))

        # 提取部分响应
        message=$(echo "$response" | grep -o '"message":"[^"]*"' | head -c 150)
        echo "   Response preview: ${message}..."
    else
        echo -e "${RED}❌ ${agent_name} - FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "   Error: $response"
    fi
    echo ""
}

# 1. 测试Agent列表API
echo "📋 Test 1: Agent List API"
echo "-------------------------"
response=$(curl -s "${BASE_URL}/list")

if echo "$response" | grep -q '"success":true'; then
    agent_count=$(echo "$response" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✅ Agent List API - PASSED${NC}"
    echo "   Found ${agent_count} agents"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ Agent List API - FAILED${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 2. 测试每个Agent
echo "🤖 Test 2-7: Individual Agents"
echo "------------------------------"

test_agent "chatbot" "ChatBot Agent" "Hello, who are you?"
test_agent "purchase" "Purchase Agent" "I need help with procurement"
test_agent "analytics" "Analytics Agent" "Hello, what can you do?"
test_agent "approval" "Approval Agent" "What do you do?"
test_agent "supplier" "Supplier Agent" "Hello"
test_agent "document" "Document Agent" "What can you help me with?"

# 3. 测试会话创建
echo "💬 Test 8: Session Creation"
echo "---------------------------"
response=$(curl -s -X POST "${BASE_URL}/chatbot/new-session" \
    -H "Content-Type: application/json" \
    -d '{"userId": 1}')

TOTAL_TESTS=$((TOTAL_TESTS + 1))

if echo "$response" | grep -q '"success":true'; then
    session_id=$(echo "$response" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Session Creation - PASSED${NC}"
    echo "   Session ID: ${session_id}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ Session Creation - FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 4. 测试Agent信息API
echo "ℹ️  Test 9: Agent Info API"
echo "-------------------------"
response=$(curl -s "${BASE_URL}/purchase/info")

TOTAL_TESTS=$((TOTAL_TESTS + 1))

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Agent Info API - PASSED${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ Agent Info API - FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# 总结
echo "=================================="
echo "📊 Test Summary"
echo "=================================="
echo "Total Tests:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:       ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed:       ${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review the errors above.${NC}"
    exit 1
fi
