import React from "react";
import { Form, Input, InputNumber, Select, Button, Space, Card } from "antd";
import type { Department } from "../../shared/api/departmentBudget";

interface AdjustmentRequestFormProps {
  departments: Department[];
  onSubmit: (values: AdjustmentFormValues) => Promise<void>;
  loading?: boolean;
  initialDepartmentId?: number;
}

export interface AdjustmentFormValues {
  departmentId: number;
  targetYear: number;
  targetMonth: number;
  requestType: "increase" | "additional";
  requestedAmount: number;
  reason: string;
}

export const AdjustmentRequestForm: React.FC<AdjustmentRequestFormProps> = ({
  departments,
  onSubmit,
  loading,
  initialDepartmentId
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: AdjustmentFormValues) => {
    await onSubmit(values);
    form.resetFields();
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <Card title="Submit Budget Adjustment Request">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          departmentId: initialDepartmentId,
          targetYear: currentYear,
          targetMonth: currentMonth,
          requestType: "increase"
        }}
      >
        <Form.Item
          name="departmentId"
          label="Department"
          rules={[{ required: true, message: "Please select department" }]}
        >
          <Select placeholder="Select department">
            {departments.map(d => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Target Period">
          <Space>
            <Form.Item
              name="targetYear"
              noStyle
              rules={[{ required: true }]}
            >
              <Select style={{ width: 100 }}>
                {[currentYear, currentYear + 1, currentYear + 2].map(y => (
                  <Select.Option key={y} value={y}>{y}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="targetMonth"
              noStyle
              rules={[{ required: true }]}
            >
              <Select style={{ width: 100 }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <Select.Option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item
          name="requestType"
          label="Request Type"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="increase">One-Time Increase</Select.Option>
            <Select.Option value="additional">Additional Request</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="requestedAmount"
          label="Requested Amount"
          rules={[
            { required: true, message: "Please enter amount" },
            { type: "number", min: 0.01, message: "Amount must be greater than 0" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            prefix="$"
            precision={2}
            min={0.01}
            step={100}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[
            { required: true, message: "Please provide reason" },
            { min: 20, message: "Reason must be at least 20 characters" }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Explain why additional budget is needed..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Request
            </Button>
            <Button onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
