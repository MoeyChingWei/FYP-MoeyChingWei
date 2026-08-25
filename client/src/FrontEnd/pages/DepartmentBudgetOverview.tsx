import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, Space, Typography, message, Spin, Table, Tag, Segmented, Dropdown } from "antd";
import { ArrowLeftOutlined, ReloadOutlined, ThunderboltOutlined, FormOutlined, AuditOutlined, CalendarOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BudgetUsageCard } from "../components/budget/BudgetUsageCard";
import { PredictionCard } from "../components/budget/PredictionCard";
import { BudgetUsageChart } from "../components/budget/BudgetUsageChart";
import {
  getHistoricalComparison,
  getOwnBudgetHistory,
  getPredictions,
  type BudgetUsageSummary,
  type BudgetPrediction,
  type HistoricalComparison,
  type OwnBudgetHistoryRow
} from "../shared/api/departmentBudget";
import { API_ROOT } from "../shared/api/base";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import styles from "./DepartmentBudgetOverview.module.css";

const { Title } = Typography;

interface ForecastDepartment {
  id: number;
  code: string;
  name: string;
}

interface ForecastResponse {
  success: boolean;
  data: {
    historical: Array<{ period: string; totalAmount: number; requestCount: number }>;
    forecast: Array<{ period: string; forecastAmount: number; confidence: "high" | "medium" | "low" }>;
    summary: { avgPerPeriod: number };
  };
}

const DEPARTMENT_OVERVIEW_ROLES = new Set<string>([
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNT_PAYABLE,
  UserRole.TREASURY_FINANCE_OFFICER,
  UserRole.PAYMENT_TEAM,
  UserRole.BUDGET_CONTROLLER,
]);

function matchesDepartment(department: ForecastDepartment, userDepartment?: string | null): boolean {
  const normalizedUserDepartment = String(userDepartment ?? "").trim().toLowerCase();
  return Boolean(normalizedUserDepartment) && (
    department.code.trim().toLowerCase() === normalizedUserDepartment ||
    department.name.trim().toLowerCase() === normalizedUserDepartment
  );
}

export const DepartmentBudgetOverview: React.FC = () => {
  const navigate = useNavigate();
  const [sessionUser] = useState(() => getSessionUser());
  const [departments, setDepartments] = useState<ForecastDepartment[]>([]);
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState<string | null>(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [usage, setUsage] = useState<BudgetUsageSummary | null>(null);
  const [predictions, setPredictions] = useState<BudgetPrediction[]>([]);
  const [historical, setHistorical] = useState<HistoricalComparison | null>(null);
  const [ownBudgetHistory, setOwnBudgetHistory] = useState<OwnBudgetHistoryRow[]>([]);
  const [ownDepartmentName, setOwnDepartmentName] = useState("");
  const [loadingOwnHistory, setLoadingOwnHistory] = useState(false);
  const [historyMonths, setHistoryMonths] = useState(3);
  const [historyStatus, setHistoryStatus] = useState<string>("all");
  const [activeView, setActiveView] = useState<"history" | "prediction" | "trend">("history");

  const [loadingUsage, setLoadingUsage] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [loadingHistorical, setLoadingHistorical] = useState(false);
  const [triggeringPrediction, setTriggeringPrediction] = useState(false);

  const canViewAllDepartments = DEPARTMENT_OVERVIEW_ROLES.has(sessionUser?.role ?? "");
  const canGeneratePrediction = Boolean(
    sessionUser?.role && sessionUser.role !== UserRole.EMPLOYEE
  );

  useEffect(() => {
    loadDepartments();
    loadOwnBudgetHistory();
  }, []);

  const loadOwnBudgetHistory = async () => {
    setLoadingOwnHistory(true);
    const result = await getOwnBudgetHistory();
    setOwnBudgetHistory(result?.rows ?? []);
    setOwnDepartmentName(result?.department?.name ?? sessionUser?.department ?? "My Department");
    setLoadingOwnHistory(false);
  };

  useEffect(() => {
    if (selectedDepartmentCode) {
      loadBudgetData();
    }
  }, [selectedDepartmentCode]);

  const loadDepartments = async () => {
    try {
      const params = new URLSearchParams({
        userId: String(sessionUser?.id ?? ""),
        email: String(sessionUser?.email ?? ""),
      });
      const response = await fetch(`${API_ROOT}/department-budget/departments?${params}`);
      const result = await response.json();
      const allDepartments: ForecastDepartment[] = result.success ? result.data ?? [] : [];
      const availableDepartments = canViewAllDepartments
        ? allDepartments
        : allDepartments.filter((department) => matchesDepartment(department, sessionUser?.department));

      setDepartments(availableDepartments);
      if (availableDepartments.length === 0) {
        setSelectedDepartmentCode(null);
        message.warning("No purchasing forecast data is available for your department");
        return;
      }

      if (!selectedDepartmentCode || !availableDepartments.some(
        (department) => department.code === selectedDepartmentCode || department.name === selectedDepartmentCode
      )) {
        setSelectedDepartmentCode(availableDepartments[0].name);
      }
    } catch (error) {
      console.error("Load purchasing departments error:", error);
      message.error("Failed to load departments");
    }
  };

  const loadBudgetData = async () => {
    if (!selectedDepartmentCode) return;

    setLoadingUsage(true);
    setLoadingPredictions(true);
    setLoadingHistorical(true);

    try {
      const forecastParams = new URLSearchParams({
        period: "monthly",
        departmentCode: selectedDepartmentCode,
      });
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const department = departments.find((dept) =>
        dept.code === selectedDepartmentCode || dept.name === selectedDepartmentCode
      );
      const forecastResponse = await fetch(`${API_ROOT}/budget/forecast?${forecastParams}`);
      const result: ForecastResponse = await forecastResponse.json();
      if (!result.success) throw new Error("Forecast request failed");

      const selectedPeriod = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
      const currentPeriodData = result.data.historical.find((item) => item.period === selectedPeriod);
      const averageAmount = result.data.summary.avgPerPeriod;
      let budgetUsage: BudgetUsageSummary | null = null;
      if (department?.id && sessionUser?.id && sessionUser.email) {
        const usageParams = new URLSearchParams({
          userId: String(sessionUser.id),
          email: sessionUser.email,
          year: String(currentYear),
          month: String(currentMonth),
        });
        const usageResponse = await fetch(
          `${API_ROOT}/department-budget/usage/${department.id}?${usageParams}`
        );
        const usageResult = await usageResponse.json();
        if (usageResult.success) budgetUsage = usageResult.data;
      }

      const allocatedAmount = budgetUsage?.allocatedAmount ?? averageAmount;
      const spentAmount = budgetUsage?.spentAmount ?? currentPeriodData?.totalAmount ?? 0;
      const reservedAmount = budgetUsage?.reservedAmount ?? 0;
      const remainingAmount = budgetUsage?.remainingAmount ?? allocatedAmount - spentAmount;
      const usagePercentage = budgetUsage?.usagePercentage ?? (
        allocatedAmount > 0 ? (spentAmount / allocatedAmount) * 100 : 0
      );

      setUsage({
        budgetId: budgetUsage?.budgetId ?? 0,
        department: budgetUsage?.department ?? {
          id: department?.id ?? 0,
          code: department?.code ?? selectedDepartmentCode,
          name: department?.name ?? selectedDepartmentCode,
        },
        year: currentYear,
        month: currentMonth,
        allocatedAmount,
        spentAmount,
        reservedAmount,
        remainingAmount,
        usagePercentage,
        status: usagePercentage > 100 ? "exceeded" : usagePercentage >= 80 ? "warning" : "normal",
      });

      const storedPredictions = department?.id && sessionUser?.id && sessionUser.email
        ? await getPredictions(department.id, { year: nextYear, month: nextMonth, limit: 1 })
        : [];
      setPredictions(storedPredictions);

      const historicalComparison = department?.id
        ? await getHistoricalComparison(department.id, { preset: "last-6-months" })
        : null;
      setHistorical(historicalComparison);
    } catch (error) {
      console.error("Load budget data error:", error);
      message.error("Failed to load budget data");
    } finally {
      setLoadingUsage(false);
      setLoadingPredictions(false);
      setLoadingHistorical(false);
    }
  };

  const handleTriggerPrediction = async () => {
    if (!selectedDepartmentCode || !sessionUser?.id || !sessionUser.email) return;

    setTriggeringPrediction(true);
    message.loading({
      key: "generate-prediction",
      content: "AI Agent is analyzing purchasing history...",
      duration: 0,
    });
    try {
      const department = departments.find((dept) =>
        dept.code === selectedDepartmentCode || dept.name === selectedDepartmentCode
      );
      if (!department) throw new Error("Department not found");

      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const response = await fetch(`${API_ROOT}/department-budget/predict/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentCode: department.name,
          targetYear: nextYear,
          targetMonth: nextMonth,
          userId: sessionUser.id,
          email: sessionUser.email,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to generate prediction");
      }
      await loadBudgetData();
      const usedFallback = Boolean(result.data?.comparisonData?.usedFallback);
      message[usedFallback ? "warning" : "success"]({
        key: "generate-prediction",
        content: usedFallback
          ? `System fallback prediction generated for ${nextYear}-${String(nextMonth).padStart(2, "0")}`
          : `AI prediction generated for ${nextYear}-${String(nextMonth).padStart(2, "0")}`,
      });
    } catch (error: any) {
      console.error("Trigger prediction error:", error);
      message.error({
        key: "generate-prediction",
        content: error.message || "Failed to generate prediction",
      });
    } finally {
      setTriggeringPrediction(false);
    }
  };

  const filteredBudgetHistory = ownBudgetHistory
    .slice(0, historyMonths)
    .filter((row) => historyStatus === "all" || row.status === historyStatus);

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/budget-management")}
          className={styles.backButton}
        >
          Back
        </Button>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.headingBlock}>
          <div className={styles.eyebrow}>Budget Management</div>
          <Title level={2} className={styles.title}>Department Budget Forecasting</Title>
          <div className={styles.subtitle}>Review current usage and prepare the next monthly allocation.</div>
        </div>
        <div className={styles.controls}>
          <Space wrap size={[8, 8]}>
            <Select
              className={styles.departmentSelect}
              value={selectedDepartmentCode}
              onChange={setSelectedDepartmentCode}
              placeholder="Select Department"
              disabled={!canViewAllDepartments}
              options={departments.map((department) => ({ value: department.name, label: department.name }))}
            />
            <Button icon={<ReloadOutlined />} onClick={loadBudgetData}>Refresh</Button>
            {canGeneratePrediction && (
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={handleTriggerPrediction}
                loading={triggeringPrediction}
                disabled={!selectedDepartmentCode}
              >
                {triggeringPrediction ? "Generating..." : "Generate Prediction"}
              </Button>
            )}
            <Button icon={<CalendarOutlined />} onClick={() => navigate("/budget/next-month-submission")}>
              Submit Next Month Budget
            </Button>
            <Dropdown menu={{ items: [
              { key: "adjustment", icon: <FormOutlined />, label: "Request Adjustment", onClick: () => navigate("/budget/adjustment-request") },
              ...(canViewAllDepartments ? [{ key: "approval", icon: <AuditOutlined />, label: "Approval Queue", onClick: () => navigate("/budget/approval-queue") }] : []),
            ] }}>
              <Button icon={<MoreOutlined />}>More actions</Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          {loadingUsage ? (
            <Card><Spin /></Card>
          ) : usage ? (
            <BudgetUsageCard usage={usage} />
          ) : (
            <Card>No budget data for selected period</Card>
          )}
        </Col>
        <Col span={24}>
          <div className={styles.viewBar}>
            <div>
              <div className={styles.sectionEyebrow}>Department workspace</div>
              <div className={styles.sectionTitle}>
                {activeView === "history" ? "Budget history" : activeView === "prediction" ? "AI forecast" : "Spending trend"}
              </div>
            </div>
            <Segmented
              value={activeView}
              onChange={(value) => setActiveView(value as "history" | "prediction" | "trend")}
              options={[
                { label: "Budget history", value: "history" },
                { label: "AI forecast", value: "prediction" },
                { label: "Spending trend", value: "trend" },
              ]}
            />
          </div>

          {activeView === "history" && (
            <Card
              title={`Budget History - ${ownDepartmentName || "My Department"}`}
              extra={(
                <Space wrap>
                  <Select value={historyMonths} onChange={setHistoryMonths} style={{ width: 140 }} options={[
                    { value: 3, label: "Last 3 months" },
                    { value: 6, label: "Last 6 months" },
                    { value: 12, label: "Last 12 months" },
                  ]} />
                  <Select value={historyStatus} onChange={setHistoryStatus} style={{ width: 150 }} options={[
                    { value: "all", label: "All statuses" },
                    { value: "approved", label: "Approved" },
                    { value: "ai_auto_generated", label: "AI auto-generated" },
                    { value: "pending", label: "Pending approval" },
                    { value: "rejected", label: "Rejected" },
                    { value: "not_set", label: "No budget set" },
                  ]} />
                  <Button icon={<ReloadOutlined />} onClick={loadOwnBudgetHistory} loading={loadingOwnHistory}>Refresh</Button>
                </Space>
              )}
              loading={loadingOwnHistory}
            >
              <Table rowKey="period" dataSource={filteredBudgetHistory} pagination={false} columns={[
                { title: "Month", dataIndex: "period" },
                { title: "Budget Amount", dataIndex: "allocatedAmount", render: (value: number | null) => value == null ? <span className={styles.mutedValue}>No budget set</span> : `RM ${value.toFixed(2)}` },
                { title: "Status", dataIndex: "status", render: (value: OwnBudgetHistoryRow["status"]) => {
                  const config = { approved: ["green", "Approved"], ai_auto_generated: ["blue", "AI auto-generated"], pending: ["orange", "Pending approval"], rejected: ["red", "Rejected"], not_set: ["default", "No budget set"] }[value] || ["default", "No budget set"];
                  return <Tag color={config[0]}>{config[1]}</Tag>;
                } },
                { title: "Source", dataIndex: "source", render: (value: string | null) => value || "-" },
                { title: "Spent", dataIndex: "spentAmount", render: (value: number | null) => value == null ? "-" : `RM ${value.toFixed(2)}` },
              ]} />
            </Card>
          )}

          {activeView === "prediction" && (
            <Card title="AI Budget Predictions" loading={loadingPredictions}>
              {predictions.length > 0 ? <div className={styles.predictionGrid}>{predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}</div> : <div className={styles.emptyState}>No predictions available. Generate a prediction to create one.</div>}
            </Card>
          )}

          {activeView === "trend" && historical && (
            <BudgetUsageChart data={historical.historicalData} loading={loadingHistorical} summary={historical.summary} title="Historical Budget vs Actual Purchasing Spend" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DepartmentBudgetOverview;
