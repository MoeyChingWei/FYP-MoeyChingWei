import React, { useState } from 'react';
import { Badge, Button } from 'antd';
import { CloseOutlined, MessageOutlined } from '@ant-design/icons';
import ChatWindow from './ChatWindow';
import './ChatBotWidget.css';

interface ChatBotWidgetProps {
  userId: number;
}

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleChat = () => {
    setIsOpen((open) => {
      if (!open) setUnreadCount(0);
      return !open;
    });
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chatbot-window-container">
          <ChatWindow
            userId={userId}
            onClose={() => setIsOpen(false)}
            onNewMessage={handleNewMessage}
          />
        </div>
      )}

      <div className={`chatbot-widget-button${isOpen ? ' is-open' : ''}`}>
        <Badge count={unreadCount} offset={[-5, 5]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
            onClick={toggleChat}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            style={{
              width: 60,
              height: 60,
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
        </Badge>
      </div>
    </>
  );
};

export default ChatBotWidget;
