import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import './SmartSuggestions.css';

interface SmartSuggestionsProps {
  agentType: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// 每个Agent的智能建议
const AGENT_SUGGESTIONS: Record<string, string[]> = {
  chatbot: [
    'Show me my purchase requests',
    'What are my recent orders?',
    'Check dashboard statistics',
    'Show notifications',
    'How do I create a purchase request?',
    'What is my spending this month?',
    'Show pending approvals',
    'List all suppliers',
  ],
  purchase: [
    'Create a purchase request for 10 laptops',
    'Recommend suppliers for IT equipment',
    'Analyze price history for Dell laptops',
    'Check inventory status for office supplies',
    'Calculate bulk savings for 50 units',
    'Compare prices from different suppliers',
    'Show recent purchase requests',
    'What is the best supplier for printers?',
  ],
  analytics: [
    'Analyze IT department spending trends',
    'Compare spending across all departments',
    'Predict next quarter spending',
    'Identify price anomalies in the last 6 months',
    'Show supplier performance metrics',
    'Generate executive summary report',
    'Analyze request patterns for IT department',
    'What is our total spending this year?',
  ],
  approval: [
    'Evaluate purchase request PR-2024-123',
    'Check budget status for IT department',
    'Review my approval history',
    'What are the approval policies?',
    'Calculate risk score for latest request',
    'Show pending approvals requiring attention',
    'Compare similar requests',
    'Is this request compliant with policy?',
  ],
  supplier: [
    'Track order status for PO-2024-123',
    'Check delivery performance for Tech Solutions',
    'Coordinate delivery for next week',
    'Send notification to supplier about delay',
    'Handle delivery exception for damaged goods',
    'Show supplier contact information',
    'Update delivery schedule',
    'What is the status of my latest order?',
  ],
  document: [
    'Generate purchase order for PO-2024-123',
    'Verify document completeness for PR-2024-456',
    'Extract data from invoice INV-2024-789',
    'Compare PO with invoice',
    'Generate monthly spending summary report',
    'Create purchase request document',
    'Analyze invoice discrepancies',
    'Export purchase order as PDF',
  ],
};

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  agentType,
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
}) => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);

  useEffect(() => {
    // 当输入改变时更新建议
    if (value && value.length >= 2) {
      const suggestions = AGENT_SUGGESTIONS[agentType] || [];
      const filtered = suggestions
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5) // 最多显示5个建议
        .map((suggestion) => ({
          value: suggestion,
          label: (
            <div className="suggestion-item">
              <BulbOutlined style={{ color: '#faad14', marginRight: 8 }} />
              <span>{highlightMatch(suggestion, value)}</span>
            </div>
          ),
        }));

      setOptions(filtered);
    } else {
      setOptions([]);
    }
  }, [value, agentType]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ color: '#1890ff' }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <AutoComplete
      value={value}
      options={options}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%' }}
      className="smart-suggestions-input"
      dropdownClassName="smart-suggestions-dropdown"
    />
  );
};

export default SmartSuggestions;
