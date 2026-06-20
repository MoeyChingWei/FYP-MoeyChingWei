import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, Empty, message, Tabs, Dropdown, Modal, Upload } from 'antd';
import {
  PlusOutlined,
  SendOutlined,
  DeleteOutlined,
  RobotOutlined,
  MoreOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FileWordOutlined,
  CloudUploadOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  sendMessage,
  createNewSession,
  getUserSessions,
  deleteSession,
  clearAllChatHistory,
  uploadAttachment,
} from '../shared/api/chatbot';
import { uploadSource, getUserSources, deleteSource } from '../shared/api/sources';
import { getSessionUser } from '../shared/auth/session';
import InputToolbar from '../components/ChatBot/InputToolbar';
import AttachmentPreview from '../components/ChatBot/AttachmentPreview';
import MessageAttachment from '../components/ChatBot/MessageAttachment';
import './ChatBotPage.css';

const { TextArea } = Input;

interface AttachmentMetadata {
  id: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: AttachmentMetadata[];
}

interface Session {
  id: string;
  title: string;
  updatedAt: string;
  _count: {
    messages: number;
  };
}

interface Source {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  chunkCount?: number;
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

const tableBorderPattern = /^[\s|+\-=:╔╗╚╝╠╣╦╩╬═║│┌┐└┘├┤┬┴┼─━┃┏┓┗┛┣┫┳┻╋]+$/;

function splitTableCells(line: string) {
  const normalized = line
    .replace(/[║│┃]/g, '|')
    .replace(/[╔╗╚╝╠╣╦╩╬═┌┐└┘├┤┬┴┼─━┏┓┗┛┣┫┳┻╋]/g, '')
    .trim();

  if (!normalized.includes('|')) return [];

  return normalized
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function looksLikeTableLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return trimmed.includes('|') || /[║│┃╔╗╚╝╠╣╦╩╬═┌┐└┘├┤┬┴┼─━┏┓┗┛┣┫┳┻╋]/.test(trimmed);
}

function convertTableBlock(lines: string[]) {
  const rows = lines
    .filter((line) => !tableBorderPattern.test(line.trim()) || /[A-Za-z0-9]/.test(line))
    .map(splitTableCells)
    .filter((cells) => cells.length > 1);

  if (rows.length < 2) {
    return lines.join('\n');
  }

  const header = rows[0];
  const body = rows.slice(1);
  const separator = header.map(() => '---');

  return [header, separator, ...body]
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');
}

function normalizeAssistantMarkdown(content: string) {
  const withoutDecorativeFences = content.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (match, block) => {
    return looksLikeTableLine(block) ? `\n${block.trim()}\n` : match;
  });

  const lines = withoutDecorativeFences.split('\n');
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!looksLikeTableLine(lines[index])) {
      output.push(lines[index]);
      continue;
    }

    const block: string[] = [];
    while (index < lines.length && looksLikeTableLine(lines[index])) {
      block.push(lines[index]);
      index += 1;
    }
    index -= 1;

    output.push(convertTableBlock(block));
  }

  return output
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderAssistantMessage(text: string) {
  const displayText = normalizeAssistantMarkdown(text);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node, ...props }) => (
          <div className="assistant-table-scroll">
            <table className="assistant-table" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th className="assistant-table-header" {...props} />,
        td: ({ node, ...props }) => <td className="assistant-table-cell" {...props} />,
        h1: ({ node, ...props }) => <h3 className="assistant-heading" {...props} />,
        h2: ({ node, ...props }) => <h3 className="assistant-heading" {...props} />,
        h3: ({ node, ...props }) => <h3 className="assistant-heading" {...props} />,
        p: ({ node, ...props }) => <p className="assistant-paragraph" {...props} />,
        code: ({ node, className, children, ...props }) => (
          <code className={className ? `assistant-code ${className}` : 'assistant-code'} {...props}>
            {children}
          </code>
        ),
        pre: ({ node, ...props }) => <pre className="assistant-code-block" {...props} />,
      }}
    >
      {displayText}
    </ReactMarkdown>
  );
}

const ChatBotPage: React.FC = () => {
  const { t } = useTranslation('chatbot');
  const { t: tMsg } = useTranslation('messages');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [uploadingSource, setUploadingSource] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState<AttachmentMetadata[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionUser = getSessionUser();
  const userId = sessionUser?.id;

  // Check if user is logged in
  useEffect(() => {
    if (!sessionUser || !userId) {
      message.error(tMsg('error.notSignedIn'));
      console.error('User not logged in or userId is missing');
    }
  }, [sessionUser, userId, t]);

  // Load session list
  useEffect(() => {
    if (userId) {
      loadSessions();
      loadSources();
    }
  }, [userId]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle paste event for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Allow paste anywhere in chatbot page
      // Skip only if in sidebar or other pages
      const target = e.target as HTMLElement;
      const isInSidebar = target.closest('.sidebar') || target.closest('.ant-layout-sider');

      if (isInSidebar) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      // Check if clipboard contains files
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        handleFileSelect(files);
        message.success(t('messages.imagePasted', { count: files.length }));
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [selectedFiles, currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessionList = await getUserSessions(userId!);
      setSessions(sessionList);
      // Don't auto-select any session - let user choose
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSources = async () => {
    try {
      setLoadingSources(true);
      const sourceList = await getUserSources(userId!);
      setSources(sourceList);
    } catch (error) {
      console.error('Failed to load sources:', error);
    } finally {
      setLoadingSources(false);
    }
  };

  const handleUploadSource = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      setUploadingSource(true);
      const result = await uploadSource(file, userId!, currentSessionId || undefined);

      if (result.success) {
        message.success(tMsg('success.upload'));
        await loadSources();
        onSuccess(result.source);
      } else {
        message.error(result.message || tMsg('error.upload'));
        onError(new Error(result.message));
      }
    } catch (error: any) {
      message.error(error.message || tMsg('error.upload'));
      onError(error);
    } finally {
      setUploadingSource(false);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    try {
      await deleteSource(sourceId, userId!);
      message.success(t('sources.deleteSuccess'));
      await loadSources();
    } catch (error) {
      message.error(t('sources.deleteFailed'));
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === 'pdf') return <FilePdfOutlined />;
    if (type === 'xlsx' || type === 'xls' || type === 'csv') return <FileExcelOutlined />;
    if (type === 'doc' || type === 'docx') return <FileWordOutlined />;
    return <FileTextOutlined />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleImageSelect = (images: File[]) => {
    setSelectedFiles((prev) => [...prev, ...images].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || !currentSessionId || !userId) {
      return [];
    }

    setUploadingFiles(true);
    const attachments: AttachmentMetadata[] = [];

    try {
      for (const file of selectedFiles) {
        const attachment = await uploadAttachment(file, currentSessionId, userId);
        attachments.push(attachment);
      }
      setUploadedAttachments(attachments);
      return attachments;
    } catch (error: any) {
      message.error(error.message || t('messages.uploadFailed'));
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const history = await fetch(`/api/chatbot/history/${sessionId}`).then(r => r.json());
      if (history.success) {
        const msgs = history.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt || Date.now()),
          attachments: msg.attachments || undefined,
        }));
        setMessages(msgs);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewChat = async () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputValue('');
  };

  const createSession = async () => {
    if (!userId) {
      message.error(t('messages.userNotLoggedIn'));
      console.error('userId is undefined or null');
      return null;
    }

    try {
      console.log('Creating new session for userId:', userId);
      const newSessionId = await createNewSession(userId);
      setCurrentSessionId(newSessionId);
      await loadSessions();
      return newSessionId;
    } catch (error: any) {
      console.error('Failed to create new conversation:', error);
      message.error(`${t('messages.createSessionFailed')}: ${error.message || 'Unknown error'}`);
      return null;
    }
  };

  const sendMessageToSession = async (sessionId: string, messageText: string) => {
    if ((!messageText.trim() && selectedFiles.length === 0) || loading || !userId) return;

    // Upload files first if any selected
    let attachments: AttachmentMetadata[] = [];
    if (selectedFiles.length > 0) {
      try {
        attachments = await uploadFiles();
      } catch (error) {
        // Upload failed, don't send message
        return;
      }
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSelectedFiles([]);
    setUploadedAttachments([]);
    setLoading(true);

    try {
      const response = await sendMessage({
        userId,
        message: messageText,
        sessionId,
        attachmentData: attachments.length > 0 ? attachments : undefined,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await loadSessions(); // Refresh session list
    } catch (error: any) {
      message.error(error.message || t('messages.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && selectedFiles.length === 0) || loading || !currentSessionId || !userId) return;
    await sendMessageToSession(currentSessionId, inputValue);
  };

  const handleOptionClick = async (option: string) => {
    if (!currentSessionId || loading) return;
    await sendMessageToSession(currentSessionId, option);
  };

  const handleStartChat = async () => {
    const messageText = inputValue.trim();
    if (!messageText || loading) return;

    const newSessionId = await createSession();
    if (!newSessionId) return;

    setMessages([]);
    await sendMessageToSession(newSessionId, messageText);
  };

  const handleSessionClick = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    loadSessionMessages(sessionId);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      message.success(t('messages.sessionDeleted'));

      // If deleted current session, return to the new-chat screen
      if (sessionId === currentSessionId) {
        handleNewChat();
      } else {
        await loadSessions();
      }
    } catch (error) {
      message.error(t('messages.sessionDeleteFailed'));
    }
  };

  const handleClearAllHistory = () => {
    if (!userId) {
      message.error(t('messages.cannotClearHistory'));
      return;
    }

    Modal.confirm({
      title: tMsg('confirm.delete'),
      content: t('modal.clearHistoryContent'),
      okText: tMsg('confirm.yes'),
      okType: 'danger',
      cancelText: tMsg('confirm.no'),
      async onOk() {
        try {
          await clearAllChatHistory(userId);
          setSessions([]);
          setCurrentSessionId(null);
          setMessages([]);
          setInputValue('');
          message.success(t('messages.allHistoryCleared'));
        } catch (error: any) {
          message.error(error.message || t('messages.clearHistoryFailed'));
        }
      },
    });
  };

  const renderOptionsMenu = () => (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          {
            key: 'clear-all-history',
            label: t('buttons.clearAllHistory'),
            danger: true,
            disabled: sessions.length === 0,
            onClick: handleClearAllHistory,
          },
        ],
      }}
    >
      <Button
        type="text"
        shape="circle"
        icon={<MoreOutlined />}
        aria-label={t('aria.chatOptions')}
        className="chatbot-options-button"
      />
    </Dropdown>
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return !currentSessionId ? (
    // Welcome Screen - No Session
    <div className="chatbot-page">
      <div className="chatbot-page-options">{renderOptionsMenu()}</div>
      <div className="chatbot-welcome-container">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <RobotOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            {t('page.title')}
          </div>

          {/* Input area with attachment preview - ChatGPT style */}
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {/* Attachment preview above input (ChatGPT style) */}
            {selectedFiles.length > 0 && (
              <div style={{
                marginBottom: '12px',
                padding: '12px',
                background: '#f7f7f8',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <AttachmentPreview
                  files={selectedFiles}
                  onRemove={handleRemoveFile}
                />
              </div>
            )}

            {/* Upload indicator */}
            {uploadingFiles && (
              <div style={{
                marginBottom: '12px',
                padding: '8px 12px',
                textAlign: 'center',
                background: '#f0f9ff',
                borderRadius: '8px',
                color: '#1890ff',
                fontSize: '14px'
              }}>
                <Spin size="small" /> Uploading files...
              </div>
            )}

            {/* Input box with toolbar - ChatGPT style */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              padding: '12px',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}>
              <InputToolbar
                onFileSelect={handleFileSelect}
                onImageSelect={handleImageSelect}
                disabled={loading || uploadingFiles}
              />
              <Input
                placeholder={t('page.newChatPlaceholder')}
                size="large"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleStartChat}
                disabled={loading}
                bordered={false}
                style={{ flex: 1, fontSize: '15px' }}
              />
              <Button
                type="text"
                icon={<SendOutlined style={{ fontSize: '20px', color: inputValue.trim() || selectedFiles.length > 0 ? '#1890ff' : '#d1d5db' }} />}
                onClick={handleStartChat}
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading || uploadingFiles}
                size="large"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
          </div>
        </div>

        <Tabs className="chatbot-tabs" defaultActiveKey="chats" centered>
          <Tabs.TabPane tab={t('tabs.chats')} key="chats">
            <div className="chatbot-history-list">
              {loadingSessions ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : sessions.length === 0 ? (
                <Empty description={t('history.noHistory')} />
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="chat-history-item"
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <div className="chat-history-title">
                      <span>{session.title || t('history.newConversation')}</span>
                      <span className="chat-history-date">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="chat-history-preview">
                      {session._count.messages} {t('history.messages')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('tabs.sources')} key="sources">
            <div className="sources-container">
              {/* Upload Area */}
              <Upload.Dragger
                accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx"
                customRequest={handleUploadSource}
                showUploadList={false}
                disabled={uploadingSource}
                className="sources-upload-area"
              >
                <div className="sources-upload-icon">
                  <InboxOutlined />
                </div>
                <div className="sources-upload-title">
                  {uploadingSource ? t('sources.uploading') : t('sources.uploadTitle')}
                </div>
                <div className="sources-upload-description">
                  {t('sources.uploadDescription')}
                </div>
                <div className="sources-upload-formats">
                  <span className="source-format-badge">
                    <FilePdfOutlined className="source-format-icon" />
                    {t('formats.pdf')}
                  </span>
                  <span className="source-format-badge">
                    <FileExcelOutlined className="source-format-icon" />
                    {t('formats.excel')}
                  </span>
                  <span className="source-format-badge">
                    <FileWordOutlined className="source-format-icon" />
                    {t('formats.word')}
                  </span>
                  <span className="source-format-badge">
                    <FileTextOutlined className="source-format-icon" />
                    {t('formats.text')}
                  </span>
                </div>
              </Upload.Dragger>

              {/* File List */}
              {loadingSources ? (
                <div className="sources-loading">
                  <Spin size="large" />
                  <div className="sources-loading-text">{t('sources.loadingDocuments')}</div>
                </div>
              ) : sources.length === 0 ? (
                <div className="sources-empty-state">
                  <div className="sources-empty-icon">
                    <CloudUploadOutlined />
                  </div>
                  <div className="sources-empty-title">{t('sources.noDocuments')}</div>
                  <div className="sources-empty-description">
                    {t('sources.noDocumentsDescription')}
                  </div>
                </div>
              ) : (
                <div className="sources-file-list">
                  {sources.map((source) => (
                    <div key={source.id} className="source-file-card">
                      <div className="source-file-header">
                        <div className="source-file-icon-wrapper">
                          {getFileIcon(source.fileType)}
                        </div>
                        <div className="source-file-info">
                          <div className="source-file-name" title={source.fileName}>
                            {source.fileName}
                          </div>
                          <div className="source-file-type">{source.fileType}</div>
                        </div>
                      </div>
                      <div className="source-file-meta">
                        <div className="source-file-meta-item">
                          <DatabaseOutlined className="source-file-meta-icon" />
                          {formatFileSize(source.fileSize)}
                        </div>
                        <div className="source-file-meta-item">
                          <ClockCircleOutlined className="source-file-meta-icon" />
                          {formatDate(source.uploadedAt)}
                        </div>
                      </div>
                      <div className="source-file-actions">
                        <Button
                          danger
                          className="source-file-action-btn delete"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          {t('buttons.delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  ) : (
    // Chat View - With Session
    <div className="chatbot-page">
      <div className="chatbot-chat-view">
        <div className="chatbot-sidebar">
          <div className="chatbot-sidebar-header">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleNewChat}
            >
              {t('buttons.newChat')}
            </Button>
          </div>
          <div className="chatbot-sessions-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="session-content">
                  <div className="session-title">{session.title || t('history.newConversation')}</div>
                  <div className="session-time">{session._count.messages} {t('history.messages')}</div>
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleDeleteSession(session.id, e)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="chatbot-content">
          <div className="chatbot-messages-container">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                (() => {
                  const parsed = msg.role === 'assistant'
                    ? parseAssistantOptions(msg.content)
                    : { text: msg.content, options: [] as string[] };

                  return (
                    <div key={index} className={`chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                      <div className="message-content">
                        <div className="message-text">
                          {msg.role === 'assistant' ? renderAssistantMessage(parsed.text) : parsed.text}
                        </div>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <MessageAttachment
                            attachments={msg.attachments}
                            messageRole={msg.role}
                          />
                        )}
                        {parsed.options.length > 0 && (
                          <div className="message-options">
                            {parsed.options.map((option) => (
                              <Button
                                key={option}
                                size="small"
                                className="message-option-button"
                                onClick={() => handleOptionClick(option)}
                                disabled={loading}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="chatbot-input-area">
          <div className="input-card">
            {loading && (
              <div className="loading-indicator">
                <Spin size="small" /> {t('page.thinkingMessage')}
              </div>
            )}
            {uploadingFiles && (
              <div className="loading-indicator">
                <Spin size="small" /> Uploading files...
              </div>
            )}
            {selectedFiles.length > 0 && (
              <AttachmentPreview
                files={selectedFiles}
                onRemove={handleRemoveFile}
              />
            )}
            <div className="input-wrapper">
              <InputToolbar
                onFileSelect={handleFileSelect}
                onImageSelect={handleImageSelect}
                disabled={loading || uploadingFiles}
              />
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('page.typePlaceholder')}
                autoSize={{ minRows: 1, maxRows: 6 }}
                disabled={loading || uploadingFiles}
                className="chat-input"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading || uploadingFiles}
                size="large"
                className="send-button"
              >
                {t('buttons.send')}
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
