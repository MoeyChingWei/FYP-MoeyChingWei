import React, { useEffect, useState } from "react";
import { Typography, message, Row, Col, Card, Table, Tag } from "antd";
import { AdjustmentRequestForm, type AdjustmentFormValues } from "../components/budget/AdjustmentRequestForm";
import { getDepartments, toBudgetNumber, type Department } from "../shared/api/departmentBudget";
import axios from "axios";
import { API_ROOT } from "../shared/api/base";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";

const { Title } = Typography;

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
  createdAt: string;
  department?: { name: string };
}

const BudgetAdjustmentRequest: React.FC = () => {
  const sessionUser = getSessionUser();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [myRequests, setMyRequests] = useState<AdjustmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    loadDepartments();
    loadMyRequests();
  }, []);

  const loadDepartments = async () => {
    const depts = await getDepartments(true);
    const canViewAll = [UserRole.ADMIN, UserRole.MANAGER, UserRole.TREASURY_FINANCE_OFFICER, UserRole.BUDGET_CONTROLLER]
      .includes(sessionUser?.role as UserRole);
    setDepartments(canViewAll
      ? depts
      : depts.filter(department => {
          const value = String(sessionUser?.department ?? "").toLowerCase();
          return department.code.toLowerCase() === value || department.name.toLowerCase() === value;
        }));
  };

  const loadMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await axios.get(`${API_ROOT}/department-budget/adjustments`, {
        params: {
          userId: sessionUser?.id,
          email: sessionUser?.email,
          limit: 20
        }
      });
      if (res.data.success) {
        setMyRequests(res.data.data.map((request: AdjustmentRequest) => ({
          ...request,
          requestedAmount: toBudgetNumber(request.requestedAmount)
        })));
      }
    } catch (error) {
      console.error("Load requests error:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmit = async (values: AdjustmentFormValues) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_ROOT}/department-budget/adjustments`, {
        ...values,
        requestedBy: sessionUser?.id,
        userId: sessionUser?.id,
        email: sessionUser?.email
      });

      if (res.data.success) {
        message.success("Budget adjustment request submitted successfully");
        loadMyRequests();
      } else {
        message.error(res.data.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      message.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department"
    },
    {
      title: "Period",
      key: "period",
      render: (_: any, record: AdjustmentRequest) =>
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
      render: (amount: unknown) => `$${toBudgetNumber(amount).toFixed(2)}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "approved" ? "green" : status === "rejected" ? "red" : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Budget Adjustment Request</Title>

      <Row gutter={[16, 16]}>
        <Col span={24} lg={12}>
          <AdjustmentRequestForm
            departments={departments}
            initialDepartmentId={departments.length === 1 ? departments[0].id : undefined}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Col>

        <Col span={24} lg={12}>
          <Card title="My Recent Requests">
            <Table
              dataSource={myRequests}
              columns={columns}
              rowKey="id"
              loading={loadingRequests}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BudgetAdjustmentRequest;
