import React from "react";
import { Modal, Descriptions, Form, Input, Button, Space, Tag, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface AdjustmentRequest {
  id: number;
  departmentId: number;
  targetYear: number;
  targetMonth: number;
  requestType: string;
  requestedAmount: number;
  reason: string;
  status: string;
  requestedBy: number;
  requestedAt: string;
  department?: { name: string; code: string };
  requester?: { name: string; email: string };
}

interface AdjustmentApprovalModalProps {
  visible: boolean;
  request: AdjustmentRequest | null;
  onApprove: (id: number, comment: string) => Promise<void>;
  onReject: (id: number, comment: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AdjustmentApprovalModal: React.FC<AdjustmentApprovalModalProps> = ({
  visible,
  request,
  onApprove,
  onReject,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  if (!request) return null;

  const handleApprove = async () => {
    try {
      const values = await form.validateFields();
      await onApprove(request.id, values.reviewComment || "");
      form.resetFields();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      if (!values.reviewComment || values.reviewComment.trim().length < 10) {
        message.error("Rejection reason must be at least 10 characters");
        return;
      }
      await onReject(request.id, values.reviewComment);
      form.resetFields();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Modal
      title="Review Budget Adjustment Request"
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={null}
    >
      <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Department" span={2}>
          {request.department?.name} ({request.department?.code})
        </Descriptions.Item>
        <Descriptions.Item label="Requested By" span={2}>
          {request.requester?.name} ({request.requester?.email})
        </Descriptions.Item>
        <Descriptions.Item label="Target Period">
          {request.targetYear}-{String(request.targetMonth).padStart(2, "0")}
        </Descriptions.Item>
        <Descriptions.Item label="Request Type">
          <Tag color={request.requestType === "increase" ? "blue" : "cyan"}>
            {request.requestType === "increase" ? "One-Time Increase" : "Additional Request"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Requested Amount" span={2}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#1890ff" }}>
            ${request.requestedAmount.toFixed(2)}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Reason" span={2}>
          <div style={{ whiteSpace: "pre-wrap" }}>{request.reason}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Submitted At" span={2}>
          {new Date(request.requestedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical">
        <Form.Item
          name="reviewComment"
          label="Review Comment"
          rules={[
            {
              validator: (_, value) => {
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Add your review comment (required for rejection)..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleApprove}
              loading={loading}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={handleReject}
              loading={loading}
            >
              Reject
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
