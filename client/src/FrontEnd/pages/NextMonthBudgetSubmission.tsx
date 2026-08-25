import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, InputNumber, Select, Space, Table, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROOT } from "../shared/api/base";
import { getSessionUser } from "../shared/auth/session";
import { getDepartments, getPredictions, toBudgetNumber, type BudgetPrediction, type Department } from "../shared/api/departmentBudget";
import { UserRole } from "../shared/types/roles";

const { Title, Text } = Typography;

interface SubmissionRecord {
  id: number;
  departmentId: number;
  targetYear: number;
  targetMonth: number;
  requestedAmount: number;
  reason: string;
  status: string;
  requestType: string;
  requestedAt: string;
  reviewNotes?: string;
  department?: { name: string };
}

const NextMonthBudgetSubmission: React.FC = () => {
  const navigate = useNavigate();
  const sessionUser = getSessionUser();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>();
  const [prediction, setPrediction] = useState<BudgetPrediction | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [editingSubmission, setEditingSubmission] = useState<SubmissionRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const now = new Date();
  const targetMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  const targetYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const financeRoles = [UserRole.ADMIN, UserRole.TREASURY_FINANCE_OFFICER, UserRole.BUDGET_CONTROLLER];

  const visibleDepartments = useMemo(() => {
    if (sessionUser?.role && financeRoles.includes(sessionUser.role as UserRole)) return departments;
    const value = String(sessionUser?.department ?? "").toLowerCase();
    return departments.filter(d => d.code.toLowerCase() === value || d.name.toLowerCase() === value);
  }, [departments, sessionUser?.department, sessionUser?.role]);

  useEffect(() => {
    getDepartments(true).then(items => {
      setDepartments(items);
      const isFinance = sessionUser?.role && financeRoles.includes(sessionUser.role as UserRole);
      const value = String(sessionUser?.department ?? "").toLowerCase();
      const first = items.find(d => isFinance || d.code.toLowerCase() === value || d.name.toLowerCase() === value);
      if (first) {
        setSelectedDepartmentId(first.id);
        form.setFieldValue("departmentId", first.id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) loadDepartmentData(selectedDepartmentId);
  }, [selectedDepartmentId]);

  const loadDepartmentData = async (departmentId: number) => {
    setLoadingPrediction(true);
    try {
      const [predictions, response] = await Promise.all([
        getPredictions(departmentId, { year: targetYear, month: targetMonth, limit: 1 }),
        axios.get(`${API_ROOT}/department-budget/adjustments`, {
          params: { departmentId, targetYear, targetMonth, userId: sessionUser?.id, email: sessionUser?.email }
        })
      ]);
      setPrediction(predictions[0] ?? null);
      setSubmissions((response.data.success ? response.data.data : [])
        .filter((item: SubmissionRecord) => item.requestType === "next_month_submission")
        .map((item: SubmissionRecord) => ({ ...item, requestedAmount: toBudgetNumber(item.requestedAmount) })));
    } catch (error) {
      console.error("Load next-month budget data error:", error);
      message.error("Failed to load prediction and submissions");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleSubmit = async (values: { departmentId: number; requestedAmount: number; reason: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_ROOT}/department-budget/adjustments`, {
        departmentId: values.departmentId,
        targetYear,
        targetMonth,
        requestType: "next_month_submission",
        requestedAmount: values.requestedAmount,
        reason: values.reason,
        requestedBy: sessionUser?.id,
        userId: sessionUser?.id,
        email: sessionUser?.email,
      });
      if (!response.data.success) throw new Error(response.data.message || "Failed to submit budget");
      message.success("Next month budget submitted to Finance");
      setEditingSubmission(null);
      form.resetFields(["requestedAmount", "reason"]);
      await loadDepartmentData(values.departmentId);
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message || "Failed to submit budget");
    } finally {
      setLoading(false);
    }
  };

  const selectedDepartment = departments.find(d => d.id === selectedDepartmentId);
  const hasActiveSubmission = submissions.some(item => ["pending", "approved"].includes(item.status));
  const startEditing = (submission: SubmissionRecord) => {
    setEditingSubmission(submission);
    form.setFieldsValue({ departmentId: submission.departmentId, requestedAmount: submission.requestedAmount, reason: submission.reason });
  };

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/budget/department-overview")} style={{ paddingLeft: 0 }}>
        Back
      </Button>
      <Title level={2}>Submit Next Month Budget</Title>
      <Text type="secondary">Submit one proposed total budget for {targetYear}-{String(targetMonth).padStart(2, "0")}. Finance will review it before it becomes official.</Text>

      <Card style={{ marginTop: 20 }} loading={loadingPrediction} title="Budget Proposal">
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ departmentId: selectedDepartmentId }}>
          <Form.Item name="departmentId" label="Department" rules={[{ required: true, message: "Select a department" }]}>
            <Select disabled={visibleDepartments.length <= 1} onChange={(value: number) => { setSelectedDepartmentId(value); form.resetFields(["requestedAmount", "reason"]); }}>
              {visibleDepartments.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Space size="large" wrap style={{ marginBottom: 18 }}>
            <div><Text type="secondary">Target period</Text><br /><Text strong>{targetYear}-{String(targetMonth).padStart(2, "0")}</Text></div>
            <div><Text type="secondary">AI suggested budget</Text><br /><Text strong style={{ color: "#1677ff" }}>{prediction ? `RM ${toBudgetNumber(prediction.predictedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Not available"}</Text></div>
          </Space>
          <Form.Item name="requestedAmount" label="Proposed Budget" rules={[{ required: true, message: "Enter the proposed budget" }, { type: "number", min: 0.01, message: "Amount must be greater than 0" }]}>
            <InputNumber style={{ width: "100%" }} prefix="RM" precision={2} min={0.01} step={100} disabled={hasActiveSubmission} placeholder="Enter final proposed total" />
          </Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Provide a reason" }, { min: 20, message: "Reason must be at least 20 characters" }]}>
            <Input.TextArea rows={4} maxLength={500} showCount disabled={hasActiveSubmission} placeholder="Explain why this proposed amount is needed" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={hasActiveSubmission}>{editingSubmission ? "Resubmit to Finance" : "Submit to Finance"}</Button>
          {hasActiveSubmission && <Text type="secondary" style={{ marginLeft: 12 }}>An active submission already exists. Edit is available after rejection.</Text>}
          {editingSubmission && <Button type="link" onClick={() => { setEditingSubmission(null); form.resetFields(["requestedAmount", "reason"]); }}>Cancel Edit</Button>}
        </Form>
      </Card>

      <Card title="Submission History" style={{ marginTop: 20 }}>
        <Table<SubmissionRecord> rowKey="id" dataSource={submissions} pagination={false} columns={[
          { title: "Period", render: () => `${targetYear}-${String(targetMonth).padStart(2, "0")}` },
          { title: "AI Suggested", render: () => prediction ? `RM ${toBudgetNumber(prediction.predictedAmount).toFixed(2)}` : "-" },
          { title: "Proposed Budget", dataIndex: "requestedAmount", render: (value: number) => `RM ${toBudgetNumber(value).toFixed(2)}` },
          { title: "Reason", dataIndex: "reason", ellipsis: true },
          { title: "Status", dataIndex: "status", render: (value: string, record: SubmissionRecord) => <Space><Tag color={value === "approved" ? "green" : value === "rejected" ? "red" : "orange"}>{value.toUpperCase()}</Tag>{value === "rejected" && <Button type="link" size="small" onClick={() => startEditing(record)}>Edit & Resubmit</Button>}</Space> },
          { title: "Finance Comment", dataIndex: "reviewNotes", ellipsis: true, render: (value: string) => value || "-" },
        ]} />
        {selectedDepartment && submissions.length === 0 && <Text type="secondary">No submission for {selectedDepartment.name} yet.</Text>}
      </Card>
    </div>
  );
};

export default NextMonthBudgetSubmission;
