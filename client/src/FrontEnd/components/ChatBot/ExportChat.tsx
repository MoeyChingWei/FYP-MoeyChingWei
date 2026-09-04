import React from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AgentMessage } from '../../shared/api/agents';

interface ExportChatProps {
  messages: AgentMessage[];
  agentName: string;
  agentType: string;
}

const ExportChat: React.FC<ExportChatProps> = ({ messages, agentName, agentType }) => {
  const { t: tMsg } = useTranslation('messages');

  const exportAsText = () => {
    if (messages.length === 0) {
      message.warning(tMsg('noMessagesToExport'));
      return;
    }

    let content = `========================================\n`;
    content += `${agentName} Conversation\n`;
    content += `Exported: ${new Date().toLocaleString()}\n`;
    content += `Agent Type: ${agentType}\n`;
    content += `========================================\n\n`;

    messages.forEach((msg, index) => {
      const timestamp = msg.timestamp
        ? new Date(msg.timestamp).toLocaleString()
        : 'Unknown time';
      const role = msg.role === 'user' ? 'You' : agentName;

      content += `[${timestamp}] ${role}:\n`;
      content += `${msg.content}\n\n`;
      content += `----------------------------------------\n\n`;
    });

    content += `\nTotal messages: ${messages.length}\n`;
    content += `End of conversation\n`;

    downloadFile(content, `${agentType}-chat-${Date.now()}.txt`, 'text/plain');
    message.success(tMsg('exportedAsTxt'));
  };

  const exportAsJSON = () => {
    if (messages.length === 0) {
      message.warning(tMsg('noMessagesToExport'));
      return;
    }

    const data = {
      agentName,
      agentType,
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    };

    const content = JSON.stringify(data, null, 2);
    downloadFile(content, `${agentType}-chat-${Date.now()}.json`, 'application/json');
    message.success(tMsg('exportedAsJson'));
  };

  const exportAsMarkdown = () => {
    if (messages.length === 0) {
      message.warning(tMsg('noMessagesToExport'));
      return;
    }

    let content = `# ${agentName} Conversation\n\n`;
    content += `**Exported**: ${new Date().toLocaleString()}  \n`;
    content += `**Agent Type**: ${agentType}  \n`;
    content += `**Total Messages**: ${messages.length}\n\n`;
    content += `---\n\n`;

    messages.forEach((msg, index) => {
      const timestamp = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString()
        : 'Unknown time';
      const role = msg.role === 'user' ? '👤 You' : `🤖 ${agentName}`;

      content += `## ${role} _(${timestamp})_\n\n`;
      content += `${msg.content}\n\n`;
      content += `---\n\n`;
    });

    downloadFile(content, `${agentType}-chat-${Date.now()}.md`, 'text/markdown');
    message.success(tMsg('exportedAsMarkdown'));
  };

  const exportAsHTML = () => {
    if (messages.length === 0) {
      message.warning(tMsg('noMessagesToExport'));
      return;
    }

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${agentName} Conversation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .message {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .message.user {
            background: #e6f7ff;
            border-left: 4px solid #1890ff;
        }
        .message.assistant {
            background: #f6ffed;
            border-left: 4px solid #52c41a;
        }
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #8c8c8c;
        }
        .role {
            font-weight: 600;
            color: #262626;
        }
        .content {
            white-space: pre-wrap;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #8c8c8c;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${agentName} Conversation</h1>
        <p>Exported: ${new Date().toLocaleString()}</p>
        <p>Agent Type: ${agentType}</p>
        <p>Total Messages: ${messages.length}</p>
    </div>
`;

    messages.forEach((msg) => {
      const timestamp = msg.timestamp
        ? new Date(msg.timestamp).toLocaleString()
        : 'Unknown time';
      const role = msg.role === 'user' ? 'You' : agentName;

      html += `
    <div class="message ${msg.role}">
        <div class="message-header">
            <span class="role">${role}</span>
            <span class="timestamp">${timestamp}</span>
        </div>
        <div class="content">${escapeHtml(msg.content)}</div>
    </div>
`;
    });

    html += `
    <div class="footer">
        <p>End of conversation</p>
        <p>Generated by OptiMind Multi-Agent System</p>
    </div>
</body>
</html>`;

    downloadFile(html, `${agentType}-chat-${Date.now()}.html`, 'text/html');
    message.success(tMsg('exportedAsHtml'));
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'txt',
          label: 'Export as TXT',
          icon: <DownloadOutlined />,
          onClick: exportAsText,
        },
        {
          key: 'json',
          label: 'Export as JSON',
          icon: <DownloadOutlined />,
          onClick: exportAsJSON,
        },
        {
          key: 'md',
          label: 'Export as Markdown',
          icon: <DownloadOutlined />,
          onClick: exportAsMarkdown,
        },
        {
          key: 'html',
          label: 'Export as HTML',
          icon: <DownloadOutlined />,
          onClick: exportAsHTML,
        },
      ]}
    />
  );

  return (
    <Dropdown menu={{ items: menu.props.items }} placement="bottomRight">
      <Button icon={<DownloadOutlined />} size="small">
        Export
      </Button>
    </Dropdown>
  );
};

export default ExportChat;
