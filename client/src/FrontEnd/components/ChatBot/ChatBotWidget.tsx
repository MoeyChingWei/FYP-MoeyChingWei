import React from 'react';
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ChatBotWidget.css';

const ChatBotWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="chatbot-widget-button">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={() => navigate('/chatbot')}
        aria-label="Open AI Assistant"
        style={{
          width: 60,
          height: 60,
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    </div>
  );
};

export default ChatBotWidget;
