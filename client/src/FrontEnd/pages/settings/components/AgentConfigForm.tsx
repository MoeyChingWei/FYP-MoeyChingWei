import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, Slider, Button, Space } from 'antd';
import type { FormInstance } from 'antd';
import styles from './AgentConfigForm.module.css';

const { Option } = Select;

interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiSelect' | 'switch' | 'slider';
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
    validator?: (value: any) => boolean;
  };
}

interface ConfigSection {
  title: string;
  fields: ConfigField[];
}

interface AgentConfigFormProps {
  generalConfig: ConfigSection[];
  specificConfig: ConfigSection[];
  initialValues?: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
  onReset: () => void;
}

const AgentConfigForm: React.FC<AgentConfigFormProps> = ({
  generalConfig,
  specificConfig,
  initialValues = {},
  onSave,
  onReset,
}) => {
  const [form] = Form.useForm<Record<string, any>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSave(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const renderField = (field: ConfigField) => {
    const rules: any[] = [];

    if (field.required) {
      rules.push({
        required: true,
        message: `${field.label} is required`,
      });
    }

    if (field.validation?.pattern) {
      rules.push({
        pattern: field.validation.pattern,
        message: field.validation.message || `Invalid ${field.label} format`,
      });
    }

    if (field.validation?.validator) {
      rules.push({
        validator: (_: any, value: any) => {
          if (value === undefined || value === null || value === '') {
            return Promise.resolve();
          }
          if (field.validation?.validator!(value)) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error(field.validation?.message || `Invalid ${field.label}`)
          );
        },
      });
    }

    switch (field.type) {
      case 'text':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
            tooltip={field.description}
            initialValue={field.defaultValue}
          >
            <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
            tooltip={field.description}
            initialValue={field.defaultValue}
          >
            <InputNumber
              min={field.min}
              max={field.max}
              step={field.step || 1}
              style={{ width: '100%' }}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
            tooltip={field.description}
            initialValue={field.defaultValue}
          >
            <Select placeholder={`Select ${field.label.toLowerCase()}`}>
              {field.options?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'multiSelect':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
            tooltip={field.description}
            initialValue={field.defaultValue || []}
          >
            <Select
              mode="multiple"
              placeholder={`Select ${field.label.toLowerCase()}`}
            >
              {field.options?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'switch':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            valuePropName="checked"
            tooltip={field.description}
            initialValue={field.defaultValue !== undefined ? field.defaultValue : false}
          >
            <Switch />
          </Form.Item>
        );

      case 'slider':
        return (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label}
            rules={rules}
            tooltip={field.description}
            initialValue={field.defaultValue}
          >
            <Slider
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              marks={
                field.min !== undefined && field.max !== undefined
                  ? {
                      [field.min]: field.min,
                      [field.max]: field.max,
                    }
                  : undefined
              }
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  const renderSection = (section: ConfigSection, index: number | string) => (
    <div key={`section-${index}`} className={styles.section}>
      <h3 className={styles.sectionTitle}>{section.title}</h3>
      {section.fields.map((field) => renderField(field))}
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.form}
      >
        {generalConfig.length > 0 && (
          <div className={styles.configGroup}>
            <h2 className={styles.groupTitle}>General Configuration</h2>
            {generalConfig.map((section, index) => renderSection(section, index))}
          </div>
        )}

        {specificConfig.length > 0 && (
          <div className={styles.configGroup}>
            <h2 className={styles.groupTitle}>Agent-Specific Configuration</h2>
            {specificConfig.map((section, index) =>
              renderSection(section, `specific-${index}`)
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Space>
            <Button onClick={handleReset} disabled={loading}>
              Reset
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
            >
              Save Configuration
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AgentConfigForm;
