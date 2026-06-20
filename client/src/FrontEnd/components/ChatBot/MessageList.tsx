import React from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageAttachment from './MessageAttachment';
import './MessageList.css';

interface MessageAttachmentData {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  thumbnailUrl?: string;
  aiAnalysis?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  attachments?: MessageAttachmentData[];
}

interface MessageListProps {
  messages: Message[];
  onOptionClick?: (option: string) => void;
}

function parseAssistantOptions(content: string) {
  const marker = '\nOPTIONS:\n';
  const markerIndex = content.indexOf(marker);

  if (markerIndex === -1) {
    return { text: content, options: [] as string[] };
  }

  const text = content.slice(0, markerIndex).trim();
  const optionBlock = content.slice(markerIndex + marker.length);
  const options = optionBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);

  return { text, options };
}

// Convert ASCII table to Markdown table
function convertToMarkdownTable(content: string): string {
  // Check if content contains ASCII-style table separators
  if (content.includes('|---') || content.includes('|===')) {
    // Already in markdown format, return as-is
    return content;
  }

  // Check for ASCII box drawing table
  const lines = content.split('\n');
  const hasAsciiTable = lines.some(line =>
    line.includes('|--') ||
    line.match(/^\s*\|.*\|.*\|.*\|\s*$/)
  );

  if (!hasAsciiTable) {
    return content;
  }

  // Find table boundaries
  const tableStart = lines.findIndex(line => line.includes('|'));
  if (tableStart === -1) return content;

  let tableEnd = tableStart;
  for (let i = tableStart + 1; i < lines.length; i++) {
    if (lines[i].includes('|')) {
      tableEnd = i;
    } else if (lines[i].trim() === '') {
      break;
    }
  }

  // Extract pre-table, table, and post-table content
  const preTable = lines.slice(0, tableStart).join('\n');
  const tableLines = lines.slice(tableStart, tableEnd + 1);
  const postTable = lines.slice(tableEnd + 1).join('\n');

  // Convert table lines
  const convertedTable: string[] = [];
  let headerAdded = false;

  for (const line of tableLines) {
    // Skip separator lines with only dashes
    if (/^[\s|\-]+$/.test(line)) continue;

    // Clean up the line
    const cleaned = line.trim();
    if (!cleaned || !cleaned.includes('|')) continue;

    // Add the row
    convertedTable.push(cleaned);

    // Add separator after header
    if (!headerAdded && convertedTable.length === 1) {
      // Count columns
      const cols = cleaned.split('|').filter(c => c.trim()).length;
      const separator = '|' + Array(cols).fill('---').join('|') + '|';
      convertedTable.push(separator);
      headerAdded = true;
    }
  }

  // Reconstruct content
  const result = [
    preTable,
    convertedTable.join('\n'),
    postTable
  ].filter(s => s.trim()).join('\n\n');

  return result;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onOptionClick }) => {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const parsed = msg.role === 'assistant'
          ? parseAssistantOptions(msg.content)
          : { text: msg.content, options: [] as string[] };

        // Convert ASCII tables to Markdown for assistant messages
        const displayText = msg.role === 'assistant'
          ? convertToMarkdownTable(parsed.text)
          : parsed.text;

        // Debug: log if table conversion happened
        if (msg.role === 'assistant' && displayText !== parsed.text) {
          console.log('Table converted from:', parsed.text.substring(0, 100));
          console.log('Table converted to:', displayText.substring(0, 100));
        }

        return (
          <div
            key={index}
            className={`message-item ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-avatar">
              <Avatar
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                style={{
                  backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                }}
              />
            </div>
            <div className="message-content-wrapper">
              <div className="message-bubble">
                <div className="message-text">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <table className="markdown-table" {...props} />
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="markdown-thead" {...props} />
                        ),
                        tbody: ({ node, ...props }) => (
                          <tbody className="markdown-tbody" {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                          <tr className="markdown-tr" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th className="markdown-th" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="markdown-td" {...props} />
                        ),
                      }}
                    >
                      {displayText}
                    </ReactMarkdown>
                  ) : (
                    parsed.text
                  )}
                </div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <MessageAttachment
                    attachments={msg.attachments}
                    messageRole={msg.role}
                  />
                )}
              </div>
              {parsed.options.length > 0 && (
                <div className="quick-option-list">
                  {parsed.options.map((option) => (
                    <Button
                      key={option}
                      size="small"
                      className="quick-option-button"
                      onClick={() => onOptionClick?.(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
              {msg.timestamp && (
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
