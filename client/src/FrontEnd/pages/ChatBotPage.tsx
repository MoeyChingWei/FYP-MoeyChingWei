import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Dropdown, Empty, Input, message, Spin, Tabs, Tooltip, Upload } from 'antd';
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  ExpandOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  HistoryOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
  RobotOutlined,
  SendOutlined,
} from '@ant-design/icons';
import MessageList from '../components/ChatBot/MessageList';
import AttachmentPreview from '../components/ChatBot/AttachmentPreview';
import VoiceInput from '../components/ChatBot/VoiceInput';
import {
  createAgentSession,
  deleteAgentSession,
  getAgentHistory,
  getAgentSessions,
  getAllAgents,
  sendMessageToAgent,
  type Agent,
  type AgentMessage,
} from '../shared/api/agents';
import {
  createNewSession,
  deleteSource,
  getSessionUser,
  getUserSources,
  uploadAttachment,
  uploadSource,
  type Source,
} from './chatbot-api';
import { sendMessage as sendChatbotMessage } from '../shared/api/chatbot';
import './ChatBotPage.css';

interface AgentSession {
  id: string;
  title: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ChatBotPageProps {
  embedded?: boolean;
  onClose?: () => void;
}

const AGENT_COLORS: Record<string, string> = {
  chatbot: '#1677ff',
  purchase: '#389e0d',
  analytics: '#7c3aed',
  approval: '#d97706',
  supplier: '#0891b2',
  document: '#db2777',
};

const ChatBotPage: React.FC<ChatBotPageProps> = ({ embedded = false, onClose }) => {
  const sessionUser = getSessionUser();
  const userId = sessionUser?.id;
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('chatbot');
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const [sources, setSources] = useState<Source[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [uploadingSource, setUploadingSource] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [agentModeEnabled, setAgentModeEnabled] = useState(false);
  const [agentModeOpen, setAgentModeOpen] = useState(false);
  const agentModeCloseTimerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAgent = useMemo(
    () => agents.find((agent) => agent.type === selectedAgent),
    [agents, selectedAgent],
  );
  const agentName = activeAgent?.name ?? 'General Assistant';
  const agentColor = AGENT_COLORS[selectedAgent] ?? '#1677ff';
  const agentModePreview = activeAgent ?? agents[0];

  const loadSessions = async (agentType = selectedAgent) => {
    if (!userId) return;

    try {
      setLoadingSessions(true);
      const data = await getAgentSessions(agentType, userId);
      setSessions(data);
    } catch (error: any) {
      message.error(error.message || 'Unable to load conversations');
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSources = async () => {
    if (!userId) return;

    try {
      setLoadingSources(true);
      setSources(await getUserSources(userId));
    } catch (error: any) {
      message.error(error.message || 'Unable to load sources');
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setAgents(await getAllAgents());
      } catch (error: any) {
        message.error(error.message || 'Unable to load AI assistants');
      }
    };

    void loadAgents();
  }, []);

  useEffect(() => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputValue('');
    void loadSessions(selectedAgent);
  }, [selectedAgent, userId]);

  useEffect(() => {
    if (activeTab === 'sources') {
      void loadSources();
    }
  }, [activeTab, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.sidebar, .ant-layout-sider')) return;

      const files = Array.from(event.clipboardData?.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => Boolean(file));

      if (files.length === 0) return;

      event.preventDefault();
      handleFileSelect(files);
      message.success(`${files.length} file(s) pasted`);
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [selectedFiles]);

  useEffect(() => () => {
    if (agentModeCloseTimerRef.current !== null) {
      window.clearTimeout(agentModeCloseTimerRef.current);
    }
  }, []);

  const clearAgentModeCloseTimer = () => {
    if (agentModeCloseTimerRef.current !== null) {
      window.clearTimeout(agentModeCloseTimerRef.current);
      agentModeCloseTimerRef.current = null;
    }
  };

  const handleAgentChange = (agentType: string) => {
    setSelectedAgent(agentType);
  };

  const handleNewChat = () => {
    clearAgentModeCloseTimer();
    setCurrentSessionId(null);
    setMessages([]);
    setInputValue('');
    setSelectedFiles([]);
    setUploadingFiles(false);
    setIsDraggingFiles(false);
    setAgentModeEnabled(false);
    setAgentModeOpen(false);
  };

  const handleCancelAgentMode = () => {
    clearAgentModeCloseTimer();
    setAgentModeEnabled(false);
    setAgentModeOpen(false);
    if (!currentSessionId) {
      setSelectedAgent('chatbot');
    }
  };

  const getValidFiles = (files: File[]) => {
    const allowedExtensions = [
      '.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.csv',
      '.jpg', '.jpeg', '.png', '.gif', '.webp',
    ];

    return files.filter((file) => {
      const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
      return allowedExtensions.includes(extension) || file.type.startsWith('image/');
    });
  };

  const handleFileSelect = (files: File[], showFeedback = false) => {
    const validFiles = getValidFiles(files);
    if (validFiles.length === 0) {
      message.error('Unsupported file type. Please upload PDF, Excel, Word, TXT, CSV, or image files.');
      return;
    }

    setSelectedFiles((current) => {
      const nextFiles = [...current, ...validFiles].slice(0, 5);
      if (showFeedback) message.success(`${validFiles.length} file(s) added`);
      if (current.length + validFiles.length > 5) {
        message.warning('Maximum 5 files can be selected at once');
      }
      return nextFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleFileDragEnter = (event: React.DragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    setIsDraggingFiles(true);
  };

  const handleFileDragOver = (event: React.DragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDraggingFiles(true);
  };

  const handleFileDragLeave = (event: React.DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDraggingFiles(false);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDraggingFiles(false);
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length > 0) handleFileSelect(files, true);
  };

  const isSourceFile = (file: File) => {
    const sourceExtensions = ['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.csv'];
    const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    return sourceExtensions.includes(extension);
  };

  const sendMessage = async (text = inputValue) => {
    const prompt = text.trim();
    if ((!prompt && selectedFiles.length === 0) || loading || !userId) return;

    setLoading(true);
    try {
      if (selectedAgent === 'chatbot') {
        let sessionId = currentSessionId;
        if (!sessionId) {
          sessionId = await createNewSession(userId);
          setCurrentSessionId(sessionId);
        }

        setUploadingFiles(selectedFiles.length > 0);
        const attachmentData = [];
        for (const file of selectedFiles) {
          if (isSourceFile(file)) {
            const sourceResult = await uploadSource(file, userId, sessionId);
            if (!sourceResult.success) {
              throw new Error(sourceResult.message || `Unable to save ${file.name} to Sources`);
            }
          }
          attachmentData.push(await uploadAttachment(file, sessionId, userId));
        }

        const visiblePrompt = prompt || `Attached files: ${selectedFiles.map((file) => file.name).join(', ')}`;
        setMessages((current) => [
          ...current,
          { role: 'user', content: visiblePrompt, timestamp: new Date(), attachments: attachmentData },
        ]);
        setInputValue('');

        const response = await sendChatbotMessage({
          userId,
          message: prompt,
          sessionId,
          attachmentData,
        });

        setMessages((current) => [
          ...current,
          { role: 'assistant', content: response.message, timestamp: new Date() },
        ]);
        setSelectedFiles([]);
        await loadSessions();
        if (selectedFiles.some(isSourceFile)) await loadSources();
        return;
      }

      let sessionId = currentSessionId;
      if (!sessionId) {
        sessionId = await createAgentSession(selectedAgent, userId);
        setCurrentSessionId(sessionId);
      }

      const attachedFileNames: string[] = [];
      const sourceFiles = selectedFiles.filter(isSourceFile);
      for (const file of sourceFiles) {
        const uploadResult = await uploadSource(file, userId, sessionId);
        if (!uploadResult.success) {
          throw new Error(uploadResult.message || `Unable to attach ${file.name}`);
        }
        attachedFileNames.push(file.name);
      }

      const visiblePrompt = prompt || `Attached files: ${attachedFileNames.join(', ')}`;
      const agentPrompt = attachedFileNames.length > 0
        ? `${visiblePrompt}\n\nThe following files were added to Sources: ${attachedFileNames.join(', ')}.`
        : visiblePrompt;

      setMessages((current) => [
        ...current,
        { role: 'user', content: visiblePrompt, timestamp: new Date() },
      ]);
      setInputValue('');

      const response = await sendMessageToAgent({
        agentType: selectedAgent,
        userId,
        message: agentPrompt,
        sessionId,
      });

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: response.message, timestamp: new Date() },
      ]);
      setSelectedFiles([]);
      await loadSessions();
      if (attachedFileNames.length > 0) await loadSources();
    } catch (error: any) {
      message.error(error.message || 'Message could not be sent');
    } finally {
      setUploadingFiles(false);
      setLoading(false);
    }
  };

  const handleLoadSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const history = await getAgentHistory(selectedAgent, sessionId);
      setMessages(history.map((item) => ({
        ...item,
        timestamp: item.timestamp ? new Date(item.timestamp) : undefined,
      })));
      setCurrentSessionId(sessionId);
    } catch (error: any) {
      message.error(error.message || 'Conversation could not be opened');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteAgentSession(selectedAgent, sessionId);
      setSessions((current) => current.filter((session) => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
      message.success('Conversation deleted');
    } catch (error: any) {
      message.error(error.message || 'Conversation could not be deleted');
    }
  };

  const handleSourceUpload = async ({ file, onSuccess, onError }: any) => {
    if (!userId) return;

    try {
      setUploadingSource(true);
      const result = await uploadSource(file, userId);
      if (!result.success) throw new Error(result.message || 'Upload failed');
      await loadSources();
      onSuccess?.(result.source);
      message.success('Source added');
    } catch (error: any) {
      onError?.(error);
      message.error(error.message || 'Source could not be uploaded');
    } finally {
      setUploadingSource(false);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!userId) return;
    try {
      await deleteSource(sourceId, userId);
      setSources((current) => current.filter((source) => source.id !== sourceId));
      message.success('Source deleted');
    } catch (error: any) {
      message.error(error.message || 'Source could not be deleted');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === 'pdf') return <FilePdfOutlined />;
    if (['xlsx', 'xls', 'csv'].includes(type)) return <FileExcelOutlined />;
    if (['doc', 'docx'].includes(type)) return <FileWordOutlined />;
    return <FileTextOutlined />;
  };

  if (!userId) {
    return (
      <div className={`assistant-hub assistant-hub-status${embedded ? ' assistant-hub-embedded' : ''}`}>
        <Alert type="warning" showIcon message="Sign in to start an AI conversation" />
      </div>
    );
  }

  const toolsMenu = {
    items: [
      { key: 'attach-files', icon: <PaperClipOutlined />, label: 'Add files' },
      { type: 'divider' as const },
      {
        key: 'agent-mode',
        icon: <RobotOutlined />,
        label: 'Agent mode',
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'attach-files') {
        fileInputRef.current?.click();
        return;
      }
      if (key === 'agent-mode') {
        setAgentModeOpen(true);
        return;
      }
      if (key.startsWith('agent:')) {
        handleAgentChange(key.slice('agent:'.length));
      }
    },
  };

  const agentModePanel = (
    <div className="assistant-agent-mode-panel">
      <div className="assistant-agent-mode-heading">
        <div>
          <strong>Choose agent mode</strong>
          <span>Select a specialist for this conversation</span>
        </div>
        <div className="assistant-agent-mode-heading-actions">
          <RobotOutlined />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={handleCancelAgentMode}
            aria-label="Cancel agent mode"
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="assistant-agent-mode-list">
        {agents.map((agent) => (
          <button
            key={agent.type}
            type="button"
            className={`assistant-agent-option ${selectedAgent === agent.type ? 'selected' : ''}`}
            onClick={() => {
              handleAgentChange(agent.type);
              setAgentModeEnabled(true);
              clearAgentModeCloseTimer();
              agentModeCloseTimerRef.current = window.setTimeout(() => {
                setAgentModeOpen(false);
                agentModeCloseTimerRef.current = null;
              }, 700);
            }}
          >
            <span
              className="assistant-agent-option-icon"
              style={{ backgroundColor: AGENT_COLORS[agent.type] ?? '#1677ff' }}
            >
              <RobotOutlined />
            </span>
            <span className="assistant-agent-option-copy">
              <strong>{agent.name}</strong>
              <span>{agent.description}</span>
            </span>
            <Tooltip title={`${agent.name}: ${agent.expertise}`}>
              <InfoCircleOutlined
                className="assistant-agent-option-info"
                onClick={(event) => event.stopPropagation()}
                aria-label={`About ${agent.name}`}
              />
            </Tooltip>
            {selectedAgent === agent.type && (
              <CheckOutlined className="assistant-agent-option-check" />
            )}
          </button>
        ))}
      </div>
      {agentModeEnabled && agentModePreview && (
        <div
          key={agentModePreview.type}
          className="assistant-agent-mode-preview"
          style={{ '--preview-agent-color': AGENT_COLORS[agentModePreview.type] ?? '#1677ff' } as React.CSSProperties}
        >
          <span className="assistant-agent-mode-preview-icon"><RobotOutlined /></span>
          <div className="assistant-agent-mode-preview-copy">
            <span className="assistant-agent-mode-preview-label">Active mode</span>
            <strong>{agentModePreview.name}</strong>
            <span>{agentModePreview.description}</span>
            <small>{agentModePreview.toolCount} tools - {agentModePreview.expertise}</small>
          </div>
        </div>
      )}
    </div>
  );

  const queuedFiles = selectedFiles.length > 0 && (
    <div className="assistant-attachment-queue">
      <AttachmentPreview files={selectedFiles} onRemove={handleRemoveFile} />
    </div>
  );

  const composerTools = (
    <div className="assistant-composer-tools">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          handleFileSelect(files, true);
          event.target.value = '';
        }}
      />
      <Dropdown trigger={['click']} menu={toolsMenu}>
        <Button
          type="text"
          shape="circle"
          icon={<PlusOutlined />}
          className="assistant-plus-button"
          aria-label="Open chat tools"
        />
      </Dropdown>
    </div>
  );

  const agentModePanelRow = agentModeOpen ? (
    <div className="assistant-agent-mode-row">
      {agentModePanel}
    </div>
  ) : agentModeEnabled ? (
    <div
      className="assistant-agent-mode-summary"
      role="button"
      tabIndex={0}
      onClick={() => setAgentModeOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setAgentModeOpen(true);
        }
      }}
      aria-label={`Active agent mode: ${agentName}`}
    >
      <span className="assistant-agent-mode-summary-icon"><RobotOutlined /></span>
      <span className="assistant-agent-mode-summary-label">Agent mode</span>
      <strong>{agentName}</strong>
      <DownOutlined />
    </div>
  ) : null;

  if (embedded) {
    const popupMessages = messages.length > 0
      ? messages
      : [{ role: 'assistant' as const, content: "Hello! I'm OptiMind AI Assistant. How can I help you today?", timestamp: new Date() }];

    return (
      <div className="assistant-popup-layout">
        <header className="assistant-popup-header">
          <strong><RobotOutlined /> OptiMind AI Assistant</strong>
          <div className="assistant-popup-header-actions">
            <Button type="text" icon={<PlusOutlined />} onClick={handleNewChat}>New Chat</Button>
            <Button type="text" icon={<ExpandOutlined />} onClick={() => window.location.assign('/chatbot')} aria-label="Open full chat" />
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="Close chat" />
          </div>
        </header>
        <div className="assistant-popup-messages">
          <MessageList messages={popupMessages} onOptionClick={(option) => void sendMessage(option)} />
          <div ref={messagesEndRef} />
        </div>
        <div className="assistant-popup-composer">
          {loading && <div className="assistant-thinking"><Spin size="small" /> {agentName} is thinking...</div>}
          {uploadingFiles && <div className="assistant-thinking"><Spin size="small" /> Uploading files...</div>}
          {queuedFiles}
          <div
            className={`assistant-popup-input-row${isDraggingFiles ? ' assistant-drag-over' : ''}`}
            onDragEnter={handleFileDragEnter}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
          >
            <Button
              type="text"
              shape="circle"
              icon={<PaperClipOutlined />}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach files"
            />
            {composerTools}
            <Input.TextArea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading || uploadingFiles}
              variant="borderless"
            />
            <VoiceInput onTranscript={(text) => setInputValue((current) => current ? `${current} ${text}` : text)} disabled={loading || uploadingFiles} />
            <Button
              type="primary"
              icon={loading ? <Spin size="small" /> : <SendOutlined />}
              onClick={() => void sendMessage()}
              disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading || uploadingFiles}
              aria-label="Send message"
            />
          </div>
          {agentModePanelRow}
        </div>
      </div>
    );
  }

  if (!currentSessionId) {
    return (
      <div className={`assistant-hub${embedded ? ' assistant-hub-embedded' : ''}`}>
        <div className="assistant-hub-welcome">
          <div className="assistant-hub-title">
            <RobotOutlined />
            <h1>OptiMind AI Assistant</h1>
          </div>

          <div
            className={`assistant-welcome-composer ${agentModeEnabled || agentModeOpen ? 'has-agent-mode' : ''} ${isDraggingFiles ? 'assistant-drag-over' : ''}`}
            onDragEnter={handleFileDragEnter}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
          >
            {queuedFiles}
            <div className="assistant-welcome-input-row">
              {composerTools}
              <Input.TextArea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={agentModeEnabled ? `New chat in ${agentName}...` : 'New chat in OptiMind...'}
                variant="borderless"
                autoSize={{ minRows: 1, maxRows: 5 }}
                disabled={loading || uploadingFiles}
              />
            </div>
            <div className="assistant-welcome-toolbar">
              <div className="assistant-welcome-actions">
              <VoiceInput onTranscript={(text) => setInputValue((current) => current ? `${current} ${text}` : text)} disabled={loading} />
              <Button
                type="text"
                shape="circle"
                icon={loading ? <Spin size="small" /> : <SendOutlined />}
                aria-label="Send message"
                onClick={() => void sendMessage()}
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading || uploadingFiles}
                className="assistant-send-icon"
                style={{ color: inputValue.trim() ? agentColor : undefined }}
              />
              </div>
            </div>
            {agentModePanelRow}
          </div>

          <Tabs
            centered
            activeKey={activeTab}
            onChange={setActiveTab}
            className="assistant-welcome-tabs"
            items={[
              {
                key: 'chats',
                label: 'Chats',
                children: loadingSessions ? (
                  <div className="assistant-tab-loading"><Spin /></div>
                ) : sessions.length === 0 ? (
                  <Empty description="No chat history yet" />
                ) : (
                  <div className="assistant-history-list">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="assistant-history-card"
                        onClick={() => void handleLoadSession(session.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="assistant-history-copy">
                          <strong>{session.title || `${agentName} Conversation`}</strong>
                          <span>{session._count?.messages ?? 0} messages</span>
                        </div>
                        <small>{new Date(session.updatedAt).toLocaleDateString()}</small>
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: [{ key: 'delete', danger: true, icon: <DeleteOutlined />, label: 'Delete conversation' }],
                            onClick: ({ domEvent }) => {
                              domEvent.stopPropagation();
                              void handleDeleteSession(session.id);
                            },
                          }}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<MoreOutlined />}
                            aria-label="Conversation options"
                            onClick={(event) => event.stopPropagation()}
                          />
                        </Dropdown>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'sources',
                label: 'Sources',
                children: (
                  <div className="assistant-sources">
                    <Upload.Dragger
                      accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx"
                      customRequest={handleSourceUpload}
                      showUploadList={false}
                      disabled={uploadingSource}
                      className={`assistant-source-upload${uploadingSource ? ' is-uploading' : ''}`}
                    >
                      <InboxOutlined />
                      <strong>{uploadingSource ? 'Adding source...' : 'Add a source'}</strong>
                      <span>PDF, Excel, Word, TXT, or CSV</span>
                    </Upload.Dragger>
                    {loadingSources ? (
                      <div className="assistant-tab-loading"><Spin /></div>
                    ) : sources.length === 0 ? (
                      null
                    ) : (
                      <div className="assistant-source-list">
                        {sources.map((source) => (
                          <div key={source.id} className="assistant-source-item">
                            <span className="assistant-source-icon">{getFileIcon(source.fileType)}</span>
                            <span className="assistant-source-name">{source.fileName}</span>
                            <small>{formatFileSize(source.fileSize)}</small>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              aria-label={`Delete ${source.fileName}`}
                              onClick={() => void handleDeleteSource(source.id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`assistant-hub assistant-conversation-page${embedded ? ' assistant-hub-embedded' : ''}`}>
      <aside className="assistant-session-sidebar">
        <Button icon={<PlusOutlined />} type="primary" block onClick={handleNewChat}>
          New chat
        </Button>
        <div className="assistant-session-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`assistant-session-item ${session.id === currentSessionId ? 'active' : ''}`}
              onClick={() => void handleLoadSession(session.id)}
              role="button"
              tabIndex={0}
            >
              <span>{session.title || 'New conversation'}</span>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [{ key: 'delete', danger: true, icon: <DeleteOutlined />, label: 'Delete conversation' }],
                  onClick: ({ domEvent }) => {
                    domEvent.stopPropagation();
                    void handleDeleteSession(session.id);
                  },
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  aria-label="Conversation options"
                  onClick={(event) => event.stopPropagation()}
                />
              </Dropdown>
            </div>
          ))}
        </div>
      </aside>

      <section className="assistant-conversation">
        <header className="assistant-conversation-header">
          <span className="assistant-conversation-avatar" style={{ backgroundColor: agentColor }}><RobotOutlined /></span>
          <div>
            <strong>{agentName}</strong>
            <small><span style={{ backgroundColor: agentColor }} /> Online</small>
          </div>
        </header>

        <div className="assistant-message-area">
          <MessageList messages={messages} onOptionClick={(option) => void sendMessage(option)} />
          <div ref={messagesEndRef} />
        </div>

        <div className="assistant-chat-composer">
          {loading && <div className="assistant-thinking"><Spin size="small" /> {agentName} is thinking...</div>}
          {uploadingFiles && <div className="assistant-thinking"><Spin size="small" /> Uploading files...</div>}
          <div
            className={`assistant-chat-input-stack ${isDraggingFiles ? 'assistant-drag-over' : ''}`}
            onDragEnter={handleFileDragEnter}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
          >
          {queuedFiles}
          <Input.TextArea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder={`Message ${agentName}...`}
            autoSize={{ minRows: 1, maxRows: 5 }}
            maxLength={2000}
            disabled={loading || uploadingFiles}
            variant="borderless"
          />
          <div className="assistant-chat-toolbar">
            {composerTools}
            <div className="assistant-chat-toolbar-right">
              <span className="assistant-composer-hint">Enter to send  |  Shift + Enter for a new line</span>
              <span className="assistant-composer-count" aria-live="polite">
                {inputValue.length}/2000
              </span>
              <VoiceInput
                onTranscript={(text) => setInputValue((current) => current ? `${current} ${text}` : text)}
                disabled={loading || uploadingFiles}
              />
              <Button
                type="primary"
                shape="circle"
                icon={loading ? <Spin size="small" /> : <SendOutlined />}
                aria-label="Send message"
                onClick={() => void sendMessage()}
                disabled={(!inputValue.trim() && selectedFiles.length === 0) || loading || uploadingFiles}
                className="assistant-chat-send-button"
                style={{ backgroundColor: agentColor, borderColor: agentColor }}
              />
            </div>
          </div>
          {agentModePanelRow}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatBotPage;
