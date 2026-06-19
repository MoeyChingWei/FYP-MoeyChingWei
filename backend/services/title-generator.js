import deepseekService from './deepseek-ai-service.js';
import logger from './simple-logger.js';

class TitleGeneratorService {
  constructor() {
    this.systemPrompt = `You generate concise chat titles for the OptiMind ERP assistant.

Create a title that describes the user's intent, not a generic label.

Rules:
1. Use 3 to 6 words.
2. Use the same language as the user when possible.
3. Be specific: mention the business task, entity, item, or module.
4. Do not use quotes, punctuation at the end, or explanations.
5. Prefer plain text. An emoji is allowed only when it helps clarity.

Examples:
- "Show my purchase requests" -> "Purchase Request List"
- "create purchase request for 10 laptops" -> "Create Laptop Purchase Request"
- "pending approvals" -> "Pending Approval Requests"
- "帮我分析IT部门支出" -> "IT部门支出分析"
- "office chair supplier?" -> "Office Chair Supplier"

Respond with ONLY the title.`;
  }

  async generateTitle(firstMessage) {
    const message = String(firstMessage || '').trim();

    try {
      logger.info('TitleGenerator', `Generating title for: "${message.substring(0, 50)}..."`);

      if (message.length < 5) {
        return this.getDefaultTitle(message);
      }

      const response = await deepseekService.chat({
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Generate a title for this chat: ${message}`,
          },
        ],
        maxTokens: 40,
        temperature: 0.3,
      });

      if (!response.success) {
        logger.warn('TitleGenerator', 'DeepSeek failed, using fallback title');
        return this.getDefaultTitle(message);
      }

      const textBlock = response.content.find((content) => content.type === 'text');
      let title = textBlock?.text?.trim() || this.getDefaultTitle(message);

      title = title
        .replace(/^["'`]+|["'`]+$/g, '')
        .replace(/[\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (title.length > 50) {
        title = `${title.substring(0, 47).trim()}...`;
      }

      logger.success('TitleGenerator', `Generated title: "${title}"`);
      return title || this.getDefaultTitle(message);
    } catch (error) {
      logger.error('TitleGenerator', `Failed to generate title: ${error.message}`);
      return this.getDefaultTitle(message);
    }
  }

  getDefaultTitle(message) {
    const text = String(message || '').trim();
    const normalized = text.toLowerCase();

    if (!text) return 'New Chat';
    if (this.includesAny(normalized, ['purchase request', 'pr', '采购', '請購', '采购申请'])) {
      if (this.includesAny(normalized, ['create', 'new', 'make', '申请', '创建', '建立'])) {
        return 'Create Purchase Request';
      }
      if (this.includesAny(normalized, ['pending', 'approve', 'approval', '待', '审批', '批准'])) {
        return 'Purchase Request Approval';
      }
      return 'Purchase Request List';
    }
    if (this.includesAny(normalized, ['purchase order', 'po', 'order', '订单'])) {
      return 'Purchase Order Query';
    }
    if (this.includesAny(normalized, ['supplier', 'vendor', '供应商'])) {
      return 'Supplier Query';
    }
    if (this.includesAny(normalized, ['dashboard', 'stats', 'statistic', 'summary', 'total', '分析', '统计'])) {
      return 'Dashboard Summary';
    }
    if (this.includesAny(normalized, ['notification', 'alert', 'message', '通知'])) {
      return 'Notification Query';
    }

    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      return words.slice(0, 5).join(' ');
    }

    return text.length > 30 ? `${text.substring(0, 27)}...` : text;
  }

  shouldGenerateTitle(currentTitle) {
    if (!currentTitle) return true;

    const normalized = String(currentTitle).trim().toLowerCase();
    return (
      normalized === 'new conversation' ||
      normalized === 'new chat' ||
      normalized.includes('new conversation') ||
      normalized.includes('新对话') ||
      normalized.includes('新聊天')
    );
  }

  includesAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
  }
}

export default new TitleGeneratorService();
