import React, { useEffect, useState } from "react";
import { Typography, Card, Table, Tag, Button, Space, message, Tabs } from "antd";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { AdjustmentApprovalModal } from "../components/budget/AdjustmentApprovalModal";
import axios, { AxiosError } from "axios";
import { API_ROOT } from "../shared/api/base";

const { Title } = Typography;
const MAX_REVIEWED_REQUESTS = 50;

// Helper function to get current user ID
// TODO: Replace with actual auth context when available
const getCurrentUserId = (): number => {
  // Placeholder: In production, this should come from auth context/session
  // Example: return useAuth().user?.id || 1;
  return 1;
};

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
  reviewedBy?: number;
  reviewNotes?: string;
  requestedAt: string;
  reviewedAt?: string;
  department?: { name: string; code: string };
  requester?: { name: string; email: string };
  reviewer?: { name: string; email: string };
}

export const BudgetApprovalQueue: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<AdjustmentRequest[]>([]);
  const [reviewedRequests, setReviewedRequests] = useState<AdjustmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdjustmentRequest | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { status: "pending" }
        }),
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { status: "approved" }
        }),
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { status: "rejected" }
        })
      ]);

      if (pendingRes.data.success) {
        setPendingRequests(pendingRes.data.data);
      }

      const reviewed = [];
      if (approvedRes.data.success) {
        reviewed.push(...approvedRes.data.data);
      }
      if (rejectedRes.data.success) {
        reviewed.push(...rejectedRes.data.data);
      }

      reviewed.sort((a, b) => {
        const dateA = a.reviewedAt ? new Date(a.reviewedAt).getTime() : 0;
        const dateB = b.reviewedAt ? new Date(b.reviewedAt).getTime() : 0;
        return dateB - dateA;
      });

      setReviewedRequests(reviewed.slice(0, MAX_REVIEWED_REQUESTS));
    } catch (error) {
      console.error("Load requests error:", error);
      const axiosError = error as AxiosError;
      message.error(axiosError.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (request: AdjustmentRequest) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleApprove = async (id: number, comment: string) => {
    setActionLoading(true);
    try {
      const res = await axios.patch(`${API_ROOT}/department-budget/adjustments/${id}/approve`, {
        reviewedBy: getCurrentUserId(),
        reviewComment: comment
      });

      if (res.data.success) {
        message.success("Request approved successfully");
        setModalVisible(false);
        loadRequests();
      } else {
        message.error(res.data.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Approve error:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(axiosError.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number, comment: string) => {
    setActionLoading(true);
    try {
      const res = await axios.patch(`${API_ROOT}/department-budget/adjustments/${id}/reject`, {
        reviewedBy: getCurrentUserId(),
        reviewComment: comment
      });

      if (res.data.success) {
        message.success("Request rejected");
        setModalVisible(false);
        loadRequests();
      } else {
        message.error(res.data.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Reject error:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(axiosError.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingColumns = [
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department"
    },
    {
      title: "Period",
      key: "period",
      render: (_: unknown, record: AdjustmentRequest) =>
        `${record.targetYear}-${String(record.targetMonth).padStart(2, "0")}`
    },
    {
      title: "Type",
      dataIndex: "requestType",
      key: "requestType",
      render: (type: string) => (
        <Tag color={type === "increase" ? "blue" : "cyan"}>
          {type === "increase" ? "One-Time" : "Additional"}
        </Tag>
      )
    },
    {
      title: "Amount",
      dataIndex: "requestedAmount",
      key: "requestedAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: AdjustmentRequest, b: AdjustmentRequest) => a.requestedAmount - b.requestedAmount
    },
    {
      title: "Requested By",
      dataIndex: ["requester", "name"],
      key: "requestedBy"
    },
    {
      title: "Submitted",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: AdjustmentRequest, b: AdjustmentRequest) =>
        new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: AdjustmentRequest) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleReview(record)}
        >
          Review
        </Button>
      )
    }
  ];

  const reviewedColumns = [
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department"
    },
    {
      title: "Period",
      key: "period",
      render: (_: unknown, record: AdjustmentRequest) =>
        `${record.targetYear}-${String(record.targetMonth).padStart(2, "0")}`
    },
    {
      title: "Amount",
      dataIndex: "requestedAmount",
      key: "requestedAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "approved" ? "green" : "red";
        const icon = status === "approved" ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
        return (
          <Tag color={color} icon={icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" }
      ],
      onFilter: (value: string | number | boolean, record: AdjustmentRequest) => record.status === value
    },
    {
      title: "Reviewed By",
      dataIndex: ["reviewer", "name"],
      key: "reviewedBy"
    },
    {
      title: "Reviewed At",
      dataIndex: "reviewedAt",
      key: "reviewedAt",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
      sorter: (a: AdjustmentRequest, b: AdjustmentRequest) => {
        if (!a.reviewedAt || !b.reviewedAt) return 0;
        return new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime();
      }
    },
    {
      title: "Comment",
      dataIndex: "reviewNotes",
      key: "reviewNotes",
      ellipsis: true,
      render: (comment: string) => comment || "-"
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Budget Approval Queue</Title>

      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: "pending",
            label: (
              <span>
                Pending Approval
                {pendingRequests.length > 0 && (
                  <Tag color="orange" style={{ marginLeft: 8 }}>
                    {pendingRequests.length}
                  </Tag>
                )}
              </span>
            ),
            children: (
              <Card>
                <Table
                  dataSource={pendingRequests}
                  columns={pendingColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 20 }}
                />
              </Card>
            )
          },
          {
            key: "reviewed",
            label: "Reviewed",
            children: (
              <Card>
                <Table
                  dataSource={reviewedRequests}
                  columns={reviewedColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 20 }}
                />
              </Card>
            )
          }
        ]}
      />

      <AdjustmentApprovalModal
        visible={modalVisible}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={() => setModalVisible(false)}
        loading={actionLoading}
      />
    </div>
  );
};

export default BudgetApprovalQueue;
