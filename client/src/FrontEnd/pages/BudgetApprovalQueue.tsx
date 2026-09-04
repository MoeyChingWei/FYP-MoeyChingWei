import React, { useEffect, useState } from "react";
import { Typography, Card, Table, Tag, Button, Space, message, Tabs } from "antd";
import { ArrowLeftOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AdjustmentApprovalModal } from "../components/budget/AdjustmentApprovalModal";
import axios, { AxiosError } from "axios";
import { API_ROOT } from "../shared/api/base";
import { getSessionUser } from "../shared/auth/session";
import { toBudgetNumber } from "../shared/api/departmentBudget";

const { Title } = Typography;
const MAX_REVIEWED_REQUESTS = 50;

const getCurrentUserId = (): number => {
  return getSessionUser()?.id ?? 0;
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
  const navigate = useNavigate();
  const sessionUser = getSessionUser();
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
          params: { status: "pending", userId: sessionUser?.id, email: sessionUser?.email }
        }),
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { status: "approved", userId: sessionUser?.id, email: sessionUser?.email }
        }),
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { status: "rejected", userId: sessionUser?.id, email: sessionUser?.email }
        })
      ]);

      if (pendingRes.data.success) {
        setPendingRequests(pendingRes.data.data.map((request: AdjustmentRequest) => ({
          ...request,
          requestedAmount: toBudgetNumber(request.requestedAmount)
        })));
      }

      const reviewed = [];
      if (approvedRes.data.success) {
        reviewed.push(...approvedRes.data.data.map((request: AdjustmentRequest) => ({
          ...request,
          requestedAmount: toBudgetNumber(request.requestedAmount)
        })));
      }
      if (rejectedRes.data.success) {
        reviewed.push(...rejectedRes.data.data.map((request: AdjustmentRequest) => ({
          ...request,
          requestedAmount: toBudgetNumber(request.requestedAmount)
        })));
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
      message.error((axiosError.response?.data as { message?: string } | undefined)?.message || "Failed to load requests");
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
        reviewComment: comment,
        userId: sessionUser?.id,
        email: sessionUser?.email
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
        reviewComment: comment,
        userId: sessionUser?.id,
        email: sessionUser?.email
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
        <Tag color={type === "next_month_submission" ? "purple" : type === "increase" ? "blue" : "cyan"}>
          {type === "next_month_submission" ? "Next Month Budget" : type === "increase" ? "One-Time" : "Additional"}
        </Tag>
      )
    },
    {
      title: "Amount",
      dataIndex: "requestedAmount",
      key: "requestedAmount",
      render: (amount: unknown, record: AdjustmentRequest) => `${record.requestType === "next_month_submission" ? "Proposed: " : ""}$${toBudgetNumber(amount).toFixed(2)}`,
      sorter: (a: AdjustmentRequest, b: AdjustmentRequest) => toBudgetNumber(a.requestedAmount) - toBudgetNumber(b.requestedAmount)
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

  const reviewedColumns: any[] = [
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
      render: (amount: unknown, record: AdjustmentRequest) => `${record.requestType === "next_month_submission" ? "Proposed: " : ""}$${toBudgetNumber(amount).toFixed(2)}`
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
      onFilter: (value: React.Key | boolean, record: AdjustmentRequest) => record.status === String(value)
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
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/budget/department-overview")}
        style={{ paddingLeft: 0, marginBottom: 4 }}
      >
        Back
      </Button>
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
