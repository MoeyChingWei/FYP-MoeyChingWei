import React, { lazy, Suspense, useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined, MessageOutlined } from '@ant-design/icons';
import './ChatBotWidget.css';

const ChatBotPage = lazy(() => import('../../pages/ChatBotPage'));

interface ChatBotWidgetProps {
  userId: number;
}

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!userId) return null;

  return (
    <>
      {isOpen && (
        <div className="chatbot-window-container" role="dialog" aria-label="OptiMind AI Assistant">
          <div className="chatbot-window-content">
            <Suspense fallback={<div className="chatbot-window-loading">Loading AI Assistant...</div>}>
              <ChatBotPage embedded onClose={() => setIsOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      <div className={`chatbot-widget-button${isOpen ? ' is-open' : ''}`}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
          style={{ width: 60, height: 60, fontSize: 24, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        />
      </div>
    </>
  );
};

export default ChatBotWidget;
